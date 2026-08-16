<?php

/**
 * Catalog hooks.
 */

namespace Glozin\WooCommerce\Catalog;

use Glozin\Helper;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class of Catalog
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
        add_action('wp', [$this, 'add_actions']);
        Product_Grid_Banner::instance();
    }

    public function add_actions()
    {
        if (apply_filters('glozin_load_catalog_layout', Helper::is_catalog())) {
            Layout::instance();
            if (Helper::get_option('top_categories')) {
                Top_Categories::instance();
            }

            if (Helper::get_option('catalog_toolbar')) {
                Toolbar::instance();
            }

            if (Helper::get_option('product_filter_type') == 'horizontal') {
                Filter_Horizontal::instance();
            }
            Products_Grid::instance();
            Pagination::instance();
            Page_Header::instance();
            Sidebar::instance();
        }

        if (Helper::is_catalog()) {
            View::instance();
            Products_List::instance();
        }
    }
}
