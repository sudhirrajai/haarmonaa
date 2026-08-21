<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function apply(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'email' => 'nullable|email',
            'existing_codes' => 'nullable|array',
            'existing_codes.*' => 'string',
        ]);

        $result = CouponService::validateAndCalculate(
            $validated['code'],
            $validated['items'],
            $validated['email'] ?? null,
            $validated['existing_codes'] ?? []
        );

        if (! $result['valid']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'replaced' => $result['replaced'] ?? false,
            'coupons' => $result['coupons'],
            'coupon' => $result['coupon'],
            'total_discount' => $result['total_discount'],
        ]);
    }

    public function recalculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codes' => 'nullable|array',
            'codes.*' => 'string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'email' => 'nullable|email',
        ]);

        $result = CouponService::recalculateAll(
            $validated['codes'] ?? [],
            $validated['items'],
            $validated['email'] ?? null
        );

        return response()->json([
            'success' => true,
            'coupons' => $result['coupons'],
            'coupon' => $result['coupons'][0] ?? null,
            'total_discount' => $result['total_discount'],
        ]);
    }
}
