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
        Schema::table('customers', function (Blueprint $table) {
            $table->string('address')->nullable()->after('city');
            $table->string('state')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('state');
            $table->string('status')->default('active')->after('avatar');
            $table->text('notes')->nullable()->after('status');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['address', 'state', 'postal_code', 'status', 'notes']);
            $table->dropSoftDeletes();
        });
    }
};
