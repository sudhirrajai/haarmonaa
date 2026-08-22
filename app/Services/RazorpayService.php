<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RazorpayService
{
    /**
     * Get active Razorpay Key ID (from Admin Settings or .env fallback).
     */
    public static function getKeyId(): string
    {
        $dbKey = Setting::get('razorpay_key_id');
        if (! empty($dbKey)) {
            return trim($dbKey);
        }

        return config('services.razorpay.key', env('RAZORPAY_KEY_ID', env('RAZORPAY_KEY', 'rzp_test_demo123456')));
    }

    /**
     * Get active Razorpay Key Secret.
     */
    public static function getKeySecret(): string
    {
        $dbSecret = Setting::get('razorpay_key_secret');
        if (! empty($dbSecret)) {
            return trim($dbSecret);
        }

        return config('services.razorpay.secret', env('RAZORPAY_KEY_SECRET', env('RAZORPAY_SECRET', '')));
    }

    /**
     * Get active Razorpay Webhook Secret.
     */
    public static function getWebhookSecret(): string
    {
        $dbWebhook = Setting::get('razorpay_webhook_secret');
        if (! empty($dbWebhook)) {
            return trim($dbWebhook);
        }

        return config('services.razorpay.webhook_secret', env('RAZORPAY_WEBHOOK_SECRET', ''));
    }

    /**
     * Check if Razorpay is configured with real credentials.
     */
    public static function isConfigured(): bool
    {
        $key = self::getKeyId();
        $secret = self::getKeySecret();

        return ! empty($key) && ! empty($secret) && ! str_contains($key, 'demo123456');
    }

    /**
     * Create a Razorpay Order on the API.
     * Amount is passed in INR (floats), converted to paise (integer) internally.
     */
    public static function createOrder(float $amount, string $receipt, array $notes = []): array
    {
        $keyId = self::getKeyId();
        $keySecret = self::getKeySecret();
        $amountInPaise = (int) round($amount * 100);

        if (! self::isConfigured()) {
            // Safe fallback for local development / test mock
            return [
                'id' => 'order_mock_'.time().'_'.substr(md5($receipt), 0, 8),
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'receipt' => $receipt,
                'status' => 'created',
                'is_mock' => true,
            ];
        }

        try {
            $response = Http::withBasicAuth($keyId, $keySecret)
                ->timeout(15)
                ->post('https://api.razorpay.com/v1/orders', [
                    'amount' => $amountInPaise,
                    'currency' => 'INR',
                    'receipt' => $receipt,
                    'notes' => $notes,
                    'payment_capture' => 1,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Razorpay Order Creation Failed: '.$response->body(), [
                'receipt' => $receipt,
                'amount' => $amount,
            ]);

            throw new \Exception('Razorpay API error: '.($response->json('error.description') ?? 'Order creation failed'));
        } catch (\Exception $e) {
            Log::error('Razorpay HTTP Exception: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Cryptographic verification of Razorpay Payment Signature (HMAC SHA256).
     */
    public static function verifyPaymentSignature(string $razorpayOrderId, string $razorpayPaymentId, string $razorpaySignature): bool
    {
        $keySecret = self::getKeySecret();

        if (empty($keySecret) || str_starts_with($razorpayOrderId, 'order_mock_')) {
            // In mock / test demo mode with empty secret
            return true;
        }

        $expectedSignature = hash_hmac('sha256', $razorpayOrderId.'|'.$razorpayPaymentId, $keySecret);

        return hash_equals($expectedSignature, $razorpaySignature);
    }

    /**
     * Cryptographic verification of Razorpay Webhook Signature.
     */
    public static function verifyWebhookSignature(string $rawPayload, string $signatureHeader): bool
    {
        $webhookSecret = self::getWebhookSecret();

        if (empty($webhookSecret)) {
            Log::warning('Razorpay Webhook Secret not configured. Webhook rejected for security.');

            return false;
        }

        $expectedSignature = hash_hmac('sha256', $rawPayload, $webhookSecret);

        return hash_equals($expectedSignature, $signatureHeader);
    }

    /**
     * Fetch payment details from Razorpay API.
     */
    public static function fetchPayment(string $paymentId): ?array
    {
        if (! self::isConfigured() || str_starts_with($paymentId, 'pay_mock_')) {
            return null;
        }

        try {
            $response = Http::withBasicAuth(self::getKeyId(), self::getKeySecret())
                ->timeout(10)
                ->get("https://api.razorpay.com/v1/payments/{$paymentId}");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Failed to fetch Razorpay payment: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Fetch all payments for a given Razorpay Order ID.
     */
    public static function fetchOrderPayments(string $razorpayOrderId): ?array
    {
        if (! self::isConfigured() || str_starts_with($razorpayOrderId, 'order_mock_')) {
            return null;
        }

        try {
            $response = Http::withBasicAuth(self::getKeyId(), self::getKeySecret())
                ->timeout(10)
                ->get("https://api.razorpay.com/v1/orders/{$razorpayOrderId}/payments");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Failed to fetch Razorpay order payments: '.$e->getMessage());

            return null;
        }
    }
}
