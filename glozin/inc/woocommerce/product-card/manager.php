<?php

/**
 * Product Card hooks.
 */

namespace Glozin\WooCommerce\Product_Card;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class of Product Card
 */
class Manager
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
        Base::instance();
        $this->render_product_card();
    }

    public function render_product_card()
    {
        switch (Base::get_layout()) {
            case '1':
                Product_V1::instance();
                break;
            case '2':
                Product_V2::instance();
                break;
        }
    }
}
