<?php

/**
 * Single Product hooks.
 */

namespace Glozin\WooCommerce\Single_Product;

use Glozin\Helper;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class of Single Product
 */
class Product_Layout
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
        Product_Base::instance();
        Related::instance();
        UpSells::instance();
        Recently_Viewed::instance();

        if (intval(Helper::get_option('product_ask_question')) && ! empty(Helper::get_option('product_ask_question_form'))) {
            Ask_Question::instance();
        }

        if (intval(Helper::get_option('product_share'))) {
            Share::instance();
        }
    }
}
