<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'category_name',
        'price',
        'original_price',
        'discount_percent',
        'image',
        'secondary_image',
        'images',
        'upsell_ids',
        'description',
        'rating',
        'review_count',
        'in_stock',
        'stock_quantity',
        'is_featured',
        'is_best_seller',
        'shipping_type',
        'shipping_fee',
    ];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'discount_percent' => 'integer',
        'rating' => 'float',
        'review_count' => 'integer',
        'in_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'is_featured' => 'boolean',
        'is_best_seller' => 'boolean',
        'shipping_fee' => 'float',
        'images' => 'array',
        'upsell_ids' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collection_product')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order', 'asc');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
