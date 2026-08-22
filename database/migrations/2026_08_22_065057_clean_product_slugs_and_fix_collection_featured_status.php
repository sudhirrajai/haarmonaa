<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('products')) {
            $products = Product::all();
            foreach ($products as $p) {
                if (preg_match('/-\d{8,12}$/', $p->slug) || empty($p->slug)) {
                    $cleanSlug = preg_replace('/-\d{8,12}$/', '', $p->slug);
                    if (empty($cleanSlug)) {
                        $cleanSlug = Str::slug($p->name);
                    }
                    $baseSlug = $cleanSlug;
                    $counter = 1;
                    while (Product::where('slug', $cleanSlug)->where('id', '!=', $p->id)->exists()) {
                        $cleanSlug = "{$baseSlug}-{$counter}";
                        $counter++;
                    }
                    $p->slug = $cleanSlug;
                    $p->save();
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
