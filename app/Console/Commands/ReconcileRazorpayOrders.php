<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\RazorpayService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ReconcileRazorpayOrders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'razorpay:reconcile {--hours=24 : Number of past hours to inspect}';

    /**
     * The console command description.
     */
    protected $description = 'Reconcile pending Razorpay orders against Razorpay API to catch dropped connections.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $this->info("Scanning pending Razorpay orders from the past {$hours} hours...");

        if (! RazorpayService::isConfigured()) {
            $this->warn('Razorpay credentials are not configured. Skipping live API reconciliation.');

            return self::SUCCESS;
        }

        $pendingOrders = Order::where('payment_method', 'RAZORPAY')
            ->where('payment_status', 'pending')
            ->whereNotNull('razorpay_order_id')
            ->where('created_at', '>=', now()->subHours($hours))
            ->get();

        $this->info("Found {$pendingOrders->count()} pending order(s) to check.");
        $reconciledCount = 0;

        foreach ($pendingOrders as $order) {
            $paymentsResponse = RazorpayService::fetchOrderPayments($order->razorpay_order_id);

            if (! $paymentsResponse || empty($paymentsResponse['items'])) {
                continue;
            }

            foreach ($paymentsResponse['items'] as $payment) {
                if (($payment['status'] ?? '') === 'captured') {
                    $paymentId = $payment['id'];

                    $order->update([
                        'payment_status' => 'paid',
                        'status' => $order->status === 'pending' ? 'processing' : $order->status,
                        'razorpay_payment_id' => $paymentId,
                        'payment_details' => $payment,
                        'notes' => trim(($order->notes ?? '')."\n[Automated Cron] Reconciled payment ({$paymentId}) confirmed via Razorpay API."),
                    ]);

                    $reconciledCount++;
                    $this->info("Reconciled Order #{$order->order_number} (Payment ID: {$paymentId})");
                    Log::info("Reconcile Command: Order #{$order->order_number} auto-marked as PAID.");
                    break;
                }
            }
        }

        $this->info("Reconciliation complete. {$reconciledCount} order(s) updated to PAID.");

        return self::SUCCESS;
    }
}
