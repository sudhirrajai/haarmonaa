<?php

/**
 * Woocommerce functions and definitions.
 */

namespace Glozin;

use Glozin\Vendors\Dokan;
use Glozin\Vendors\WCFM;
use Glozin\WooCommerce\Admin\Category_Settings;
use Glozin\WooCommerce\Admin\Customizer;
use Glozin\WooCommerce\Admin\Product_Settings;
use Glozin\WooCommerce\Badges;
use Glozin\WooCommerce\Cart\Cart;
use Glozin\WooCommerce\Cart\Mini_Cart;
use Glozin\WooCommerce\Cart\Quick_Edit;
use Glozin\WooCommerce\Catalog\Manager;
use Glozin\WooCommerce\Checkout;
use Glozin\WooCommerce\Compare;
use Glozin\WooCommerce\Dynamic_CSS;
use Glozin\WooCommerce\General;
use Glozin\WooCommerce\Login;
use Glozin\WooCommerce\Loop\Product_Attribute;
use Glozin\WooCommerce\Loop\Quick_View;
use Glozin\WooCommerce\My_Account;
use Glozin\WooCommerce\Product_Notices;
use Glozin\WooCommerce\Shoppable_Video_Elementor;
use Glozin\WooCommerce\Single_Product\ATC_Form;
use Glozin\WooCommerce\Single_Product\Product_Layout;
use Glozin\WooCommerce\Single_Product_Summary;
use Glozin\WooCommerce\Wishlist;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Woocommerce initial
 */
class WooCommerce
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
        add_action('after_setup_theme', [$this, 'woocommerce_setup']);
        add_action('wp', [$this, 'add_actions'], 10);
        add_action('init', [$this, 'init']);

        add_filter('woocommerce_get_script_data', [$this, 'get_script_data'], 10, 2);
        add_filter('woocommerce_get_image_size_gallery_thumbnail', [$this, 'get_gallery_thumbnail_size']);

        Customizer::instance();
    }

    /**
     * WooCommerce Init
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function init()
    {
        Product_Settings::instance();

        General::instance();
        Dynamic_CSS::instance();
        Badges::instance();
        Login::instance();

        Manager::instance();
        WooCommerce\Product_Card\Manager::instance();

        ATC_Form::instance();
        Single_Product_Summary::instance();
        // Mini Cart
        Quick_Edit::instance();
        Mini_Cart::instance();

        if (class_exists('WCFMmp')) {
            WCFM::instance();
        }

        if (class_exists('WeDevs_Dokan')) {
            Dokan::instance();
        }

        if (is_admin()) {
            Category_Settings::instance();
        }
    }

    /**
     * Add Actions
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function add_actions()
    {
        if (function_exists('wcboost_wishlist')) {
            Wishlist::instance();
        }

        if (function_exists('wcboost_products_compare')) {
            Compare::instance();
        }

        if (function_exists('is_account_page') && is_account_page()) {
            My_Account::instance();
        }

        if ($this->is_cart()) {
            Cart::instance();
        }

        if ($this->is_checkout()) {
            Checkout::instance();
        }

        if (apply_filters('glozin_load_single_product_layout', is_singular('product'))) {
            Product_Layout::instance();
        }

        if (function_exists('wcboost_variation_swatches')) {
            Product_Attribute::instance();
        }

        if (Helper::get_option('product_card_quick_view')) {
            Quick_View::instance();
        }

        Product_Notices::instance();
        Shoppable_Video_Elementor::instance();

    }

    public function is_checkout()
    {
        if (function_exists('is_checkout') && is_checkout()) {
            return true;
        }

        if (function_exists('has_block')) {
            $checkout_id = get_the_ID();
            if ($checkout_id && has_block('woocommerce/checkout', $checkout_id)) {
                return true;
            }
        }

        return false;
    }

    public function is_cart()
    {
        if (function_exists('is_cart') && is_cart()) {
            return true;
        }

        if (function_exists('has_block')) {
            $cart_id = get_the_ID();
            if ($cart_id && has_block('woocommerce/cart', $cart_id)) {
                return true;
            }
        }

        return false;
    }

    /**
     * WooCommerce setup function.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function woocommerce_setup()
    {
        add_theme_support('woocommerce', [
            'product_grid' => [
                'default_rows' => 4,
                'min_rows' => 2,
                'max_rows' => 20,
                'default_columns' => 4,
                'min_columns' => 2,
                'max_columns' => 7,
            ],
            'wishlist' => [
                'single_button_position' => 'theme',
                'loop_button_position' => 'theme',
                'button_type' => 'theme',
            ],
        ]);

        add_theme_support('wc-product-gallery-slider');

        if (Helper::get_option('product_image_lightbox')) {
            add_theme_support('wc-product-gallery-lightbox');
        }
    }

    /**
     * Return data for script handles.
     *
     * @param  string  $handle  Script handle the data will be attached to.
     * @return array|bool
     */
    public function get_script_data($params, $handle)
    {
        if ($handle == 'wc-single-product') {
            $params['flexslider_enabled'] = false;
            $params['photoswipe_enabled'] = false;
        }

        return $params;
    }

    /**
     * Set the gallery thumbnail size.
     *
     * @since 1.0.0
     *
     * @param  array  $size  Image size.
     * @return array
     */
    public function get_gallery_thumbnail_size($size)
    {
        $size['width'] = 130;
        $size['height'] = 0;
        $size['crop'] = 1;

        return $size;
    }
}
