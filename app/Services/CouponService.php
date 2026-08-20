<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Product;
use Carbon\Carbon;

class CouponService
{
    /**
     * Validate and calculate coupon discount for given cart items and customer email.
     *
     * @param  array  $cartItems  Array of items: [['product_id' => 1, 'quantity' => 2, 'unit_price' => 199.00]]
     */
    public static function validateAndCalculate(string $code, array $cartItems, ?string $customerEmail = null): array
    {
        $code = strtoupper(trim($code));

        if (empty($code)) {
            return [
                'valid' => false,
                'message' => 'Please enter a coupon code.',
            ];
        }

        $coupon = Coupon::where('code', $code)->first();

        if (! $coupon) {
            return [
                'valid' => false,
                'message' => 'Invalid coupon code.',
            ];
        }

        if (! $coupon->is_active) {
            return [
                'valid' => false,
                'message' => 'This coupon is currently inactive.',
            ];
        }

        $now = Carbon::now();

        if ($coupon->start_date && $now->lt($coupon->start_date)) {
            return [
                'valid' => false,
                'message' => 'This coupon promotion has not started yet.',
            ];
        }

        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return [
                'valid' => false,
                'message' => 'This coupon has expired.',
            ];
        }

        // Overall usage limit
        if (! is_null($coupon->usage_limit) && $coupon->usage_count >= $coupon->usage_limit) {
            return [
                'valid' => false,
                'message' => 'This coupon has reached its maximum total usage limit.',
            ];
        }

        // Per-user usage limit
        if ($customerEmail && ! is_null($coupon->usage_limit_per_user)) {
            $userUsageCount = CouponUsage::where('coupon_id', $coupon->id)
                ->where('customer_email', strtolower(trim($customerEmail)))
                ->count();

            if ($userUsageCount >= $coupon->usage_limit_per_user) {
                return [
                    'valid' => false,
                    'message' => 'You have already reached the maximum usage limit for this coupon.',
                ];
            }
        }

        // Calculate Cart Subtotal & Filter Qualifying Items
        $cartSubtotal = 0;
        foreach ($cartItems as $item) {
            $price = (float) ($item['unit_price'] ?? $item['price'] ?? 0);
            $qty = (int) ($item['quantity'] ?? 1);
            $cartSubtotal += ($price * $qty);
        }

        // Minimum spend check
        if (! is_null($coupon->min_spend) && $cartSubtotal < $coupon->min_spend) {
            return [
                'valid' => false,
                'message' => sprintf('A minimum order spend of ₹%.2f is required to use this coupon.', $coupon->min_spend),
            ];
        }

        // Product / Category / Collection Restrictions
        $qualifyingSubtotal = 0;
        $hasRestrictions = ! empty($coupon->applicable_products)
            || ! empty($coupon->applicable_categories)
            || ! empty($coupon->applicable_collections);

        if ($hasRestrictions) {
            $productIds = collect($cartItems)->pluck('product_id')->filter()->all();
            $products = Product::with(['categories', 'collections'])->whereIn('id', $productIds)->get()->keyBy('id');

            foreach ($cartItems as $item) {
                $pid = $item['product_id'] ?? null;
                $product = $products->get($pid);
                if (! $product) {
                    continue;
                }

                $isProductMatch = ! empty($coupon->applicable_products) && in_array($product->id, $coupon->applicable_products);

                $isCategoryMatch = false;
                if (! empty($coupon->applicable_categories)) {
                    $prodCategoryIds = $product->categories->pluck('id')->all();
                    if ($product->category_id) {
                        $prodCategoryIds[] = $product->category_id;
                    }
                    $isCategoryMatch = count(array_intersect($prodCategoryIds, $coupon->applicable_categories)) > 0;
                }

                $isCollectionMatch = false;
                if (! empty($coupon->applicable_collections)) {
                    $prodCollectionIds = $product->collections->pluck('id')->all();
                    $isCollectionMatch = count(array_intersect($prodCollectionIds, $coupon->applicable_collections)) > 0;
                }

                if ($isProductMatch || $isCategoryMatch || $isCollectionMatch) {
                    $price = (float) ($item['unit_price'] ?? $item['price'] ?? 0);
                    $qty = (int) ($item['quantity'] ?? 1);
                    $qualifyingSubtotal += ($price * $qty);
                }
            }

            if ($qualifyingSubtotal <= 0) {
                return [
                    'valid' => false,
                    'message' => 'This coupon is not applicable to the selected items in your cart.',
                ];
            }
        } else {
            $qualifyingSubtotal = $cartSubtotal;
        }

        // Calculate Discount Amount
        $discount = 0;
        if ($coupon->type === 'percent') {
            $discount = round($qualifyingSubtotal * ($coupon->value / 100), 2);
            if (! is_null($coupon->max_discount) && $discount > $coupon->max_discount) {
                $discount = (float) $coupon->max_discount;
            }
        } else {
            // Fixed amount
            $discount = min((float) $coupon->value, $qualifyingSubtotal);
        }

        return [
            'valid' => true,
            'message' => 'Coupon code applied successfully!',
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'description' => $coupon->description,
                'type' => $coupon->type,
                'value' => (float) $coupon->value,
                'discount' => round($discount, 2),
            ],
        ];
    }
}
