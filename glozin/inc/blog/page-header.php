<?php

/**
 * Glozin Blog Header functions and definitions.
 */

namespace Glozin\Blog;

use Glozin\Helper;

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Glozin Post
 */
class Page_Header
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
        add_filter('glozin_page_header_classes', [$this, 'classes']);
        add_filter('glozin_get_page_header_elements', [$this, 'elements']);

        add_filter('glozin_page_header_description', [$this, 'page_header_description'], 20);
        add_filter('glozin_page_header_description_lines', [$this, 'description_lines']);
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
        $classes .= ' page-header--blog';

        return $classes;
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
        $items = Helper::get_option('blog_header') ? (array) Helper::get_option('blog_header_els') : [];

        return $items;
    }

    /**
     * Get description
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function page_header_description($description)
    {
        if (is_category()) {
            $term = get_queried_object();
            if ($term) {
                $description = $term->description;
            }
        }

        return $description;
    }

    /**
     * Description lines
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function description_lines($number_lines)
    {
        $number_lines = Helper::get_option('blog_header_description_lines');

        return $number_lines;
    }
}
