<?php

/**
 * Modals functions and definitions.
 */

namespace Glozin;

use Glozin\Header\Main;
use Glozin\WooCommerce\Catalog\Toolbar;
use Glozin\WooCommerce\Single_Product\Ask_Question;
use Glozin\WooCommerce\Single_Product\Share;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Modals initial
 */
class Modals
{
    /**
     * Instance
     */
    protected static $instance = null;

    /**
     * Modals ID
     */
    protected static $footer_id = null;

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
        add_action('wp_footer', [$this, 'modals_items']);
        add_action('wp_footer', [$this, 'panel_items']);
        add_action('wp_footer', [$this, 'popover_items']);
    }

    /**
     * Modal items
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function modals_items()
    {
        $items = apply_filters('glozin_modals_items', (array) Theme::get_prop('modals'));

        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            $args = [];

            if ($item == 'product-ask-question') {
                $args = Ask_Question::ask_question_data();
            }

            if ($item == 'product-share') {
                $args = Share::product_share_data();
            }

            if ($item == 'search') {
                $args = Main::search_options();
            }

            get_template_part('template-parts/modals/'.$item, '', $args);
        }
    }

    /**
     * Panel items
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function panel_items()
    {
        $items = apply_filters('glozin_panel_items', (array) Theme::get_prop('panels'));

        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            $args = [];

            get_template_part('template-parts/panels/'.$item, '', $args);
        }
    }

    /**
     * Popover items
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function popover_items()
    {
        $items = apply_filters('glozin_popover_items', (array) Theme::get_prop('popovers'));

        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            $args = [];

            if ($item == 'mobile-orderby') {
                $args = Toolbar::orderby_list();
            }

            get_template_part('template-parts/popover/'.$item, '', $args);
        }
    }
}
