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
    private function getProducts(): array
    {
        $products = Product::with(['category', 'categories', 'variants'])->get();

        return $products->map(function ($p) {
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
        })->toArray();
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

        // 1. Featured Collection for Slider (Only products marked as featured by admin)
        $featured = array_values(array_filter($products, fn ($p) => ! empty($p['isHot'])));
        if (empty($featured)) {
            $featured = array_slice($products, 0, 6);
        } else {
            $featured = array_slice($featured, 0, 8);
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
        $rawSlides = Setting::get('homepage_slides');
        $slides = $rawSlides ? json_decode($rawSlides, true) : null;

        $rawSeasonal = Setting::get('homepage_seasonal_collection');
        $seasonal = $rawSeasonal ? json_decode($rawSeasonal, true) : [
            'enabled' => true,
            'title' => 'Summer Solstice Edition',
            'subtitle' => 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
            'badge' => 'SUMMER 2026 CAPSULE',
            'description' => 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
            'category_slug' => 'necklaces',
            'banner_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
            'button_text' => 'Explore Summer Edit',
            'button_link' => '/shop?category=necklaces',
        ];

        $rawBanners = Setting::get('homepage_promo_banners');
        $banners = $rawBanners ? json_decode($rawBanners, true) : null;

        // Resolve Seasonal Products
        $seasonalTarget = $seasonal['category_slug'] ?? 'all';
        $seasonalProducts = [];
        if (! empty($seasonal['enabled'])) {
            // First check if matching a Collection
            $matchedCollection = Collection::where('slug', $seasonalTarget)->with(['products.variants', 'products.categories'])->first();
            if ($matchedCollection && $matchedCollection->products->count() > 0) {
                $seasonalProducts = $this->transformProducts($matchedCollection->products);
            } elseif ($seasonalTarget !== 'all') {
                $seasonalProducts = array_values(array_filter($products, function ($p) use ($seasonalTarget) {
                    return strtolower(str_replace([' ', '&'], ['-', ''], $p['category'])) === strtolower($seasonalTarget)
                        || strtolower($p['category']) === strtolower($seasonalTarget)
                        || in_array(strtolower($seasonalTarget), array_map('strtolower', $p['categories'] ?? []));
                }));
            }

            if (empty($seasonalProducts)) {
                $seasonalProducts = array_slice($products, 0, 4);
            } else {
                $seasonalProducts = array_slice($seasonalProducts, 0, 4);
            }
        }

        return Inertia::render('Shop/Home', [
            'products' => $products,
            'bestSelling' => $bestSellers,
            'featuredCollection' => $featured,
            'categories' => $this->getCategories(),
            'banners' => $banners ?: $this->getBanners(),
            'slides' => $slides,
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
        $products = $this->getProducts();
        $product = collect($products)->firstWhere('slug', $slug)
            ?? collect($products)->firstWhere('id', (int) $slug)
            ?? ($products[0] ?? null);

        $relatedProducts = array_values(array_filter($products, fn ($p) => $product && $p['id'] !== $product['id']));

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
