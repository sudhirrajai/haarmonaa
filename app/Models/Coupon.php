<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'type',
        'value',
        'min_spend',
        'max_discount',
        'usage_limit',
        'usage_limit_per_user',
        'usage_count',
        'start_date',
        'expires_at',
        'is_active',
        'allow_stacking',
        'applicable_products',
        'applicable_categories',
        'applicable_collections',
    ];

    protected $casts = [
        'value' => 'float',
        'min_spend' => 'float',
        'max_discount' => 'float',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'usage_count' => 'integer',
        'start_date' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'allow_stacking' => 'boolean',
        'applicable_products' => 'array',
        'applicable_categories' => 'array',
        'applicable_collections' => 'array',
    ];

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }
}
