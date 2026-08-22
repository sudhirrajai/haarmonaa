<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Product::all()->each(function ($product) {
            if (! empty($product->description)) {
                $cleaned = str_replace(['\\r\\n', '\\n', '\\r', '\\t'], ["\n", "\n", "\n", ' '], $product->description);
                $cleaned = preg_replace('/\s*(data-start|data-end|data-section-id|data-is-last-node|data-is-only-node)="[^"]*"/', '', $cleaned);
                $cleaned = preg_replace('/>\s*\\\\n\s*</', '><', $cleaned);
                $cleaned = preg_replace('/\\\\n/', ' ', $cleaned);
                $cleaned = preg_replace('/<p>\s*<\/p>/', '', $cleaned);

                $product->updateQuietly([
                    'description' => trim($cleaned),
                ]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
