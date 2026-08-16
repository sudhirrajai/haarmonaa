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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('category_name')->default('Jewelry');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->integer('discount_percent')->nullable();
            $table->string('image');
            $table->string('secondary_image')->nullable();
            $table->text('description')->nullable();
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->integer('review_count')->default(0);
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->default(50);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
