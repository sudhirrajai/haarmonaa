<?php

namespace App\Http\Middleware;

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
                'store_email' => Setting::get('store_email', 'support@haarmonaa.in'),
                'store_phone' => Setting::get('store_phone', ''),
                'store_address' => Setting::get('store_address', ''),
                'currency_symbol' => Setting::get('currency_symbol', '₹'),
                'tax_rate_percent' => (float) Setting::get('tax_rate_percent', 0),
                'free_shipping_min_order' => (float) Setting::get('free_shipping_min_order', 999),
            ],
        ];
    }
}
