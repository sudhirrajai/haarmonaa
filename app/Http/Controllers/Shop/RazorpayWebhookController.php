<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RazorpayWebhookController extends Controller
{
    /**
     * Handle incoming Razorpay Webhooks.
     */
    public function handle(Request $request): JsonResponse
    {
        $rawPayload = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature', '');

        // 1. Verify Webhook Signature
        if (! empty(RazorpayService::getWebhookSecret())) {
            if (! RazorpayService::verifyWebhookSignature($rawPayload, $signature)) {
                Log::warning('Razorpay Webhook: Invalid signature received.');

                return response()->json(['error' => 'Invalid signature'], 400);
            }
        }

        $eventData = json_decode($rawPayload, true);
        if (! $eventData || empty($eventData['event'])) {
            return response()->json(['error' => 'Empty or invalid event'], 400);
        }

        $event = $eventData['event'];
        $payload = $eventData['payload'] ?? [];

        Log::info("Razorpay Webhook Received Event: {$event}");

        switch ($event) {
            case 'payment.captured':
            case 'order.paid':
                $this->handlePaymentCaptured($payload);
                break;

            case 'payment.failed':
                $this->handlePaymentFailed($payload);
                break;

            case 'refund.processed':
                $this->handleRefundProcessed($payload);
                break;

            default:
                Log::info("Razorpay Webhook: Ignored unhandled event [{$event}]");
                break;
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle successful payment capture / order paid.
     */
    protected function handlePaymentCaptured(array $payload): void
    {
        $payment = $payload['payment']['entity'] ?? [];
        $razorpayOrderId = $payment['order_id'] ?? ($payload['order']['entity']['id'] ?? null);
        $paymentId = $payment['id'] ?? null;
        $amountPaid = isset($payment['amount']) ? ((float) $payment['amount']) / 100 : null;
        $notes = $payment['notes'] ?? ($payload['order']['entity']['notes'] ?? []);
        $orderNumber = $notes['order_number'] ?? null;

        if (! $razorpayOrderId && ! $orderNumber && ! $paymentId) {
            Log::warning('Razorpay Webhook: Missing order identifiers in payment.captured');

            return;
        }

        // Find the Order
        $order = Order::where(function ($q) use ($razorpayOrderId, $orderNumber, $paymentId) {
            if ($razorpayOrderId) {
                $q->where('razorpay_order_id', $razorpayOrderId);
            }
            if ($orderNumber) {
                $q->orWhere('order_number', $orderNumber);
            }
            if ($paymentId) {
                $q->orWhere('razorpay_payment_id', $paymentId);
            }
        })->first();

        if ($order) {
            if ($order->payment_status === 'paid') {
                Log::info("Razorpay Webhook: Order #{$order->order_number} is already marked as paid (Idempotent).");

                return;
            }

            $order->update([
                'payment_status' => 'paid',
                'status' => $order->status === 'pending' ? 'processing' : $order->status,
                'razorpay_payment_id' => $paymentId ?? $order->razorpay_payment_id,
                'payment_details' => array_merge($order->payment_details ?? [], [
                    'webhook_captured_at' => now()->toIso8601String(),
                    'method' => $payment['method'] ?? 'online',
                    'bank' => $payment['bank'] ?? null,
                    'wallet' => $payment['wallet'] ?? null,
                    'vpa' => $payment['vpa'] ?? null,
                ]),
                'notes' => trim(($order->notes ?? '')."\n[Webhook] Payment verified & captured via Razorpay ({$paymentId})."),
            ]);

            Log::info("Razorpay Webhook: Order #{$order->order_number} successfully finalized to PAID.");
        } else {
            // Edge-Case: Payment captured on Razorpay but user dropped connection before Order was saved
            Log::alert('Razorpay Webhook: Payment captured for unknown order. Creating Emergency Safety Order.', [
                'razorpay_order_id' => $razorpayOrderId,
                'payment_id' => $paymentId,
                'amount' => $amountPaid,
                'email' => $payment['email'] ?? null,
            ]);

            $emergencyOrderNumber = 'ORD-'.date('Y').'-REC-'.strtoupper(Str::random(6));

            Order::create([
                'order_number' => $emergencyOrderNumber,
                'customer_name' => $payment['notes']['customer_name'] ?? ($payment['contact'] ?? 'Razorpay Customer'),
                'customer_email' => $payment['email'] ?? 'support@haarmonaa.com',
                'customer_phone' => $payment['contact'] ?? '9999999999',
                'shipping_address' => $payment['notes']['address'] ?? 'Address verification pending (Automated Recovery)',
                'city' => $payment['notes']['city'] ?? 'India',
                'postal_code' => $payment['notes']['postal_code'] ?? '000000',
                'subtotal' => $amountPaid ?? 0,
                'total_amount' => $amountPaid ?? 0,
                'currency' => '₹',
                'status' => 'processing',
                'payment_method' => 'RAZORPAY',
                'payment_status' => 'paid',
                'razorpay_order_id' => $razorpayOrderId,
                'razorpay_payment_id' => $paymentId,
                'payment_details' => $payment,
                'notes' => "[Automated Recovery] Payment received (ID: {$paymentId}) but connection was interrupted during checkout. Order created automatically for 24-hr fulfillment or refund.",
            ]);
        }
    }

    /**
     * Handle payment failure event.
     */
    protected function handlePaymentFailed(array $payload): void
    {
        $payment = $payload['payment']['entity'] ?? [];
        $razorpayOrderId = $payment['order_id'] ?? null;
        $errorDescription = $payment['error_description'] ?? 'Payment failed on gateway.';

        if ($razorpayOrderId) {
            $order = Order::where('razorpay_order_id', $razorpayOrderId)->first();
            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'payment_status' => 'failed',
                    'notes' => trim(($order->notes ?? '')."\n[Razorpay] Payment attempt failed: {$errorDescription}"),
                ]);
            }
        }
    }

    /**
     * Handle refund processed event.
     */
    protected function handleRefundProcessed(array $payload): void
    {
        $refund = $payload['refund']['entity'] ?? [];
        $paymentId = $refund['payment_id'] ?? null;
        $refundId = $refund['id'] ?? null;
        $amountRefunded = isset($refund['amount']) ? ((float) $refund['amount']) / 100 : null;

        if ($paymentId) {
            $order = Order::where('razorpay_payment_id', $paymentId)->first();
            if ($order) {
                $order->update([
                    'payment_status' => 'refunded',
                    'status' => 'cancelled',
                    'notes' => trim(($order->notes ?? '')."\n[Razorpay Refund] Refund of ₹{$amountRefunded} processed (ID: {$refundId})."),
                ]);
            }
        }
    }
}
