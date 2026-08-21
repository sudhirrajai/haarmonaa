<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Product;
use Carbon\Carbon;

class CouponService
{
    /**
     * Validate and calculate discount for a coupon or list of coupons.
     *
     * @param  string  $code  New coupon code being submitted
     * @param  array  $cartItems  Array of items: [['product_id' => 1, 'quantity' => 2, 'unit_price' => 199.00]]
     * @param  string|null  $customerEmail  Customer's email address
     * @param  array  $existingCodes  Array of coupon codes already applied in session/checkout
     */
    public static function validateAndCalculate(
        string $code,
        array $cartItems,
        ?string $customerEmail = null,
        array $existingCodes = []
    ): array {
        $code = strtoupper(trim($code));

        if (empty($code)) {
            return [
                'valid' => false,
                'message' => 'Please enter a valid coupon code.',
            ];
        }

        // Check if code is already in applied list
        $normalizedExisting = array_map(fn ($c) => strtoupper(trim($c)), $existingCodes);
        if (in_array($code, $normalizedExisting)) {
            return [
                'valid' => false,
                'message' => "Coupon '{$code}' is already applied to this order.",
            ];
        }

        $coupon = Coupon::where('code', $code)->first();

        if (! $coupon) {
            return [
                'valid' => false,
                'message' => "Promo code '{$code}' is invalid or does not exist.",
            ];
        }

        $validation = self::validateSingleCoupon($coupon, $cartItems, $customerEmail);
        if (! $validation['valid']) {
            return $validation;
        }

        // Check Stacking / Overlap Rules
        $isStackable = (bool) $coupon->allow_stacking;
        $existingCoupons = Coupon::whereIn('code', $normalizedExisting)->where('is_active', true)->get();

        $canStackAll = true;
        if (! empty($normalizedExisting)) {
            if (! $isStackable) {
                $canStackAll = false;
            } else {
                foreach ($existingCoupons as $ex) {
                    if (! $ex->allow_stacking) {
                        $canStackAll = false;
                        break;
                    }
                }
            }
        }

        // If stacking is allowed, combine existing + new coupon; otherwise new coupon replaces previous
        $finalCouponModels = [];
        $replaced = false;

        if (! empty($normalizedExisting) && ! $canStackAll) {
            // Cannot stack: replace existing coupons with the new one
            $finalCouponModels = [$coupon];
            $replaced = true;
        } else {
            // Stack allowed or no previous coupons
            $finalCouponModels = $existingCoupons->all();
            $finalCouponModels[] = $coupon;
        }

        // Calculate discounts for each active coupon
        return self::calculateMultipleCoupons($finalCouponModels, $cartItems, $replaced, $code);
    }

    /**
     * Recalculate discount for a list of applied coupon codes (e.g. after removing a coupon or updating cart).
     */
    public static function recalculateAll(array $codes, array $cartItems, ?string $customerEmail = null): array
    {
        $normalized = array_values(array_unique(array_filter(array_map(fn ($c) => strtoupper(trim($c)), $codes))));
        if (empty($normalized)) {
            return [
                'valid' => true,
                'coupons' => [],
                'total_discount' => 0,
                'message' => 'No coupons applied.',
            ];
        }

        $coupons = Coupon::whereIn('code', $normalized)->where('is_active', true)->get();
        $validCoupons = [];

        foreach ($coupons as $coupon) {
            $val = self::validateSingleCoupon($coupon, $cartItems, $customerEmail);
            if ($val['valid']) {
                $validCoupons[] = $coupon;
            }
        }

        return self::calculateMultipleCoupons($validCoupons, $cartItems);
    }

    /**
     * Validate an individual coupon against usage limits, dates, spend and item restrictions.
     */
    private static function validateSingleCoupon(Coupon $coupon, array $cartItems, ?string $customerEmail = null): array
    {
        if (! $coupon->is_active) {
            return [
                'valid' => false,
                'message' => "Coupon '{$coupon->code}' is currently inactive.",
            ];
        }

        $now = Carbon::now();

        if ($coupon->start_date && $now->lt($coupon->start_date)) {
            return [
                'valid' => false,
                'message' => "Promotion '{$coupon->code}' has not started yet.",
            ];
        }

        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return [
                'valid' => false,
                'message' => "Coupon '{$coupon->code}' has expired.",
            ];
        }

        // Overall usage limit
        if (! is_null($coupon->usage_limit) && $coupon->usage_count >= $coupon->usage_limit) {
            return [
                'valid' => false,
                'message' => "Coupon '{$coupon->code}' has reached its maximum usage limit.",
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
                    'message' => "You have already reached the maximum usage limit for coupon '{$coupon->code}'.",
                ];
            }
        }

        // Calculate Cart Subtotal
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
                'message' => sprintf("A minimum order spend of ₹%.2f is required for coupon '%s'.", $coupon->min_spend, $coupon->code),
            ];
        }

        // Product / Category / Collection Restrictions
        $hasRestrictions = ! empty($coupon->applicable_products)
            || ! empty($coupon->applicable_categories)
            || ! empty($coupon->applicable_collections);

        if ($hasRestrictions) {
            $productIds = collect($cartItems)->pluck('product_id')->filter()->all();
            $products = Product::with(['categories', 'collections'])->whereIn('id', $productIds)->get()->keyBy('id');

            $qualifyingSubtotal = 0;
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
                    'message' => "Coupon '{$coupon->code}' is not applicable to the items currently in your bag.",
                ];
            }
        }

        return ['valid' => true];
    }

    /**
     * Calculate individual & total discounts across one or multiple coupon models.
     */
    private static function calculateMultipleCoupons(
        array $coupons,
        array $cartItems,
        bool $replaced = false,
        ?string $latestCode = null
    ): array {
        $cartSubtotal = 0;
        foreach ($cartItems as $item) {
            $price = (float) ($item['unit_price'] ?? $item['price'] ?? 0);
            $qty = (int) ($item['quantity'] ?? 1);
            $cartSubtotal += ($price * $qty);
        }

        $appliedList = [];
        $totalDiscount = 0;
        $remainingSubtotal = $cartSubtotal;

        foreach ($coupons as $coupon) {
            if ($remainingSubtotal <= 0) {
                break;
            }

            $discount = 0;
            if ($coupon->type === 'percent') {
                $discount = round($cartSubtotal * ($coupon->value / 100), 2);
                if (! is_null($coupon->max_discount) && $discount > $coupon->max_discount) {
                    $discount = (float) $coupon->max_discount;
                }
            } else {
                $discount = min((float) $coupon->value, $remainingSubtotal);
            }

            $discount = min($discount, $remainingSubtotal);
            $totalDiscount += $discount;
            $remainingSubtotal = max(0, $remainingSubtotal - $discount);

            $appliedList[] = [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'description' => $coupon->description,
                'type' => $coupon->type,
                'value' => (float) $coupon->value,
                'allow_stacking' => (bool) $coupon->allow_stacking,
                'discount' => round($discount, 2),
            ];
        }

        $message = 'Coupon code applied successfully!';
        if ($replaced && $latestCode) {
            $message = "Applied '{$latestCode}'. (Replaced previous non-stackable coupon)";
        } elseif (count($appliedList) > 1) {
            $message = 'Combined multiple stackable coupons successfully!';
        }

        return [
            'valid' => true,
            'message' => $message,
            'replaced' => $replaced,
            'coupons' => $appliedList,
            'coupon' => $appliedList[0] ?? null, // backwards compatibility
            'total_discount' => round($totalDiscount, 2),
        ];
    }
}
