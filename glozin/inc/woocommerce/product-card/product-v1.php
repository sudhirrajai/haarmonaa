<?php

/**
 * Product Card v1 hooks.
 */

namespace Glozin\WooCommerce\Product_Card;

use Glozin\Helper;
use Glozin\WooCommerce\Loop\Product_Attribute;
use Glozin\WooCommerce\Loop\Quick_View;
use WCBoost\Wishlist\Frontend;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class of Product Card v1
 */
class Product_V1 extends Base
{
    /**
     * Instance
     */
    protected static $instance = null;

    /**
     * Initiator
     *
     * @since 1.0.0
     *
     * @return object
     */
    public static function instance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Instantiate the object.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function __construct()
    {
        add_action('glozin_product_loop_thumbnail', [$this, 'product_featured_icons_open'], 5);
        if (class_exists('\WCBoost\Wishlist\Frontend') && Helper::get_option('product_card_wishlist')) {
            add_action('glozin_product_loop_thumbnail', [Frontend::instance(), 'loop_add_to_wishlist_button'], 10);
        }
        if (class_exists('\WCBoost\ProductsCompare\Frontend') && Helper::get_option('product_card_compare')) {
            add_action('glozin_product_loop_thumbnail', [\WCBoost\ProductsCompare\Frontend::instance(), 'loop_add_to_compare_button'], 15);
        }
        if (Helper::get_option('product_card_quick_view')) {
            add_action('glozin_product_loop_thumbnail', [Quick_View::instance(), 'quick_view_button_icon_light'], 20);
        }
        add_action('glozin_product_loop_thumbnail', 'woocommerce_template_loop_add_to_cart', 25);
        add_action('glozin_product_loop_thumbnail', [$this, 'product_featured_icons_close'], 30);
        add_action('glozin_product_loop_thumbnail', [$this, 'product_featured_icons_second_open'], 35);
        add_action('glozin_product_loop_thumbnail', 'woocommerce_template_loop_add_to_cart', 40);
        add_action('glozin_product_loop_thumbnail', [$this, 'product_featured_icons_close'], 50);

        add_action('woocommerce_after_shop_loop_item', [Product_Attribute::instance(), 'loop_primary_attribute'], 10);

        if (Helper::get_option('mobile_product_card_atc')) {
            add_action('woocommerce_after_shop_loop_item', [$this, 'add_to_cart_button_base'], 30);
        }
    }
}
