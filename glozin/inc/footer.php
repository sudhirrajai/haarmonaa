<?php

/**
 * Footer functions and definitions.
 */

namespace Glozin;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Footer initial
 */
class Footer
{
    /**
     * Instance
     */
    protected static $instance = null;

    /**
     * Footer ID
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
        add_action('glozin_after_close_site_footer', [$this, 'gotop_button']);
        add_action('glozin_after_close_site_footer', [$this, 'progress_bar']);
    }

    /**
     * Add this back-to-top button to footer
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function gotop_button()
    {
        if (apply_filters('glozin_get_back_to_top', Helper::get_option('backtotop'))) {
            echo '<a href="#page" id="gotop" class="gz-button gz-button-outline gz-button-icon gz-button-go-top position-fixed end-30 shadow invisible overflow-hidden z-3"><span class="gotop-height-scroll position-absolute bottom-0 start-0 w-100 bg-dark"></span>'.Icon::get_svg('double-arrow').'</a>';
        }

    }

    /**
     * Progress bar start
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function progress_bar()
    {
        echo '<div id="gz-progress-container" class="gz-progress-container">
			<div id="gz-progress-bar" class="gz-progress-bar"></div>
		</div>';
    }
}
