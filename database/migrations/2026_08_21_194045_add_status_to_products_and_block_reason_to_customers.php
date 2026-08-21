<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('products') && ! Schema::hasColumn('products', 'status')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('status')->default('published')->after('is_best_seller')->index();
            });
        }

        if (Schema::hasTable('customers') && ! Schema::hasColumn('customers', 'block_reason')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->text('block_reason')->nullable()->after('notes');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('products') && Schema::hasColumn('products', 'status')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }

        if (Schema::hasTable('customers') && Schema::hasColumn('customers', 'block_reason')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->dropColumn('block_reason');
            });
        }
    }
};
