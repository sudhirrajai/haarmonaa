<?php

/**
 * Admin functions and definitions.
 */

namespace Glozin;

use Glozin\Admin\Block_Editor;
use Glozin\Admin\Plugin_Install;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Mobile initial
 */
class Admin
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
        if (! is_admin()) {
            return;
        }

        Plugin_Install::instance();
        Block_Editor::instance();
    }
}
