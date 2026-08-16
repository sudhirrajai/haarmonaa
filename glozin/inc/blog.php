<?php

/**
 * Blog functions and definitions.
 */

namespace Glozin;

use Glozin\Blog\Archive;
use Glozin\Blog\Comments;
use Glozin\Blog\Page_Header;
use Glozin\Blog\Single;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Woocommerce initial
 */
class Blog
{
    /**
     * Instance
     */
    private static $instance = null;

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
        add_action('template_redirect', [$this, 'template_hooks']);
    }

    /**
     * Template hooks
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function template_hooks()
    {
        if (Helper::is_blog() || (is_search() && get_query_var('post_type') != 'product')) {
            Page_Header::instance();
            Archive::instance();
        } elseif (is_singular('post')) {
            Single::instance();
            Comments::instance();
        }
    }
}
