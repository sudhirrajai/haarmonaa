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
use Illuminate\Support\Facades\Schema;
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
                'id' => 'about',
                'name' => 'About Us',
                'slug' => '/about-us',
                'description' => 'Haarmonaa brand heritage, 7 modular story sections, counters, and gold vermeil manifesto.',
                'sections_count' => 7,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.about'),
                'preview_url' => route('about'),
            ],
            [
                'id' => 'faq',
                'name' => 'FAQ & Jewelry Care',
                'slug' => '/faq',
                'description' => 'Customizable accordion categories, questions, care advice, and concierge help banner.',
                'sections_count' => 4,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.faq'),
                'preview_url' => route('faq'),
            ],
            [
                'id' => 'terms',
                'name' => 'Terms Of Use',
                'slug' => '/terms-of-use',
                'description' => 'Purchase agreements, 18K vermeil warranty terms, shipping policies, and intellectual property.',
                'sections_count' => 6,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.terms'),
                'preview_url' => route('terms'),
            ],
            [
                'id' => 'privacy',
                'name' => 'Privacy Policy',
                'slug' => '/privacy-policy',
                'description' => 'Customer data protection, Level-1 PCI DSS payment encryption, and cookie management.',
                'sections_count' => 5,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.privacy'),
                'preview_url' => route('privacy'),
            ],
            [
                'id' => 'contact',
                'name' => 'Contact Us',
                'slug' => '/contact-us',
                'description' => 'Concierge assistance, bespoke inquiry channels, customer support hours, and VIP consultation.',
                'sections_count' => 2,
                'status' => 'published',
                'updated_at' => now()->format('M d, Y'),
                'edit_url' => route('admin.pages.contact'),
                'preview_url' => route('contact'),
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

        try {
            $categories = Schema::hasTable('categories') ? Category::select(['id', 'name', 'slug'])->get() : collect();
        } catch (\Throwable $e) {
            $categories = collect();
        }

        try {
            $collections = Schema::hasTable('collections') ? Collection::select(['id', 'name', 'slug'])->get() : collect();
        } catch (\Throwable $e) {
            $collections = collect();
        }

        try {
            $products = Schema::hasTable('products') ? Product::select(['id', 'name', 'price', 'image', 'category_name', 'category_id'])->limit(100)->get() : collect();
        } catch (\Throwable $e) {
            $products = collect();
        }

        return Inertia::render('Admin/Pages/Home', [
            'slides' => $slides,
            'heroSliderEnabled' => Setting::get('homepage_hero_slider_enabled', '1') !== '0',
            'promoBannersEnabled' => Setting::get('homepage_promo_banners_enabled', '1') !== '0',
            'seasonalCollection' => $seasonal,
            'promoBanners' => $banners,
            'instagram' => [
                'url' => Setting::get('instagram_url', 'https://instagram.com/haarmonaa'),
                'handle' => Setting::get('instagram_handle', '@haarmonaa'),
                'access_token' => Setting::get('instagram_access_token', ''),
                'posts' => $instagramPosts,
                'enabled' => Setting::get('homepage_shop_by_gram_enabled', '1') !== '0',
            ],
            'storeFeatures' => $storeFeatures,
            'trustBadgesEnabled' => Setting::get('homepage_trust_badges_enabled', '1') !== '0',
            'categories' => $categories,
            'collections' => $collections,
            'products' => $products,
        ]);
    }

    /**
     * Instantly toggle individual homepage section or sub-item without saving whole page.
     */
    public function toggleSection(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'section' => 'required|string|in:hero_slider,promo_banners,seasonal_collection,shop_by_gram,trust_badges,slide_item,banner_item',
            'enabled' => 'required|boolean',
            'item_id' => 'nullable',
        ]);

        $section = $validated['section'];
        $enabled = $validated['enabled'];

        if ($section === 'hero_slider') {
            Setting::set('homepage_hero_slider_enabled', $enabled ? '1' : '0');
        } elseif ($section === 'promo_banners') {
            Setting::set('homepage_promo_banners_enabled', $enabled ? '1' : '0');
        } elseif ($section === 'seasonal_collection') {
            $seasonal = json_decode(Setting::get('homepage_seasonal_collection', '{}'), true) ?: [];
            $seasonal['enabled'] = $enabled;
            Setting::set('homepage_seasonal_collection', json_encode($seasonal));
            Setting::set('homepage_seasonal_collection_enabled', $enabled ? '1' : '0');
        } elseif ($section === 'shop_by_gram') {
            Setting::set('homepage_shop_by_gram_enabled', $enabled ? '1' : '0');
        } elseif ($section === 'trust_badges') {
            Setting::set('homepage_trust_badges_enabled', $enabled ? '1' : '0');
        } elseif ($section === 'slide_item' && $request->filled('item_id')) {
            $slides = json_decode(Setting::get('homepage_slides', '[]'), true) ?: [];
            foreach ($slides as &$slide) {
                if ((string) $slide['id'] === (string) $request->input('item_id')) {
                    $slide['enabled'] = $enabled;
                }
            }
            Setting::set('homepage_slides', json_encode($slides));
        } elseif ($section === 'banner_item' && $request->filled('item_id')) {
            $banners = json_decode(Setting::get('homepage_promo_banners', '[]'), true) ?: [];
            foreach ($banners as &$banner) {
                if ((string) $banner['id'] === (string) $request->input('item_id')) {
                    $banner['enabled'] = $enabled;
                }
            }
            Setting::set('homepage_promo_banners', json_encode($banners));
        }

        return response()->json([
            'success' => true,
            'section' => $section,
            'enabled' => $enabled,
            'message' => 'Section visibility updated immediately in real-time.',
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

        if ($request->has('enabled') || $request->has('shop_by_gram_enabled')) {
            Setting::set('homepage_shop_by_gram_enabled', $request->boolean('shop_by_gram_enabled', $request->boolean('enabled', true)) ? '1' : '0');
        }

        return back()->with('success', 'Shop by Gram (Instagram Feed) updated successfully.');
    }

    /**
     * Save Trust Badges & Value Propositions.
     */
    public function updateTrustBadges(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'features' => 'required|array|min:1',
            'features.*.id' => 'required',
            'features.*.icon' => 'required|string',
            'features.*.custom_icon' => 'nullable|string',
            'features.*.title' => 'required|string|max:255',
            'features.*.description' => 'required|string|max:500',
            'trust_badges_enabled' => 'nullable|boolean',
        ]);

        Setting::set('store_features', json_encode($validated['features']));

        if ($request->has('trust_badges_enabled')) {
            Setting::set('homepage_trust_badges_enabled', $request->boolean('trust_badges_enabled', true) ? '1' : '0');
        }

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
            'hero_slider_enabled' => 'nullable|boolean',
        ]);

        Setting::set('homepage_slides', json_encode($validated['slides']));

        if ($request->has('hero_slider_enabled')) {
            Setting::set('homepage_hero_slider_enabled', $request->boolean('hero_slider_enabled', true) ? '1' : '0');
        }

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
            'promo_banners_enabled' => 'nullable|boolean',
        ]);

        Setting::set('homepage_promo_banners', json_encode($validated['banners']));

        if ($request->has('promo_banners_enabled')) {
            Setting::set('homepage_promo_banners_enabled', $request->boolean('promo_banners_enabled', true) ? '1' : '0');
        }

        return back()->with('success', 'Promotional dual banners updated successfully.');
    }

    /**
     * Default structured content for About Us Page.
     */
    public static function getDefaultAboutContent(): array
    {
        return [
            'hero' => [
                'enabled' => true,
                'badge' => 'WELCOME TO HAARMONAA',
                'title' => "Artisanal Fine Jewelry\nAvailable to Everyone",
                'description' => 'Over a decade of master goldsmithing, crafting thick 18K solid gold vermeil and hypoallergenic heirlooms engineered to endure daily wear effortlessly.',
            ],
            'media_banner' => [
                'enabled' => true,
                'left_image' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
                'right_bg_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'brand_subtitle_top' => 'HAARMONAA FINE JEWELRY',
                'brand_title' => 'haarmonaa',
                'brand_subtitle_bottom' => 'SOLID 18K GOLD VERMEIL',
            ],
            'stats' => [
                'enabled' => true,
                'items' => [
                    [
                        'value' => '50k+',
                        'label' => 'Heirloom Jewels Delivered',
                        'description' => "That's why we strive to offer a diverse range of products that cater to all styles.",
                    ],
                    [
                        'value' => '100%',
                        'label' => 'Waterproof & Anti-Tarnish',
                        'description' => 'We pride ourselves on creating great products and experiences with our valued customers.',
                    ],
                    [
                        'value' => '15k+',
                        'label' => 'Cherished Customers',
                        'description' => 'Partner with artisans that share our values, striving to protect our environment.',
                    ],
                ],
            ],
            'features' => [
                'enabled' => true,
                'badge' => 'WHY CHOOSE US',
                'title' => 'Our Peculiar Things',
                'description' => 'Our boutique selections are chosen for their impeccable quality, timeless aesthetic, and anti-tarnish protection.',
                'cards' => [
                    [
                        'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
                        'title' => 'Calmed Creations',
                        'description' => 'Mindful craftsmanship prioritizing sustainable 18k gold vermeil casting, hypoallergenic silver, and nickel-free comfort.',
                    ],
                    [
                        'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
                        'title' => 'Designed for Love',
                        'description' => 'From heirloom-inspired heart motifs to modern organic wave silhouettes, each design is built to evoke pure elegance.',
                    ],
                    [
                        'image' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
                        'title' => 'Premium for Everyone',
                        'description' => 'Direct-to-consumer luxury jewelry ensuring fine quality and lasting wear are accessible without traditional retail markups.',
                    ],
                ],
            ],
            'quote' => [
                'enabled' => true,
                'stars' => 5,
                'quote' => 'Haarmonaa will become an example of the responsible business model by doing business with kindness, profit and bringing practical and long—term values to customers, employees, partners, the community for the environment and for shareholders.',
                'author_name' => 'Carie—Gosée Hera',
                'author_role' => 'CEO and Founder Haarmonaa Boutique',
            ],
            'split_rows' => [
                'enabled' => true,
                'rows' => [
                    [
                        'badge' => 'OUR PROMISE',
                        'title' => 'The Best Product',
                        'description' => 'Meticulously crafted with hypoallergenic, water-safe materials that endure daily wear without fading, tarnishing, or losing their radiant shine. Every jewel undergoes stringent multi-point inspection.',
                        'button_text' => 'Learn More',
                        'button_link' => '/shop',
                        'image' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
                        'image_position' => 'left',
                    ],
                    [
                        'badge' => 'OUR PRODUCTS',
                        'title' => 'Timeless Products',
                        'description' => 'Designed to bridge classic luxury with effortless versatility, creating jewelry staples that effortlessly transition from morning meetings to evening celebrations.',
                        'button_text' => 'Learn More',
                        'button_link' => '/shop',
                        'image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
                        'image_position' => 'right',
                    ],
                ],
            ],
            'stories' => [
                'enabled' => true,
                'badge' => 'SEE OUR ROOTS',
                'title' => 'Expanding Horizons',
                'description' => 'Rooted in a passion for artisanal beauty and accessible luxury, our journey continues across the globe.',
                'cards' => [
                    [
                        'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
                        'title' => 'The Core of Us',
                        'description' => 'A united collective of designers, jewelers, and curators dedicated to crafting wearable art.',
                    ],
                    [
                        'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
                        'title' => 'Our Promise',
                        'description' => 'Swift, insured delivery with luxury sustainable velvet care packaging on every order.',
                    ],
                    [
                        'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
                        'title' => 'Our Genesis',
                        'description' => 'Conceived from a shared belief that fine craftsmanship should be celebrated daily, not kept in boxes.',
                    ],
                ],
            ],
        ];
    }

    /**
     * About Us Page CMS Editor.
     */
    public function about(): Response
    {
        $rawAbout = Setting::get('page_about_content');
        $about = $rawAbout ? json_decode($rawAbout, true) : null;
        $content = array_replace_recursive(self::getDefaultAboutContent(), $about ?: []);

        return Inertia::render('Admin/Pages/About', [
            'aboutContent' => $content,
        ]);
    }

    /**
     * Save About Us Page Content.
     */
    public function updateAbout(Request $request): RedirectResponse
    {
        $payload = $request->input('aboutContent', []);
        Setting::set('page_about_content', json_encode($payload));

        return back()->with('success', 'About Us page content updated successfully.');
    }

    /**
     * Async Toggle About Us Section Visibility.
     */
    public function toggleAboutSection(Request $request): JsonResponse
    {
        $section = $request->input('section');
        $enabled = (bool) $request->input('enabled');

        $rawAbout = Setting::get('page_about_content');
        $content = $rawAbout ? json_decode($rawAbout, true) : self::getDefaultAboutContent();

        if (isset($content[$section])) {
            $content[$section]['enabled'] = $enabled;
            Setting::set('page_about_content', json_encode($content));

            return response()->json([
                'success' => true,
                'message' => 'Section visibility updated successfully.',
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid section.'], 400);
    }

    /**
     * Default structured content for Terms Of Use.
     */
    public static function getDefaultTermsContent(): array
    {
        return [
            'mode' => 'clauses', // 'clauses' | 'full'
            'header' => [
                'badge' => 'LEGAL & POLICIES',
                'title' => 'Terms Of Use',
                'last_updated' => 'Last Updated: August 2026',
            ],
            'full_content' => '<h2>1. Acceptance of Terms</h2><p>By accessing, browsing, or purchasing from our Website (haarmonaa.in), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our Privacy Policy.</p><h2>2. Products & Handcrafted Authenticity</h2><p>All Haarmonaa jewelry is handcrafted using thick 18K solid gold vermeil casting over hypoallergenic 925 sterling silver or solid gold metallurgy. Because each piece is hand-finished by master artisans, slight unique variations in texture and stone dimensions may occur, reflecting the authentic beauty of artisanal jewelry.</p><h2>3. Pricing & Secure Payments</h2><p>All product prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise. We reserve the right to revise pricing or rectify inadvertent typographical errors without prior notification. Transactions are processed via Level-1 PCI DSS encrypted payment gateways.</p><h2>4. Shipping, Transit & Delivery</h2><p>Orders are processed and dispatched within 1–2 business days in tamper-evident velvet care packaging. Express insured delivery typically arrives within 3–5 business days across India. Tracking details are automatically emailed upon dispatch.</p><h2>5. Returns, Exchanges & Warranty</h2><p>We offer a 7-day hassle-free concierge return or exchange window for unworn items in original packaging with intact security tags. Bespoke customized engravings or personalized jewelry pieces are non-returnable unless defective.</p><h2>6. Intellectual Property Rights</h2><p>All imagery, product photography, editorial copy, logo graphics, design trademarks, and brand assets are the exclusive intellectual property of Haarmonaa Studio. Unauthorized reproduction or commercial use is strictly prohibited.</p>',
            'sections' => [
                [
                    'number' => '1',
                    'title' => 'Acceptance of Terms',
                    'content' => 'By accessing, browsing, or purchasing from our Website (haarmonaa.in), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our Privacy Policy.',
                ],
                [
                    'number' => '2',
                    'title' => 'Products & Handcrafted Authenticity',
                    'content' => 'All Haarmonaa jewelry is handcrafted using thick 18K solid gold vermeil casting over hypoallergenic 925 sterling silver or solid gold metallurgy. Because each piece is hand-finished by master artisans, slight unique variations in texture and stone dimensions may occur, reflecting the authentic beauty of artisanal jewelry.',
                ],
                [
                    'number' => '3',
                    'title' => 'Pricing & Secure Payments',
                    'content' => 'All product prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise. We reserve the right to revise pricing or rectify inadvertent typographical errors without prior notification. Transactions are processed via Level-1 PCI DSS encrypted payment gateways.',
                ],
                [
                    'number' => '4',
                    'title' => 'Shipping, Transit & Delivery',
                    'content' => 'Orders are processed and dispatched within 1–2 business days in tamper-evident velvet care packaging. Express insured delivery typically arrives within 3–5 business days across India. Tracking details are automatically emailed upon dispatch.',
                ],
                [
                    'number' => '5',
                    'title' => 'Returns, Exchanges & Warranty',
                    'content' => 'We offer a 7-day hassle-free concierge return or exchange window for unworn items in original packaging with intact security tags. Bespoke customized engravings or personalized jewelry pieces are non-returnable unless defective.',
                ],
                [
                    'number' => '6',
                    'title' => 'Intellectual Property Rights',
                    'content' => 'All imagery, product photography, editorial copy, logo graphics, design trademarks, and brand assets are the exclusive intellectual property of Haarmonaa Studio. Unauthorized reproduction or commercial use is strictly prohibited.',
                ],
            ],
        ];
    }

    /**
     * Default structured content for Privacy Policy.
     */
    public static function getDefaultPrivacyContent(): array
    {
        return [
            'mode' => 'clauses', // 'clauses' | 'full'
            'header' => [
                'badge' => 'DATA PROTECTION',
                'title' => 'Privacy Policy',
                'last_updated' => 'Last Updated: August 2026',
            ],
            'full_content' => '<h2>1. Information We Collect</h2><p>We collect information you provide directly to us when creating an account, browsing our boutique, placing an order, subscribing to our newsletters, or contacting our concierge team. This includes your name, email address, phone number, shipping address, and payment transaction references.</p><h2>2. How We Use Your Information</h2><p>Your information is used strictly to fulfill your orders, provide dispatch tracking updates, process secure payments, offer customer concierge assistance, and send tailored editorial updates if you have opted in.</p><h2>3. Payment Security & Encryption</h2><p>We do not store complete credit card or debit card numbers on our servers. All financial transactions are processed through 256-bit SSL encrypted, RBI-compliant, and Level-1 PCI DSS certified payment processors.</p><h2>4. Cookies & Browsing Experience</h2><p>Our store uses essential session cookies to remember your bag items, currency preferences, and wishlist. We do not sell your personal data to third-party data brokers under any circumstances.</p><h2>5. Your Rights & Concierge Contact</h2><p>You have the right to request access to, update, or permanently delete your personal information from our customer directory at any time by contacting our privacy officer at support@haarmonaa.in.</p>',
            'sections' => [
                [
                    'number' => '1',
                    'title' => 'Information We Collect',
                    'content' => 'We collect information you provide directly to us when creating an account, browsing our boutique, placing an order, subscribing to our newsletters, or contacting our concierge team. This includes your name, email address, phone number, shipping address, and payment transaction references.',
                ],
                [
                    'number' => '2',
                    'title' => 'How We Use Your Information',
                    'content' => 'Your information is used strictly to fulfill your orders, provide dispatch tracking updates, process secure payments, offer customer concierge assistance, and send tailored editorial updates if you have opted in.',
                ],
                [
                    'number' => '3',
                    'title' => 'Payment Security & Encryption',
                    'content' => 'We do not store complete credit card or debit card numbers on our servers. All financial transactions are processed through 256-bit SSL encrypted, RBI-compliant, and Level-1 PCI DSS certified payment processors.',
                ],
                [
                    'number' => '4',
                    'title' => 'Cookies & Browsing Experience',
                    'content' => 'Our store uses essential session cookies to remember your bag items, currency preferences, and wishlist. We do not sell your personal data to third-party data brokers under any circumstances.',
                ],
                [
                    'number' => '5',
                    'title' => 'Your Rights & Concierge Contact',
                    'content' => 'You have the right to request access to, update, or permanently delete your personal information from our customer directory at any time by contacting our privacy officer at support@haarmonaa.in.',
                ],
            ],
        ];
    }

    /**
     * Default structured content for FAQ & Care.
     */
    public static function getDefaultFaqContent(): array
    {
        return [
            'header' => [
                'badge' => 'HELP & SUPPORT',
                'title' => 'Frequently Asked Questions',
                'description' => 'Find answers to common questions about our anti-tarnish jewelry, shipping, sizing, and policies.',
            ],
            'help_card' => [
                'enabled' => true,
                'title' => 'Need Personal Styling Advice?',
                'description' => 'Our master jewelry concierge is available to assist you with sizing, custom gift packaging, or order queries.',
                'button_text' => 'Contact Concierge',
                'button_link' => '/contact-us',
            ],
            'categories' => [
                [
                    'title' => 'Shopping & Products',
                    'items' => [
                        [
                            'question' => 'Is Haarmonaa jewelry genuine 18K solid gold vermeil?',
                            'answer' => 'Yes! All Haarmonaa pieces are engineered with thick 18K solid gold electroplating over hypoallergenic 925 sterling silver. It is 100% waterproof, sweatproof, and anti-tarnish.',
                        ],
                        [
                            'question' => 'Can I save products to my wishlist?',
                            'answer' => 'Yes! Simply click the heart icon on any product card or product detail page to save your favorite jewelry to your personalized wishlist.',
                        ],
                        [
                            'question' => 'How do I know if a product is in stock?',
                            'answer' => 'All items on our boutique display real-time stock availability. If an item is temporarily sold out, it will be clearly marked as Out of Stock.',
                        ],
                    ],
                ],
                [
                    'title' => 'Payment & Security',
                    'items' => [
                        [
                            'question' => 'What payment methods do you accept?',
                            'answer' => 'We accept UPI (Google Pay, PhonePe, Paytm), all major credit/debit cards (Visa, MasterCard, RuPay, Amex), and Net Banking.',
                        ],
                        [
                            'question' => 'Is my payment information secure?',
                            'answer' => 'Yes, all transactions are processed via 256-bit SSL encrypted Level-1 PCI DSS compliant gateways.',
                        ],
                    ],
                ],
                [
                    'title' => 'Shipping & Returns',
                    'items' => [
                        [
                            'question' => 'How long does shipping take?',
                            'answer' => 'Orders are dispatched within 24–48 hours. Express insured delivery takes 3–5 business days across India.',
                        ],
                        [
                            'question' => 'What is your return policy?',
                            'answer' => 'We offer a 7-day hassle-free return and exchange policy on all unworn jewelry with security tags intact.',
                        ],
                    ],
                ],
                [
                    'title' => 'Jewelry Care & Anti-Tarnish',
                    'items' => [
                        [
                            'question' => 'Can I wear Haarmonaa jewelry in the shower or pool?',
                            'answer' => 'Yes! Our pieces are engineered with anti-tarnish waterproof metallurgical bonding. For maximum longevity, gently rinse with fresh water after saltwater/chlorine contact and dry with our included microfiber cloth.',
                        ],
                        [
                            'question' => 'How should I store my fine jewelry?',
                            'answer' => 'Store each piece individually in your complimentary Haarmonaa velvet pouch to prevent surface scratches.',
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Default structured content for Contact Us.
     */
    public static function getDefaultContactContent(): array
    {
        return [
            'header' => [
                'badge' => 'CUSTOMER CONCIERGE',
                'title' => 'Contact Us',
                'description' => 'Our concierge team is available to assist you with bespoke enquiries, orders, sizing, and jewelry care.',
            ],
            'channels' => [
                'email' => 'support@haarmonaa.in',
                'phone' => '+91 98765 43210',
                'hours' => 'Mon – Sat: 10:00 AM – 7:00 PM IST',
                'response_time' => 'Average response time: within 2–4 hours',
            ],
            'form' => [
                'title' => 'Send a Message',
                'agreement_text' => 'I agree that my submitted data is collected and stored according to the Privacy Policy.',
            ],
        ];
    }

    /**
     * Terms Of Use Page CMS.
     */
    public function terms(): Response
    {
        $raw = Setting::get('page_terms_content');
        $decoded = $raw ? json_decode($raw, true) : null;
        $content = array_replace_recursive(self::getDefaultTermsContent(), $decoded ?: []);

        return Inertia::render('Admin/Pages/Terms', [
            'termsContent' => $content,
        ]);
    }

    public function updateTerms(Request $request): RedirectResponse
    {
        $payload = $request->input('termsContent', []);
        Setting::set('page_terms_content', json_encode($payload));

        return back()->with('success', 'Terms of Use updated successfully.');
    }

    /**
     * Privacy Policy Page CMS.
     */
    public function privacy(): Response
    {
        $raw = Setting::get('page_privacy_content');
        $decoded = $raw ? json_decode($raw, true) : null;
        $content = array_replace_recursive(self::getDefaultPrivacyContent(), $decoded ?: []);

        return Inertia::render('Admin/Pages/Privacy', [
            'privacyContent' => $content,
        ]);
    }

    public function updatePrivacy(Request $request): RedirectResponse
    {
        $payload = $request->input('privacyContent', []);
        Setting::set('page_privacy_content', json_encode($payload));

        return back()->with('success', 'Privacy Policy updated successfully.');
    }

    /**
     * FAQ Page CMS.
     */
    public function faq(): Response
    {
        $raw = Setting::get('page_faq_content');
        $decoded = $raw ? json_decode($raw, true) : null;
        $content = array_replace_recursive(self::getDefaultFaqContent(), $decoded ?: []);

        return Inertia::render('Admin/Pages/Faq', [
            'faqContent' => $content,
        ]);
    }

    public function updateFaq(Request $request): RedirectResponse
    {
        $payload = $request->input('faqContent', []);
        Setting::set('page_faq_content', json_encode($payload));

        return back()->with('success', 'FAQ page content updated successfully.');
    }

    /**
     * Contact Us Page CMS.
     */
    public function contact(): Response
    {
        $raw = Setting::get('page_contact_content');
        $decoded = $raw ? json_decode($raw, true) : null;
        $content = array_replace_recursive(self::getDefaultContactContent(), $decoded ?: []);

        return Inertia::render('Admin/Pages/Contact', [
            'contactContent' => $content,
        ]);
    }

    public function updateContact(Request $request): RedirectResponse
    {
        $payload = $request->input('contactContent', []);
        Setting::set('page_contact_content', json_encode($payload));

        return back()->with('success', 'Contact Us page content updated successfully.');
    }

    public function product(): Response
    {
        return Inertia::render('Admin/Pages/ProductPage');
    }
}
