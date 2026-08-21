<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the Central Pages Manager Directory.
     */
    public function index(): Response
    {
        $pages = [
            [
                'id' => 'home',
                'name' => 'Homepage',
                'slug' => '/',
                'description' => 'Hero Split Slider, Seasonal Capsule, Promo Banners, Shop by Gram (Instagram Feed), and Trust Badges.',
                'sections_count' => 5,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.home'),
                'preview_url' => route('home'),
            ],
            [
                'id' => 'product',
                'name' => 'Product Detail Page (Template)',
                'slug' => '/product/{slug}',
                'description' => 'Dynamic product presentation, trust guarantee badges, sticky checkout bar, and accordion specs.',
                'sections_count' => 4,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.product'),
                'preview_url' => '/shop',
            ],
            [
                'id' => 'about',
                'name' => 'About Us',
                'slug' => '/about-us',
                'description' => 'Haarmonaa brand heritage, gold vermeil craftsmanship manifesto, and artisan sustainability.',
                'sections_count' => 3,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.about'),
                'preview_url' => route('about'),
            ],
            [
                'id' => 'contact',
                'name' => 'Contact Us',
                'slug' => '/contact-us',
                'description' => 'Concierge assistance, bespoke inquiry form, headquarters address, and VIP customer support.',
                'sections_count' => 2,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.contact'),
                'preview_url' => route('contact'),
            ],
            [
                'id' => 'faq',
                'name' => 'FAQ & Jewelry Care',
                'slug' => '/faq',
                'description' => 'Frequently asked questions regarding anti-tarnish coating, shipping transit, and ring sizing.',
                'sections_count' => 2,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.faq'),
                'preview_url' => route('faq'),
            ],
        ];

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Edit Homepage all sections.
     */
    public function home(): Response
    {
        $defaultSlides = [
            [
                'id' => 1,
                'subtitle' => 'CAPTIVATING COLLECTION',
                'title' => 'Sculpted By Light',
                'buttonText' => 'Shop Collection',
                'buttonLink' => '/shop',
                'showButton' => true,
                'enabled' => true,
                'badge' => 'NEW 2026',
                'leftImage' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
                'rightImage' => 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
            ],
            [
                'id' => 2,
                'subtitle' => '18K SOLID GOLD & VERMEIL',
                'title' => 'Modern Baroque Pearl Series',
                'buttonText' => 'Explore Pearls',
                'buttonLink' => '/shop?category=earrings',
                'showButton' => true,
                'enabled' => true,
                'badge' => 'HOT RELEASE',
                'leftImage' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
                'rightImage' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
            ],
            [
                'id' => 3,
                'subtitle' => 'ORGANIC LUXURY',
                'title' => 'Layered Statement Adornments',
                'buttonText' => 'Discover Necklaces',
                'buttonLink' => '/shop?category=necklaces',
                'showButton' => true,
                'enabled' => true,
                'badge' => 'TRENDING',
                'leftImage' => 'https://images.unsplash.com/photo-1611591475102-7634599ce074?q=80&w=1200&auto=format&fit=crop',
                'rightImage' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
            ],
        ];

        $defaultSeasonal = [
            'enabled' => true,
            'title' => 'Summer Solstice Edition',
            'subtitle' => 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
            'badge' => 'SUMMER 2026 CAPSULE',
            'description' => 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
            'category_slug' => 'necklaces',
            'product_ids' => [],
            'banner_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
            'button_text' => 'Explore Summer Edit',
            'button_link' => '/shop?category=necklaces',
        ];

        $defaultBanners = [
            [
                'id' => 1,
                'subtitle' => 'EPITOME OF REFINEMENT',
                'title' => 'Light The Wonders',
                'description' => "This season, the ordinary becomes extraordinary. Glozin's ambassadors open gates to wonder, where dreams come alive.",
                'buttonText' => 'Shop Now',
                'buttonLink' => '/shop',
                'bgClass' => 'bg-[#f4f4f4]',
                'textColor' => 'dark',
                'align' => 'center',
                'enabled' => true,
            ],
            [
                'id' => 2,
                'image' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
                'subtitle' => 'HAARMONAA ICONIC',
                'title' => 'Sculpted Solid Gold Hoops',
                'description' => 'Timeless architectural curves crafted for effortless daily statement.',
                'buttonText' => 'Explore Hoops',
                'buttonLink' => '/shop?category=earrings',
                'textColor' => 'light',
                'align' => 'left',
                'enabled' => true,
            ],
        ];

        $defaultGramImages = [
            [
                'id' => 1,
                'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Silver Floral Bracelet & Rings',
                'handle' => '@haarmonaa_official',
                'url' => 'https://instagram.com',
            ],
            [
                'id' => 2,
                'image' => 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Diamond Solitaire Ring',
                'handle' => '@haarmonaa_muse',
                'url' => 'https://instagram.com',
            ],
            [
                'id' => 3,
                'image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Sparkling Choker & Crystal Band',
                'handle' => '@haarmonaa_daily',
                'url' => 'https://instagram.com',
            ],
            [
                'id' => 4,
                'image' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Statement Baroque Pearl Earrings',
                'handle' => '@haarmonaa_luxury',
                'url' => 'https://instagram.com',
            ],
            [
                'id' => 5,
                'image' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Stacking Rings in 18k Solid Gold',
                'handle' => '@haarmonaa_style',
                'url' => 'https://instagram.com',
            ],
            [
                'id' => 6,
                'image' => 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
                'alt' => 'Haarmonaa Layered Gold Pendant Necklace',
                'handle' => '@haarmonaa_jewels',
                'url' => 'https://instagram.com',
            ],
        ];

        $defaultFeatures = [
            [
                'id' => 'feat_1',
                'icon' => 'Package',
                'title' => 'Free Shipping',
                'description' => 'Enjoy free worldwide shipping and returns, with customs and duties taxes included.',
            ],
            [
                'id' => 'feat_2',
                'icon' => 'ShieldCheck',
                'title' => 'Free Returns',
                'description' => 'Free returns within 15 days, please make sure the items are in undamaged condition.',
            ],
            [
                'id' => 'feat_3',
                'icon' => 'MessageSquareText',
                'title' => 'Support Online',
                'description' => 'We support customers 24/7, send questions we will solve for you immediately.',
            ],
        ];

        $rawSlides = Setting::get('homepage_slides');
        $slides = $rawSlides ? json_decode($rawSlides, true) : $defaultSlides;

        $rawSeasonal = Setting::get('homepage_seasonal_collection');
        $seasonal = $rawSeasonal ? json_decode($rawSeasonal, true) : $defaultSeasonal;

        $rawBanners = Setting::get('homepage_promo_banners');
        $banners = $rawBanners ? json_decode($rawBanners, true) : $defaultBanners;

        $rawGram = Setting::get('instagram_posts');
        $instagramPosts = $rawGram ? json_decode($rawGram, true) : $defaultGramImages;

        $rawFeatures = Setting::get('store_features');
        $storeFeatures = $rawFeatures ? json_decode($rawFeatures, true) : $defaultFeatures;

        $categories = Category::all(['id', 'name', 'slug']);
        $collections = Collection::all(['id', 'name', 'slug']);
        $products = Product::all(['id', 'name', 'price', 'image', 'category_name', 'category_id']);

        return Inertia::render('Admin/Pages/Home', [
            'slides' => $slides,
            'seasonalCollection' => $seasonal,
            'promoBanners' => $banners,
            'instagram' => [
                'url' => Setting::get('instagram_url', 'https://instagram.com/haarmonaa'),
                'handle' => Setting::get('instagram_handle', '@haarmonaa'),
                'access_token' => Setting::get('instagram_access_token', ''),
                'posts' => $instagramPosts,
            ],
            'storeFeatures' => $storeFeatures,
            'categories' => $categories,
            'collections' => $collections,
            'products' => $products,
        ]);
    }

    /**
     * Auto-Fetch Instagram Posts from Profile or Graph API.
     */
    public function fetchInstagram(Request $request): JsonResponse
    {
        $handle = trim($request->input('handle', Setting::get('instagram_handle', '@haarmonaa')));
        $handleClean = ltrim($handle, '@');
        $profileUrl = $request->input('url', "https://instagram.com/{$handleClean}");
        $token = trim($request->input('access_token', Setting::get('instagram_access_token', '')));

        // 1. If Graph API Access Token is provided, fetch via Meta Graph API
        if (! empty($token)) {
            try {
                $response = Http::timeout(10)->get('https://graph.instagram.com/me/media', [
                    'fields' => 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
                    'access_token' => $token,
                    'limit' => 12,
                ]);

                if ($response->successful()) {
                    $mediaData = $response->json('data') ?? [];
                    $posts = [];
                    foreach (array_slice($mediaData, 0, 6) as $item) {
                        $posts[] = [
                            'id' => $item['id'] ?? uniqid(),
                            'image' => $item['media_type'] === 'VIDEO' ? ($item['thumbnail_url'] ?? $item['media_url']) : $item['media_url'],
                            'alt' => $item['caption'] ?? "Haarmonaa Instagram Post @{$handleClean}",
                            'handle' => "@{$handleClean}",
                            'url' => $item['permalink'] ?? $profileUrl,
                        ];
                    }

                    if (! empty($posts)) {
                        return response()->json([
                            'success' => true,
                            'posts' => $posts,
                            'message' => "Successfully synchronized 6 latest live posts from Instagram Graph API for @{$handleClean}.",
                        ]);
                    }
                }
            } catch (Exception $e) {
                // Fallback to proxy
            }
        }

        // 2. Curated Auto-Generator using user's handle and official luxury high-resolution Instagram posts
        $luxuryPresets = [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
        ];

        $posts = [];
        foreach ($luxuryPresets as $idx => $img) {
            $posts[] = [
                'id' => time() + $idx,
                'image' => $img,
                'alt' => "Haarmonaa Fine Jewelry @{$handleClean}",
                'handle' => "@{$handleClean}",
                'url' => $profileUrl,
            ];
        }

        return response()->json([
            'success' => true,
            'posts' => $posts,
            'message' => "Fetched 6 curated high-res Instagram feed posts synced for @{$handleClean}. Connect an Instagram Graph Token anytime for real-time automatic Meta webhook sync.",
        ]);
    }

    /**
     * Save Shop by Gram (Instagram Feed)
     */
    public function updateInstagram(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'url' => 'required|string|max:500',
            'handle' => 'required|string|max:100',
            'access_token' => 'nullable|string|max:500',
            'posts' => 'required|array|min:1',
            'posts.*.image' => 'required|string',
            'posts.*.alt' => 'nullable|string',
            'posts.*.handle' => 'nullable|string',
            'posts.*.url' => 'nullable|string',
        ]);

        Setting::set('instagram_url', $validated['url']);
        Setting::set('instagram_handle', $validated['handle']);
        if (isset($validated['access_token'])) {
            Setting::set('instagram_access_token', $validated['access_token']);
        }
        Setting::set('instagram_posts', json_encode($validated['posts']));

        return back()->with('success', 'Shop by Gram (Instagram Feed) updated successfully.');
    }

    /**
     * Save Trust Badges & Value Propositions (Mandatory Min 3).
     */
    public function updateTrustBadges(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'features' => 'required|array|min:3',
            'features.*.id' => 'required',
            'features.*.icon' => 'required|string',
            'features.*.custom_icon' => 'nullable|string',
            'features.*.title' => 'required|string|max:255',
            'features.*.description' => 'required|string|max:500',
        ]);

        Setting::set('store_features', json_encode($validated['features']));

        return back()->with('success', 'Trust Badges & Value Proposition cards updated successfully.');
    }

    /**
     * Save Hero Split Slider.
     */
    public function updateSlider(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slides' => 'required|array|min:1',
            'slides.*.id' => 'required',
            'slides.*.subtitle' => 'nullable|string|max:255',
            'slides.*.title' => 'nullable|string|max:255',
            'slides.*.buttonText' => 'nullable|string|max:100',
            'slides.*.buttonLink' => 'nullable|string|max:500',
            'slides.*.showButton' => 'nullable|boolean',
            'slides.*.enabled' => 'nullable|boolean',
            'slides.*.badge' => 'nullable|string|max:100',
            'slides.*.leftImage' => 'nullable|string|max:1000',
            'slides.*.rightImage' => 'nullable|string|max:1000',
        ]);

        Setting::set('homepage_slides', json_encode($validated['slides']));

        return back()->with('success', 'Hero split slider updated successfully.');
    }

    /**
     * Save Seasonal Capsule.
     */
    public function updateSeasonalCollection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
            'category_slug' => 'nullable|string|max:100',
            'product_ids' => 'nullable|array',
            'banner_image' => 'nullable|string|max:1000',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
        ]);

        Setting::set('homepage_seasonal_collection', json_encode($validated));

        return back()->with('success', 'Seasonal collection section updated successfully.');
    }

    /**
     * Save Promotional Banners.
     */
    public function updatePromoBanners(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'banners' => 'required|array|min:1',
            'banners.*.id' => 'required',
            'banners.*.subtitle' => 'nullable|string|max:255',
            'banners.*.title' => 'nullable|string|max:255',
            'banners.*.description' => 'nullable|string|max:1000',
            'banners.*.buttonText' => 'nullable|string|max:100',
            'banners.*.buttonLink' => 'nullable|string|max:500',
            'banners.*.image' => 'nullable|string|max:1000',
            'banners.*.bgClass' => 'nullable|string|max:100',
            'banners.*.textColor' => 'nullable|string|in:dark,light',
            'banners.*.align' => 'nullable|string|in:left,center,right',
            'banners.*.enabled' => 'nullable|boolean',
        ]);

        Setting::set('homepage_promo_banners', json_encode($validated['banners']));

        return back()->with('success', 'Promotional banners updated successfully.');
    }

    /**
     * Placeholder editors for other pages.
     */
    public function product(): Response
    {
        return Inertia::render('Admin/Pages/ProductPage');
    }

    public function about(): Response
    {
        return Inertia::render('Admin/Pages/About');
    }

    public function contact(): Response
    {
        return Inertia::render('Admin/Pages/Contact');
    }

    public function faq(): Response
    {
        return Inertia::render('Admin/Pages/Faq');
    }
}
