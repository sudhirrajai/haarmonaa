<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    public function index(): Response
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

        $rawSlides = Setting::get('homepage_slides');
        $slides = $rawSlides ? json_decode($rawSlides, true) : $defaultSlides;

        $rawSeasonal = Setting::get('homepage_seasonal_collection');
        $seasonal = $rawSeasonal ? json_decode($rawSeasonal, true) : $defaultSeasonal;

        $rawBanners = Setting::get('homepage_promo_banners');
        $banners = $rawBanners ? json_decode($rawBanners, true) : $defaultBanners;

        $categories = Category::all(['id', 'name', 'slug']);
        $collections = Collection::all(['id', 'name', 'slug']);
        $products = Product::all(['id', 'name', 'price', 'image', 'category_name', 'category_id']);

        return Inertia::render('Admin/Cms/Index', [
            'slides' => $slides,
            'seasonalCollection' => $seasonal,
            'promoBanners' => $banners,
            'categories' => $categories,
            'collections' => $collections,
            'products' => $products,
        ]);
    }

    public function updateSlider(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slides' => 'required|array|min:1',
            'slides.*.id' => 'required',
            'slides.*.subtitle' => 'nullable|string|max:255',
            'slides.*.title' => 'required|string|max:255',
            'slides.*.buttonText' => 'nullable|string|max:100',
            'slides.*.buttonLink' => 'nullable|string|max:500',
            'slides.*.showButton' => 'nullable|boolean',
            'slides.*.enabled' => 'nullable|boolean',
            'slides.*.badge' => 'nullable|string|max:100',
            'slides.*.leftImage' => 'required|string|max:1000',
            'slides.*.rightImage' => 'required|string|max:1000',
        ]);

        Setting::set('homepage_slides', json_encode($validated['slides']));

        return back()->with('success', 'Hero split slider updated successfully.');
    }

    public function updateSeasonalCollection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'title' => 'required|string|max:255',
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

    public function updatePromoBanners(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'banners' => 'required|array|min:1',
            'banners.*.id' => 'required',
            'banners.*.subtitle' => 'nullable|string|max:255',
            'banners.*.title' => 'required|string|max:255',
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
}
