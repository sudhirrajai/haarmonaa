<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::pluck('value', 'key')->all();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'store_tagline' => 'nullable|string|max:255',
            'store_logo' => 'nullable|string',
            'store_logo_dark' => 'nullable|string',
            'store_favicon' => 'nullable|string',
            'header_logo_height' => 'nullable|integer|min:20|max:150',
            'footer_logo_height' => 'nullable|integer|min:20|max:150',
            'store_email' => 'required|email',
            'store_phone' => 'nullable|string',
            'store_address' => 'nullable|string',
            'currency_symbol' => 'required|string|max:10',
            'tax_rate_percent' => 'required|numeric|min:0|max:100',
            'shipping_fee' => 'required|numeric|min:0',
            'free_shipping_min_order' => 'required|numeric|min:0',
            'enable_free_shipping' => 'nullable|boolean',
            'instagram_url' => 'nullable|string|max:500',
            'instagram_handle' => 'nullable|string|max:100',
            'facebook_url' => 'nullable|string|max:500',
            'tiktok_url' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|string|max:500',
            'pinterest_url' => 'nullable|string|max:500',
            'instagram_posts' => 'nullable',
            'store_features' => 'nullable',
            'meta_title_suffix' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:1000',
            'google_site_verification' => 'nullable|string|max:255',
            'bing_site_verification' => 'nullable|string|max:255',
            'og_default_image' => 'nullable|string',
            'enable_topbar' => 'nullable',
            'topbar_text' => 'nullable|string|max:500',
            'topbar_link' => 'nullable|string|max:500',
            'topbar_bg_color' => 'nullable|string|max:30',
            'topbar_text_color' => 'nullable|string|max:30',
            'topbar_icon' => 'nullable|string|max:50',
            'header_nav_items' => 'nullable',
            'razorpay_key_id' => 'nullable|string|max:255',
            'razorpay_key_secret' => 'nullable|string|max:255',
            'razorpay_webhook_secret' => 'nullable|string|max:255',
            'razorpay_mode' => 'nullable|string|in:test,live',
        ]);

        if (isset($validated['enable_topbar'])) {
            $enableTopbar = filter_var($validated['enable_topbar'], FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
            Setting::set('enable_topbar', $enableTopbar);
            unset($validated['enable_topbar']);
        }

        foreach ($validated as $key => $val) {
            if (is_array($val)) {
                Setting::set($key, json_encode($val));
            } else {
                Setting::set($key, $val ?? '');
            }
        }

        // Keep legacy alias in sync
        if (isset($validated['free_shipping_min_order'])) {
            Setting::set('free_shipping_threshold', $validated['free_shipping_min_order']);
        }

        return back()->with('success', 'Store settings and homepage sections updated successfully.');
    }
}
