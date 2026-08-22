<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'image',
        'description',
        'item_count',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'category_product');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    public function scopeParents(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }
}
