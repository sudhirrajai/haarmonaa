<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Periodic automated Razorpay payment reconciliation
Schedule::command('razorpay:reconcile --hours=24')->hourly();
