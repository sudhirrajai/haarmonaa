<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    private function formatProduct(Product $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'price' => (float) $p->price,
            'originalPrice' => $p->original_price ? (float) $p->original_price : null,
            'rating' => (float) $p->rating,
            'reviewCount' => (int) $p->review_count,
            'image' => $p->image,
            'secondaryImage' => $p->secondary_image,
            'images' => $p->images ?: [],
            'isHot' => (bool) $p->is_featured,
            'isNew' => (bool) $p->is_best_seller,
            'discountPercent' => $p->discount_percent,
            'category' => $p->category_name,
            'categories' => $p->categories->pluck('name')->all(),
            'description' => $p->description,
            'inStock' => (bool) $p->in_stock,
            'stockQuantity' => (int) $p->stock_quantity,
            'variants' => $p->variants->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'sku' => $v->sku,
                'price' => $v->price ? (float) $v->price : (float) $p->price,
                'stockQuantity' => (int) $v->stock_quantity,
                'image' => $v->image ?: $p->image,
                'attributes' => $v->attributes,
            ])->all(),
        ];
    }

    /**
     * Dedicated SEO Category Landing Page (/category/{slug})
     */
    public function show(Request $request, string $slug): Response
    {
        // 1. Find Category by Slug or ID with parent and children
        $category = Category::with(['parent', 'children'])
            ->where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->orWhere('slug', 'like', $slug.'%')
            ->first();

        // If not found in categories, check if it's a Collection slug
        if (! $category) {
            $collection = Collection::where('slug', $slug)
                ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
                ->first();

            if ($collection) {
                return $this->showCollection($request, $slug);
            }

            abort(404, 'Category not found');
        }

        // 2. Collect category IDs & names (including all subcategories)
        $categoryIds = array_merge([$category->id], $category->children->pluck('id')->all());
        $categoryNames = array_merge([$category->name], $category->children->pluck('name')->all());

        // 3. Fetch all products belonging to this category or its subcategories
        $query = Product::with(['category', 'categories', 'variants'])
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', 'published');
            })
            ->where(function ($q) use ($categoryIds, $categoryNames) {
                $q->whereIn('category_id', $categoryIds)
                    ->orWhereIn('category_name', $categoryNames)
                    ->orWhereHas('categories', function ($cq) use ($categoryIds) {
                        $cq->whereIn('categories.id', $categoryIds);
                    });
            });

        // Sorting
        $sort = $request->query('sort', 'featured');
        if ($sort === 'price-low') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price-high') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'newest') {
            $query->latest();
        } else {
            $query->orderBy('is_featured', 'desc')->latest();
        }

        $products = $query->get()->map(fn ($p) => $this->formatProduct($p))->values()->all();

        // 4. Other categories for sidebar / navigation
        $allCategories = Category::with(['parent', 'children'])
            ->withCount('products')
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'parent_id' => $c->parent_id,
                'name' => $c->name,
                'slug' => $c->slug,
                'itemCount' => $c->products_count,
                'image' => $c->image,
                'children' => $c->children->map(fn ($child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ])->all(),
            ])->all();

        $storeName = Setting::get('store_name', 'Haarmonaa');
        $metaTitle = "{$category->name} Jewelry Collection — 18K Solid Gold Vermeil | {$storeName}";
        $metaDesc = $category->description
            ?: "Explore luxury handcrafted {$category->name} in 18K thick solid gold vermeil. Waterproof, anti-tarnish, and hypoallergenic jewelry designed for everyday elegance.";

        $breadcrumbs = [
            ['label' => 'Home', 'url' => '/'],
            ['label' => 'Jewelry', 'url' => '/shop'],
        ];

        if ($category->parent) {
            $breadcrumbs[] = [
                'label' => $category->parent->name,
                'url' => "/category/{$category->parent->slug}",
            ];
        }

        $breadcrumbs[] = [
            'label' => $category->name,
            'url' => "/category/{$category->slug}",
        ];

        return Inertia::render('Shop/Category', [
            'category' => [
                'id' => $category->id,
                'parent_id' => $category->parent_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => $category->image,
                'productsCount' => count($products),
                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                    'slug' => $category->parent->slug,
                ] : null,
                'subcategories' => $category->children->map(fn ($child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'image' => $child->image,
                ])->values()->all(),
            ],
            'products' => $products,
            'categories' => $allCategories,
            'seo' => [
                'title' => $metaTitle,
                'description' => $metaDesc,
                'canonical' => url("/category/{$category->slug}"),
                'ogImage' => $category->image ? url($category->image) : null,
                'breadcrumbs' => $breadcrumbs,
            ],
        ]);
    }

    /**
     * Dedicated SEO Collection Landing Page (/collection/{slug})
     */
    public function showCollection(Request $request, string $slug): Response
    {
        $collection = Collection::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->with(['products' => function ($q) {
                $q->where(function ($sq) {
                    $sq->whereNull('status')->orWhere('status', 'published');
                })->with(['category', 'categories', 'variants']);
            }])
            ->firstOrFail();

        $products = $collection->products->sortByDesc('id')->map(fn ($p) => $this->formatProduct($p))->values()->all();

        $allCategories = Category::withCount('products')->get()->map(fn ($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
            'itemCount' => $c->products_count,
            'image' => $c->image,
        ])->all();

        $storeName = Setting::get('store_name', 'Haarmonaa');
        $metaTitle = "{$collection->name} — Curated Edition | {$storeName}";
        $metaDesc = $collection->description
            ?: "Shop the {$collection->name} capsule collection. Handcrafted 18k gold vermeil heirlooms curated for modern luxury.";

        return Inertia::render('Shop/Category', [
            'category' => [
                'id' => $collection->id,
                'name' => $collection->name,
                'slug' => $collection->slug,
                'tagline' => $collection->tagline,
                'description' => $collection->description,
                'image' => $collection->banner_image ?: $collection->image,
                'productsCount' => count($products),
                'isCollection' => true,
            ],
            'products' => $products,
            'categories' => $allCategories,
            'seo' => [
                'title' => $metaTitle,
                'description' => $metaDesc,
                'canonical' => url("/collection/{$collection->slug}"),
                'ogImage' => $collection->banner_image ? url($collection->banner_image) : ($collection->image ? url($collection->image) : null),
                'breadcrumbs' => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'Collections', 'url' => '/shop'],
                    ['label' => $collection->name, 'url' => "/collection/{$collection->slug}"],
                ],
            ],
        ]);
    }
}
