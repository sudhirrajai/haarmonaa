<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('shipping_type')->default('default')->after('is_best_seller'); // 'default', 'free', 'flat_rate', 'exclude_free_shipping'
            $table->decimal('shipping_fee', 10, 2)->nullable()->after('shipping_type');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['shipping_type', 'shipping_fee']);
        });
    }
};
