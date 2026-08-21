<?php

namespace App\Http\Middleware;

use App\Models\SearchKeyword;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => [
                'store_name' => Setting::get('store_name', 'Haarmonaa Fine Jewelry'),
                'store_tagline' => Setting::get('store_tagline', ''),
                'store_logo' => Setting::get('store_logo'),
                'store_logo_dark' => Setting::get('store_logo_dark'),
                'store_favicon' => Setting::get('store_favicon'),
                'header_logo_height' => (int) Setting::get('header_logo_height', 44),
                'footer_logo_height' => (int) Setting::get('footer_logo_height', 48),
                'store_email' => Setting::get('store_email', 'support@haarmonaa.in'),
                'store_phone' => Setting::get('store_phone', ''),
                'store_address' => Setting::get('store_address', ''),
                'currency_symbol' => Setting::get('currency_symbol', '₹'),
                'tax_rate_percent' => (float) Setting::get('tax_rate_percent', 0),
                'shipping_fee' => (float) Setting::get('shipping_fee', 49),
                'free_shipping_min_order' => (float) Setting::get('free_shipping_min_order', 999),
                'enable_free_shipping' => (bool) Setting::get('enable_free_shipping', true),
                'instagram_url' => Setting::get('instagram_url', 'https://instagram.com/haarmonaa'),
                'instagram_handle' => Setting::get('instagram_handle', '@haarmonaa'),
                'instagram_posts' => json_decode(Setting::get('instagram_posts', '[]'), true) ?: null,
                'store_features' => json_decode(Setting::get('store_features', '[]'), true) ?: null,
                'popular_search_keywords' => SearchKeyword::getPopular(8),
            ],
        ];
    }
}
