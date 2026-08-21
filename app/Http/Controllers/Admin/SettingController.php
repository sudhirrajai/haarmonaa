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
            'store_email' => 'required|email',
            'store_phone' => 'nullable|string',
            'store_address' => 'nullable|string',
            'currency_symbol' => 'required|string|max:10',
            'tax_rate_percent' => 'required|numeric|min:0|max:100',
            'shipping_fee' => 'required|numeric|min:0',
            'free_shipping_min_order' => 'required|numeric|min:0',
            'enable_free_shipping' => 'nullable|boolean',
        ]);

        foreach ($validated as $key => $val) {
            Setting::set($key, $val ?? '');
        }

        // Keep legacy alias in sync
        if (isset($validated['free_shipping_min_order'])) {
            Setting::set('free_shipping_threshold', $validated['free_shipping_min_order']);
        }

        return back()->with('success', 'Store settings and branding updated successfully.');
    }
}
