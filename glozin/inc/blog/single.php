<?php

/**
 * Single functions and definitions.
 */

namespace Glozin\Blog;

use Glozin\Helper;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Single initial
 */
class Single
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
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_filter('glozin_inline_style', [$this, 'inline_style']);

        add_filter('glozin_site_content_container_class', [$this, 'site_content_container_class']);

        // Post Format Image
        add_action('glozin_after_site_content_open', [$this, 'post_format_image'], 20);

        // Post Navigation
        if (Helper::get_option('post_navigation')) {
            add_action('glozin_after_post_content', [$this, 'navigation'], 40);
        }

        // Related Posts
        if (Helper::get_option('posts_related')) {
            add_action('glozin_after_post_content', [$this, 'related_posts'], 60);
        }

        // Content Layout
        add_action('glozin_site_layout', [$this, 'content_layout']);

        // Sidebar
        add_filter('glozin_get_sidebar', [$this, 'sidebar'], 10);

        // Page Header Elements
        add_filter('glozin_get_page_header_elements', [$this, 'elements']);
        add_filter('glozin_page_header_classes', [$this, 'classes']);
        add_filter('glozin_page_header_content_class', '__return_empty_string');

        add_filter('comment_form_fields', [$this, 'comment_fields_custom_order']);
    }

    /**
     * Enqueue scripts and styles.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function enqueue_scripts()
    {
        $debug = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
        wp_enqueue_style('glozin-blog', apply_filters('glozin_get_style_directory_uri', get_template_directory_uri()).'/assets/css/pages/blog'.$debug.'.css', [], Helper::get_theme_version());
    }

    public function inline_style($static_css)
    {
        $inline_css = '';
        switch (Helper::get_option('image_rounded_shape_featured_post')) {
            case 'square':
                $inline_css .= '--gz-image-rounded: 0;';
                break;
            case 'custom':
                if ($number = Helper::get_option('image_rounded_number_featured_post')) {
                    $inline_css .= '--gz-image-rounded:'.$number.'px;';
                }
                break;
        }

        $static_css .= $inline_css ? '.single-post .entry-single-thumbnail{'.$inline_css.'}' : '';

        return $static_css;
    }

    public function site_content_container_class($classes)
    {
        $classes = 'container';

        return $classes;
    }

    /**
     * Post Format Image
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function post_format_image()
    {
        if (Helper::get_option('post_featured_image')) {
            Post::featured_image();
        }
    }

    /**
     * Meta post navigation
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function navigation()
    {
        get_template_part('template-parts/post/post', 'navigation');
    }

    /**
     * Related post
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function related_posts()
    {
        get_template_part('template-parts/post/related-posts');
    }

    /**
     * Get site layout
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function content_layout($layout)
    {
        $layout = self::sidebar();
        $layout = ! $layout ? 'no-sidebar' : $layout;

        return $layout;
    }

    /**
     * Get Sidebar
     *
     * @since 1.0.0
     *
     * @return string
     */
    public static function sidebar()
    {
        if (! is_active_sidebar('blog-sidebar')) {
            return false;
        } else {
            $custom_post_sidebar = get_post_meta(get_the_ID(), '_post_sidebar', true);
            $sidebar = empty($custom_post_sidebar) ? Helper::get_option('post_sidebar') : $custom_post_sidebar;
            if ($sidebar == 'no-sidebar') {
                return false;
            } else {
                return $sidebar;
            }
        }

    }

    /**
     * Page Header Elements
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function elements($items)
    {
        $items = (array) Helper::get_option('single_post_header_els');

        return $items;
    }

    /**
     * Page Header Classes
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function classes($classes)
    {
        $classes .= ' page-header--single-blog';

        return $classes;
    }

    public function comment_fields_custom_order($fields)
    {
        $comment_field = $fields['comment'];
        $author_field = $fields['author'];
        $email_field = $fields['email'];
        $url_field = $fields['url'];
        $cookies_field = ! empty($fields['cookies']) ? $fields['cookies'] : '';
        if (isset($fields['comment'])) {
            unset($fields['comment']);
        }
        if (isset($fields['author'])) {
            unset($fields['author']);
        }
        if (isset($fields['email'])) {
            unset($fields['email']);
        }
        if (isset($fields['url'])) {
            unset($fields['url']);
        }

        if (isset($fields['cookies'])) {
            unset($fields['cookies']);
        }

        // the order of fields is the order below, change it as needed:
        $fields['author'] = $author_field;
        $fields['email'] = $email_field;
        $fields['comment'] = $comment_field;
        if (! empty($cookies_field)) {
            $fields['cookies'] = $cookies_field;
        }

        // done ordering, now return the fields:
        return $fields;
    }
}
