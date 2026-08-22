<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
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
            'upsellIds' => $p->upsell_ids ?: [],
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

    private function getProducts(): array
    {
        $products = Product::with(['category', 'categories', 'variants'])
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', 'published');
            })
            ->get();

        return $products->map(fn ($p) => $this->formatProduct($p))->toArray();
    }

    private function getCategories(): array
    {
        $categories = Category::withCount('products')->get();

        return $categories->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'itemCount' => $c->products_count,
                'image' => $c->image ?: 'https://haarmonaa.vmcore.in/wp-content/uploads/2026/01/1.png',
            ];
        })->toArray();
    }

    private function getBanners(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Sculpted By Light',
                'subtitle' => 'CAPTIVATING COLLECTION',
                'badge' => 'NEW ARRIVALS 2026',
                'image' => 'https://raw.githubusercontent.com/uixthemeswp/glozin/refs/heads/main/importer/demo-content/images/jewelry_slide_01.webp',
                'link' => '/shop',
                'buttonText' => 'Shop Collection',
            ],
            [
                'id' => 2,
                'title' => 'Modern Baroque Pearl Series',
                'subtitle' => 'ORGANIC LUXURY',
                'badge' => 'LIMITED RELEASE',
                'image' => 'https://raw.githubusercontent.com/uixthemeswp/glozin/refs/heads/main/importer/demo-content/images/jewelry_slide_02.webp',
                'link' => '/shop?category=earrings',
                'buttonText' => 'Discover Pearls',
            ],
        ];
    }

    public function home(): Response
    {
        $products = $this->getProducts();

        // 1. Featured Collection for Slider (Only products marked as featured by admin, newest first)
        $featured = array_values(array_filter($products, fn ($p) => ! empty($p['isHot'])));
        if (empty($featured)) {
            $featured = array_slice($products, 0, 6);
        } else {
            $featured = array_reverse($featured);
        }

        // 2. Best Selling Products: Exactly 8 products (or random 8 if none sold yet)
        $bestSellers = array_values(array_filter($products, fn ($p) => ($p['rating'] ?? 0) >= 4.8 || ($p['reviewCount'] ?? 0) > 10));
        if (count($bestSellers) < 8) {
            // Shuffle and pick 8
            $shuffled = $products;
            shuffle($shuffled);
            $bestSellers = array_slice($shuffled, 0, 8);
        } else {
            $bestSellers = array_slice($bestSellers, 0, 8);
        }

        // CMS Dynamic Settings
        $heroSliderEnabled = Setting::get('homepage_hero_slider_enabled', '1') !== '0';
        $rawSlides = Setting::get('homepage_slides');
        $slides = $heroSliderEnabled && $rawSlides ? json_decode($rawSlides, true) : ($heroSliderEnabled ? null : []);

        $promoBannersEnabled = Setting::get('homepage_promo_banners_enabled', '1') !== '0';
        $trustBadgesEnabled = Setting::get('homepage_trust_badges_enabled', '1') !== '0';
        $shopByGramEnabled = Setting::get('homepage_shop_by_gram_enabled', '1') !== '0';

        $rawSeasonal = Setting::get('homepage_seasonal_collection');
        $seasonal = $rawSeasonal ? json_decode($rawSeasonal, true) : [
            'enabled' => true,
            'title' => 'Summer Solstice Edition',
            'subtitle' => 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
            'badge' => 'SUMMER 2026 CAPSULE',
            'description' => 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
            'category_slug' => 'summer-solstice-capsule',
            'banner_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
            'button_text' => 'Explore Summer Edit',
            'button_link' => '/shop?category=summer-solstice-capsule',
        ];

        $rawBanners = Setting::get('homepage_promo_banners');
        $banners = $rawBanners ? json_decode($rawBanners, true) : null;

        // Resolve Seasonal Products (Collection products or category products, newest first)
        $seasonalProducts = [];
        if (! empty($seasonal['enabled'])) {
            $seasonalTarget = $seasonal['category_slug'] ?? null;

            // 1. Try to find collection explicitly selected in CMS setting (if set and not 'all')
            $matchedCollection = null;
            if (! empty($seasonalTarget) && $seasonalTarget !== 'all') {
                $matchedCollection = Collection::where('is_active', true)
                    ->where(function ($q) use ($seasonalTarget) {
                        $q->where('slug', $seasonalTarget)
                            ->orWhere('name', 'like', '%'.$seasonalTarget.'%');
                    })
                    ->with(['products' => function ($q) {
                        $q->where('status', '!=', 'draft');
                    }, 'products.category', 'products.categories', 'products.variants'])
                    ->first();
            }

            // 2. If not explicitly chosen, find active collection marked as featured
            if (! $matchedCollection) {
                $matchedCollection = Collection::where('is_active', true)
                    ->where('is_featured', true)
                    ->with(['products' => function ($q) {
                        $q->where('status', '!=', 'draft');
                    }, 'products.category', 'products.categories', 'products.variants'])
                    ->latest('updated_at')
                    ->first();
            }

            // 3. Fallback to latest active collection
            if (! $matchedCollection) {
                $matchedCollection = Collection::where('is_active', true)
                    ->with(['products' => function ($q) {
                        $q->where('status', '!=', 'draft');
                    }, 'products.category', 'products.categories', 'products.variants'])
                    ->latest('updated_at')
                    ->first();
            }

            if ($matchedCollection) {
                $seasonal['title'] = $matchedCollection->name;
                $seasonal['subtitle'] = ! empty($matchedCollection->tagline)
                    ? $matchedCollection->tagline
                    : ($seasonal['subtitle'] ?? 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS');
                $seasonal['badge'] = strtoupper($matchedCollection->name).' CAPSULE';
                if (! empty($matchedCollection->description)) {
                    $seasonal['description'] = $matchedCollection->description;
                }
                if (! empty($matchedCollection->banner_image)) {
                    $seasonal['banner_image'] = $matchedCollection->banner_image;
                } elseif (! empty($matchedCollection->image)) {
                    $seasonal['banner_image'] = $matchedCollection->image;
                }
                $seasonal['button_text'] = 'Explore '.$matchedCollection->name;
                $seasonal['button_link'] = '/collection/'.$matchedCollection->slug;

                if ($matchedCollection->products->count() > 0) {
                    $seasonalProducts = $matchedCollection->products
                        ->sortByDesc('id')
                        ->map(fn ($p) => $this->formatProduct($p))
                        ->values()
                        ->all();
                } else {
                    $seasonalProducts = [];
                }
            } elseif (! empty($seasonalTarget) && $seasonalTarget !== 'all') {
                $seasonalProducts = array_values(array_filter($products, function ($p) use ($seasonalTarget) {
                    return strtolower(str_replace([' ', '&'], ['-', ''], $p['category'])) === strtolower($seasonalTarget)
                        || strtolower($p['category']) === strtolower($seasonalTarget)
                        || in_array(strtolower($seasonalTarget), array_map('strtolower', $p['categories'] ?? []));
                }));
            }
        }

        return Inertia::render('Shop/Home', [
            'products' => $products,
            'bestSelling' => $bestSellers,
            'featuredCollection' => $featured,
            'categories' => $this->getCategories(),
            'banners' => $promoBannersEnabled ? ($banners ?: $this->getBanners()) : [],
            'slides' => $slides,
            'heroSliderEnabled' => $heroSliderEnabled,
            'promoBannersEnabled' => $promoBannersEnabled,
            'trustBadgesEnabled' => $trustBadgesEnabled,
            'shopByGramEnabled' => $shopByGramEnabled,
            'seasonalCollection' => $seasonal,
            'seasonalProducts' => $seasonalProducts,
        ]);
    }

    public function catalog(Request $request): Response
    {
        $allProducts = $this->getProducts();
        $selectedCategory = $request->query('category', 'all');

        return Inertia::render('Shop/Catalog', [
            'products' => $allProducts,
            'categories' => $this->getCategories(),
            'selectedCategory' => $selectedCategory,
        ]);
    }

    public function productDetail(string $slug): Response
    {
        $dbProduct = Product::with(['category', 'categories', 'variants'])
            ->where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->orWhere('slug', 'like', $slug.'%')
            ->first();

        if (! $dbProduct) {
            $dbProduct = Product::with(['category', 'categories', 'variants'])->first();
        }

        $product = $dbProduct ? $this->formatProduct($dbProduct) : null;
        $allProducts = $this->getProducts();

        $relatedProducts = [];
        if ($product && ! empty($product['upsellIds'])) {
            $explicitUpsells = collect($allProducts)->whereIn('id', $product['upsellIds'])->values()->all();
            $relatedProducts = array_merge($relatedProducts, $explicitUpsells);
        }

        // Fill remaining up to 4 items from other products
        $remaining = array_values(array_filter($allProducts, fn ($p) => $product && $p['id'] !== $product['id'] && ! in_array($p['id'], array_column($relatedProducts, 'id'))));
        $relatedProducts = array_merge($relatedProducts, $remaining);

        return Inertia::render('Shop/ProductDetail', [
            'product' => $product,
            'relatedProducts' => array_slice($relatedProducts, 0, 4),
        ]);
    }

    public function cart(): Response
    {
        return Inertia::render('Shop/Cart', [
            'cartItems' => [],
        ]);
    }

    public function checkout(): Response
    {
        return Inertia::render('Shop/Checkout', [
            'cartItems' => [],
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Shop/About', [
            'products' => $this->getProducts(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Shop/Contact', [
            'products' => $this->getProducts(),
        ]);
    }

    public function termsOfUse(): Response
    {
        return Inertia::render('Shop/TermsOfUse', [
            'products' => $this->getProducts(),
        ]);
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('Shop/PrivacyPolicy', [
            'products' => $this->getProducts(),
        ]);
    }

    public function faq(): Response
    {
        return Inertia::render('Shop/Faq', [
            'products' => $this->getProducts(),
        ]);
    }

    public function wishlist(): Response
    {
        return Inertia::render('Shop/Wishlist', [
            'products' => array_slice($this->getProducts(), 0, 4),
        ]);
    }
}
