<?php

/**
 * Theme Options
 */

namespace Glozin;

use Glozin\Header\Main;
use Glozin\Header\Mobile;

// Exit if accessed directly
if (! defined('ABSPATH')) {
    exit;
}

class Options
{
    /**
     * Instance
     */
    protected static $instance = null;

    /**
     * $glozin_customize
     */
    protected static $glozin_customize = null;

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
     * The class constructor
     *
     * @since 1.0.0
     */
    public function __construct()
    {
        add_filter('glozin_customize_config', [$this, 'customize_settings']);
        self::$glozin_customize = Customizer::instance();
    }

    /**
     * This is a short hand function for getting setting value from customizer
     *
     * @since 1.0.0
     *
     * @param  string  $name
     * @return bool|string
     */
    public function get_option($name)
    {
        if (is_object(self::$glozin_customize)) {
            $value = self::$glozin_customize->get_option($name);
        } elseif (get_theme_mod($name) !== false) {
            $value = get_theme_mod($name);
        } else {
            $value = $this->get_option_default($name);
        }

        return apply_filters('glozin_get_option', $value, $name);
    }

    /**
     * Get default option values
     *
     * @since 1.0.0
     *
     * @return mixed
     */
    public function get_option_default($name)
    {
        if (is_object(self::$glozin_customize)) {
            return self::$glozin_customize->get_option_default($name);
        }

        $config = $this->customize_settings();
        $settings = array_reduce($config['settings'], 'array_merge', []);

        if (! isset($settings[$name])) {
            return false;
        }

        return isset($settings[$name]['default']) ? $settings[$name]['default'] : false;
    }

    /**
     * Options of topbar items
     *
     * @return array
     */
    public static function topbar_items_option()
    {
        return apply_filters('glozin_topbar_items_option', [
            '' => esc_html__('Select an Item', 'glozin'),
            'language' => esc_html__('Language', 'glozin'),
            'currency' => esc_html__('Currency', 'glozin'),
            'slides' => esc_html__('Slides', 'glozin'),
            'menu' => esc_html__('Menu', 'glozin'),
            'custom-html' => esc_html__('Custom HTML', 'glozin'),
        ]);
    }

    /**
     * Options of header items
     *
     * @return array
     */
    public static function header_items_option()
    {
        return apply_filters('glozin_header_items_option', [
            '' => esc_html__('Select an Item', 'glozin'),
            'logo' => esc_html__('Logo', 'glozin'),
            'primary-menu' => esc_html__('Primary Menu', 'glozin'),
            'secondary-menu' => esc_html__('Secondary Menu', 'glozin'),
            'search' => esc_html__('Search', 'glozin'),
            'account' => esc_html__('Account', 'glozin'),
            'wishlist' => esc_html__('Wishlist', 'glozin'),
            'compare' => esc_html__('Compare', 'glozin'),
            'cart' => esc_html__('Cart', 'glozin'),
            'language' => esc_html__('Language', 'glozin'),
            'currency' => esc_html__('Currency', 'glozin'),
            'custom-html' => esc_html__('Custom HTML', 'glozin'),
        ]);
    }

    /**
     * Options of header items
     *
     * @return array
     */
    public static function header_mobile_items_option()
    {
        return apply_filters('glozin_header_mobile_items_option', [
            '' => esc_html__('Select an Item', 'glozin'),
            'logo' => esc_html__('Logo', 'glozin'),
            'hamburger' => esc_html__('Hamburger', 'glozin'),
            'search' => esc_html__('Search', 'glozin'),
            'cart' => esc_html__('Cart', 'glozin'),
            'wishlist' => esc_html__('Wishlist', 'glozin'),
            'compare' => esc_html__('Compare', 'glozin'),
            'account' => esc_html__('Account', 'glozin'),
            'custom-html' => esc_html__('Custom HTML', 'glozin'),
        ]);
    }

    /**
     * Get customize settings
     *
     * @since 1.0.0
     *
     * @return array
     */
    public function customize_settings()
    {
        $settings = [
            'theme' => 'glozin',
        ];

        $panels = [
            'general' => [
                'priority' => 10,
                'title' => esc_html__('General', 'glozin'),
            ],
            'styling' => [
                'priority' => 15,
                'title' => esc_html__('Styling', 'glozin'),
            ],
            'typography' => [
                'priority' => 20,
                'title' => esc_html__('Typography', 'glozin'),
            ],
            'header' => [
                'priority' => 20,
                'title' => esc_html__('Header', 'glozin'),
            ],
            'page' => [
                'title' => esc_html__('Page', 'glozin'),
                'priority' => 30,
            ],
            'blog' => [
                'priority' => 30,
                'title' => esc_html__('Blog', 'glozin'),
            ],
            'mobile' => [
                'priority' => 90,
                'title' => esc_html__('Mobile', 'glozin'),
            ],
        ];

        $sections = [
            'maintenance' => [
                'title' => esc_html__('Maintenance', 'glozin'),
                'priority' => 10,
                'capability' => 'edit_theme_options',
            ],
            'color_scheme' => [
                'title' => esc_html__('Color Scheme', 'glozin'),
                'panel' => 'styling',
            ],
            'styling_images' => [
                'title' => esc_html__('Images', 'glozin'),
                'panel' => 'styling',
            ],
            'styling_buttons' => [
                'title' => esc_html__('Buttons', 'glozin'),
                'panel' => 'styling',
            ],
            'styling_form_fields' => [
                'title' => esc_html__('Form Fields', 'glozin'),
                'panel' => 'styling',
            ],
            'backtotop' => [
                'title' => esc_html__('Back To Top', 'glozin'),
                'panel' => 'general',
            ],
            // Typography
            'typo_font_family' => [
                'title' => esc_html__('Font Family', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_main' => [
                'title' => esc_html__('Main', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_headings' => [
                'title' => esc_html__('Headings', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_header_logo' => [
                'title' => esc_html__('Header Logo Text', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_header_menu_primary' => [
                'title' => esc_html__('Header Primary Menu', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_page' => [
                'title' => esc_html__('Page', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_posts' => [
                'title' => esc_html__('Blog', 'glozin'),
                'panel' => 'typography',
            ],
            'typo_widget' => [
                'title' => esc_html__('Widgets', 'glozin'),
                'panel' => 'typography',
            ],
            // Header
            'header_top' => [
                'title' => esc_html__('Topbar', 'glozin'),
                'panel' => 'header',
            ],
            'header_campaign' => [
                'title' => esc_html__('Campaign Bar', 'glozin'),
                'panel' => 'header',
            ],
            'header_layout' => [
                'title' => esc_html__('Header Layout', 'glozin'),
                'panel' => 'header',
            ],
            'header_main' => [
                'title' => esc_html__('Header Main', 'glozin'),
                'panel' => 'header',
            ],
            'header_bottom' => [
                'title' => esc_html__('Header Bottom', 'glozin'),
                'panel' => 'header',
            ],
            'header_sticky' => [
                'title' => esc_html__('Sticky Header', 'glozin'),
                'panel' => 'header',
            ],
            'header_background' => [
                'title' => esc_html__('Header Background', 'glozin'),
                'panel' => 'header',
            ],
            'header_logo' => [
                'title' => esc_html__('Logo', 'glozin'),
                'panel' => 'header',
            ],
            'header_account' => [
                'title' => esc_html__('Account', 'glozin'),
                'panel' => 'header',
            ],
            'header_wishlist' => [
                'title' => esc_html__('Wishlist', 'glozin'),
                'panel' => 'header',
            ],
            'header_compare' => [
                'title' => esc_html__('Compare', 'glozin'),
                'panel' => 'header',
            ],
            'header_cart' => [
                'title' => esc_html__('Cart', 'glozin'),
                'panel' => 'header',
            ],
            'header_search' => [
                'title' => esc_html__('Search', 'glozin'),
                'panel' => 'header',
            ],
            'header_product_categories' => [
                'title' => esc_html__('Product Categories', 'glozin'),
                'panel' => 'header',
            ],
            'header_custom_html' => [
                'title' => esc_html__('Custom HTML', 'glozin'),
                'panel' => 'header',
            ],
            // Blog
            'post_card' => [
                'title' => esc_html__('Post Card Images', 'glozin'),
                'panel' => 'blog',
            ],
            'blog_header' => [
                'title' => esc_html__('Blog Header', 'glozin'),
                'panel' => 'blog',
            ],
            'blog_page' => [
                'title' => esc_html__('Blog Page', 'glozin'),
                'panel' => 'blog',
            ],
            'blog_single' => [
                'title' => esc_html__('Blog Single', 'glozin'),
                'panel' => 'blog',
            ],
            'share_socials' => [
                'title' => esc_html__('Share Socials', 'glozin'),
                'panel' => 'general',
            ],
            // Page
            'page_header' => [
                'title' => esc_html__('Page Header', 'glozin'),
                'panel' => 'page',
            ],
            // Mobile
            'topbar_mobile' => [
                'title' => esc_html__('Topbar', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_layout' => [
                'title' => esc_html__('Header Layout', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_main' => [
                'title' => esc_html__('Header Main', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_bottom' => [
                'title' => esc_html__('Header Bottom', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_elements' => [
                'title' => esc_html__('Header Elements', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_sticky' => [
                'title' => esc_html__('Sticky Header', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_background' => [
                'title' => esc_html__('Header Background', 'glozin'),
                'panel' => 'mobile',
            ],
            'header_mobile_menu' => [
                'title' => esc_html__('Header Mobile Menu', 'glozin'),
                'panel' => 'mobile',
            ],
            'mobile_product_catalog' => [
                'title' => esc_html__('Product Catalog', 'glozin'),
                'panel' => 'mobile',
            ],
            'mobile_product_card' => [
                'title' => esc_html__('Product Card', 'glozin'),
                'panel' => 'mobile',
            ],
            'mobile_single_product' => [
                'title' => esc_html__('Single Product', 'glozin'),
                'panel' => 'mobile',
            ],
        ];

        $settings = [];

        // Maintenance
        $settings['maintenance'] = [
            'maintenance_enable' => [
                'type' => 'toggle',
                'label' => esc_html__('Enable Maintenance Mode', 'glozin'),
                'description' => esc_html__('Put your site into maintenance mode', 'glozin'),
                'default' => false,
            ],
            'maintenance_mode' => [
                'type' => 'radio',
                'label' => esc_html__('Mode', 'glozin'),
                'description' => esc_html__('Select the correct mode for your site', 'glozin'),
                'tooltip' => wp_kses_post(sprintf(__('If you are putting your site into maintenance mode for a longer perior of time, you should set this to "Coming Soon". Maintenance will return HTTP 503, Comming Soon will set HTTP to 200. <a href="%s" target="_blank">Learn more</a>', 'glozin'), 'https://yoast.com/http-503-site-maintenance-seo/')),
                'default' => 'maintenance',
                'choices' => [
                    'maintenance' => esc_html__('Maintenance', 'glozin'),
                    'coming_soon' => esc_html__('Coming Soon', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'maintenance_enable',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'maintenance_page' => [
                'type' => 'dropdown-pages',
                'label' => esc_html__('Maintenance Page', 'glozin'),
                'default' => 0,
                'active_callback' => [
                    [
                        'setting' => 'maintenance_enable',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
        ];

        // Color Scheme
        $settings['color_scheme'] = [
            'primary_color_title' => [
                'type' => 'custom',
                'label' => esc_html__('Primary Color', 'glozin'),
            ],
            'primary_color' => [
                'type' => 'color-palette',
                'choices' => [
                    'colors' => [
                        '#d0473e',
                        '#3357d8',
                        '#a62658',
                        '#0f855b',
                        '#0f8482',
                        '#197149',
                    ],
                    'style' => 'round',
                ],
                'active_callback' => [
                    [
                        'setting' => 'primary_color_custom',
                        'operator' => '!=',
                        'value' => true,
                    ],
                ],
            ],
            'primary_color_custom' => [
                'type' => 'checkbox',
                'label' => esc_html__('Pick my favorite color', 'glozin'),
                'default' => false,

            ],
            'primary_color_custom_color' => [
                'type' => 'color',
                'label' => esc_html__('Custom Color', 'glozin'),
                'default' => '#d0473e',
                'active_callback' => [
                    [
                        'setting' => 'primary_color_custom',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'primary_text_color' => [
                'type' => 'select',
                'default' => false,
                'label' => esc_html__('Text on Primary Color', 'glozin'),
                'default' => 'light',
                'choices' => [
                    'light' => esc_html__('Light', 'glozin'),
                    'dark' => esc_html__('Dark', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
            ],
            'primary_text_color_custom' => [
                'type' => 'color',
                'label' => esc_html__('Custom Color', 'glozin'),
                'default' => '#fff',
                'active_callback' => [
                    [
                        'setting' => 'primary_text_color',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'primary_base_color_hr' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'primary_base_color' => [
                'type' => 'color',
                'label' => esc_html__('Base Color', 'glozin'),
                'default' => '',
            ],
            'primary_dark_color' => [
                'type' => 'color',
                'label' => esc_html__('Dark Color', 'glozin'),
                'default' => '',
            ],
            'primary_link_color' => [
                'type' => 'color',
                'label' => esc_html__('Link Color', 'glozin'),
                'default' => '',
            ],
            'primary_link_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Link Hover Color', 'glozin'),
                'default' => '',
            ],
            'product_card_sale_color' => [
                'type' => 'color',
                'label' => esc_html__('Sale Color', 'glozin'),
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.gz-price ins',
                        'property' => '--gz-color-price-sale',
                    ],
                    [
                        'element' => '.price ins',
                        'property' => '--gz-color-price-sale',
                    ],
                ],
            ],
        ];

        $settings['styling_images'] = [
            'image_rounded_shape' => [
                'type' => 'select',
                'label' => esc_html__('Corner Radius', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Round', 'glozin'),
                    'square' => esc_html__('Square', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
            ],
            'image_rounded_number' => [
                'type' => 'number',
                'label' => esc_html__('Number(px)', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'image_rounded_shape',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],

        ];

        $settings['styling_buttons'] = [
            'button_rounded_shape' => [
                'type' => 'select',
                'label' => esc_html__('Corner Radius', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Circle', 'glozin'),
                    'square' => esc_html__('Square', 'glozin'),
                    'round' => esc_html__('Round', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
            ],
            'button_rounded_number' => [
                'type' => 'number',
                'label' => esc_html__('Number(px)', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'button_rounded_shape',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'button_eff_hover_bg_disable' => [
                'type' => 'toggle',
                'label' => esc_html__('Disable Hover Effect', 'glozin'),
                'default' => false,
            ],
            'button_custom_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'button_solid_dark_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Solid Dark', 'glozin'),
            ],
            'button_solid_dark_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
            ],
            'button_solid_dark_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_solid_dark_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_solid_dark_eff_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Effect Background Color Hover', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'button_eff_hover_bg_disable',
                        'operator' => '==',
                        'value' => false,
                    ],
                ],
            ],
            'button_solid_dark_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_custom_hr_2' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            // Button Light
            'button_solid_light_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Solid Light', 'glozin'),
            ],
            'button_solid_light_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
            ],
            'button_solid_light_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_solid_light_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_solid_light_eff_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Effect Background Color Hover', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'button_eff_hover_bg_disable',
                        'operator' => '==',
                        'value' => false,
                    ],
                ],
            ],
            'button_solid_light_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_custom_hr_3' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            // Button Outline
            'button_outline_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Outline', 'glozin'),
            ],
            'button_outline_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
            ],
            'button_outline_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_outline_hover_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_outline_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_outline_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_custom_hr_4' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            // Button Outline
            'button_outline_dark_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Outline Dark', 'glozin'),
            ],
            'button_outline_dark_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
            ],
            'button_outline_dark_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_outline_dark_hover_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_outline_dark_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_outline_dark_eff_hover_bg_color_select' => [
                'type' => 'select',
                'label' => esc_html__('Effect Background Color', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Default', 'glozin'),
                    'yes' => esc_html__('Yes', 'glozin'),
                    'no' => esc_html__('No', 'glozin'),
                ],
            ],
            'button_outline_dark_eff_hover_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Effect Background Color Hover', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'button_outline_dark_eff_hover_bg_color_select',
                        'operator' => '==',
                        'value' => 'yes',
                    ],
                ],
            ],
            'button_outline_dark_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_custom_hr_5' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            // Button Underline
            'button_underline_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Underline', 'glozin'),
            ],
            'button_underline_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_underline_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
            'button_custom_hr_6' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            // Button Text
            'button_text_headline' => [
                'type' => 'headline',
                'label' => esc_html__('Text', 'glozin'),
            ],
            'button_text_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'button_text_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Color Hover', 'glozin'),
                'default' => '',
            ],
        ];

        $settings['styling_form_fields'] = [
            'form_fields_rounded_shape' => [
                'type' => 'select',
                'label' => esc_html__('Corner Radius', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Circle', 'glozin'),
                    'round' => esc_html__('Round', 'glozin'),
                    'square' => esc_html__('Square', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
            ],
            'form_fields_rounded_number' => [
                'type' => 'number',
                'label' => esc_html__('Number(px)', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'form_fields_rounded_shape',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'form_fields_custom_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'form_fields_bg_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
            ],
            'form_fields_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
            ],
            'form_fields_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
            ],
            'form_fields_hover_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color Hover', 'glozin'),
                'default' => '',
            ],
        ];

        // Typography
        // Typography - body.
        $settings['typo_main'] = [
            'typo_body' => [
                'type' => 'typography',
                'label' => esc_html__('Body', 'glozin'),
                'description' => esc_html__('Customize the body font', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => 'regular',
                    'font-size' => '15px',
                    'line-height' => '1.6',
                    'color' => '#444',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'body',
                    ],
                ],
            ],
        ];

        $settings['typo_font_family'] = [
            'typo_font_family' => [
                'type' => 'toggle',
                'default' => true,
                'label' => esc_html__('Instrument Sans Font', 'glozin'),
                'description' => esc_html__('Enable this option to load Instrument Sans Font', 'glozin'),
            ],
        ];

        // Typography - headings.
        $settings['typo_headings'] = [
            'typo_heading' => [
                'type' => 'typography',
                'label' => esc_html__('Heading', 'glozin'),
                'description' => esc_html__('Customize the Heading font', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => 'regular',
                    'line-height' => '1.2',
                    'color' => '#111',
                    'text-transform' => 'none',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h1,h2,h3,h4,h5,h6',
                    ],
                ],
            ],
            'typo_heading_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h1' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 1', 'glozin'),
                'default' => [
                    'font-size' => '40px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h1, .h1',
                    ],
                ],
            ],
            'typo_heading_hr_2' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h2' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 2', 'glozin'),
                'default' => [
                    'font-size' => '36px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h2, .h2',
                    ],
                ],
            ],
            'typo_heading_hr_3' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h3' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 3', 'glozin'),
                'default' => [
                    'font-size' => '30px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h3, .h3',
                    ],
                ],
            ],
            'typo_heading_hr_4' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h4' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 4', 'glozin'),
                'default' => [
                    'font-size' => '26px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h4, .h4',
                    ],
                ],
            ],
            'typo_heading_hr_5' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h5' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 5', 'glozin'),
                'default' => [
                    'font-size' => '18px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h5, .h5',
                    ],
                ],
            ],
            'typo_heading_hr_6' => [
                'type' => 'custom',
                'default' => '<hr/>',
            ],
            'typo_h6' => [
                'type' => 'typography',
                'label' => esc_html__('Heading 6', 'glozin'),
                'default' => [
                    'font-size' => '16px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => 'h6, .h6',
                    ],
                ],
            ],
        ];

        // Typography - header primary menu.
        $settings['typo_header_logo'] = [
            'logo_font' => [
                'type' => 'typography',
                'label' => esc_html__('Logo Font', 'glozin'),
                'default' => [
                    'font-family' => '',
                    'variant' => '',
                    'font-size' => '',
                    'letter-spacing' => '',
                    'subsets' => ['latin-ext'],
                    'text-transform' => 'none',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'output' => [
                    [
                        'element' => '.site-header .header-logo__text',
                    ],
                ],
            ],
        ];

        // Typography - header primary menu.
        $settings['typo_header_menu_primary'] = [
            'typo_menu' => [
                'type' => 'typography',
                'label' => esc_html__('Menu', 'glozin'),
                'description' => esc_html__('Customize the menu font', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => '600',
                    'font-size' => '15px',
                    'line-height' => '1.6667',
                    'text-transform' => 'none',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.primary-navigation .nav-menu > li > a',
                    ],
                ],
            ],
            'typo_submenu' => [
                'type' => 'typography',
                'label' => esc_html__('Sub-Menu', 'glozin'),
                'description' => esc_html__('Customize the sub-menu font', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => 'regular',
                    'font-size' => '15px',
                    'line-height' => '1.6667',
                    'text-transform' => 'none',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.primary-navigation li .menu-item > a, .primary-navigation li .menu-item--widget > a, .primary-navigation .mega-menu ul.mega-menu__column .menu-item--widget-heading a, .primary-navigation li .menu-item > span, .primary-navigation li .menu-item > h6',
                    ],
                ],
            ],
        ];

        $settings['typo_page'] = [
            'typo_page_title' => [
                'type' => 'typography',
                'label' => esc_html__('Page Title', 'glozin'),
                'description' => esc_html__('Customize the page title font', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => '600',
                    'font-size' => '36px',
                    'line-height' => '',
                    'text-transform' => 'none',
                    'color' => '#111',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '-1.224px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.page-header--page .page-header__title',
                    ],
                ],
            ],
        ];

        // Typography - posts.
        $settings['typo_posts'] = [
            'typo_blog_header_title' => [
                'type' => 'typography',
                'label' => esc_html__('Blog Header Title', 'glozin'),
                'description' => esc_html__('Customize the font of blog header', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => '600',
                    'font-size' => '36px',
                    'line-height' => '',
                    'text-transform' => 'none',
                    'color' => '#111',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '-1.224px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.page-header--blog .page-header__title',
                    ],
                ],
            ],
            'typo_blog_post_title' => [
                'type' => 'typography',
                'label' => esc_html__('Blog Post Title', 'glozin'),
                'description' => esc_html__('Customize the font of blog post title', 'glozin'),
                'default' => [
                    'font-family' => 'Instrument Sans',
                    'variant' => '600',
                    'font-size' => '20px',
                    'line-height' => '',
                    'text-transform' => 'none',
                    'color' => '#111',
                    'subsets' => ['latin-ext'],
                    'letter-spacing' => '-0.68px',
                ],
                'choices' => $this->customizer_fonts_choices(),
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.single-post .hentry .entry-header .entry-title',
                    ],
                ],
            ],
        ];

        $settings['header_top'] = [
            'topbar' => [
                'type' => 'toggle',
                'label' => esc_html__('Topbar', 'glozin'),
                'description' => esc_html__('Display a bar on the top', 'glozin'),
                'default' => false,
                'priority' => 5,
            ],
            'topbar_fullwidth' => [
                'type' => 'toggle',
                'label' => esc_html__('Topbar Full Width', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 5,
            ],
            'topbar_custom_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/>',
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 10,
            ],
            'topbar_left' => [
                'type' => 'repeater',
                'label' => esc_html__('Left Items', 'glozin'),
                'description' => esc_html__('Control items on the left side of the topbar', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->topbar_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 15,
            ],
            'topbar_right' => [
                'type' => 'repeater',
                'label' => esc_html__('Right Items', 'glozin'),
                'description' => esc_html__('Control items on the right side of the topbar', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->topbar_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 25,
            ],
            'topbar_custom_hr_2' => [
                'type' => 'custom',
                'default' => '<hr/>',
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 30,
            ],
            'topbar_slides' => [
                'type' => 'repeater',
                'label' => esc_html__('Slides Item', 'glozin'),
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Slide', 'glozin'),
                    'field' => 'text',
                ],
                'fields' => [
                    'text' => [
                        'type' => 'textarea',
                        'label' => esc_html__('Text', 'glozin'),
                        'sanitize_callback' => 'Glozin\Icon::sanitize_svg',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 35,
            ],
            'topbar_custom_heading_3' => [
                'type' => 'custom',
                'default' => '<hr/>',
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 40,
            ],
            'topbar_menu' => [
                'type' => 'select',
                'label' => esc_html__('Menu Item', 'glozin'),
                'default' => '',
                'choices' => $this->get_menus(),
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 40,
            ],
            'topbar_custom_html' => [
                'type' => 'textarea',
                'label' => esc_html__('Custom HTML', 'glozin'),
                'description' => esc_html__('Paste your HTML here', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 43,
            ],
            'topbar_custom_heading_4' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Topbar Background', 'glozin').'</h2>',
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 45,
            ],
            'topbar_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.topbar',
                        'property' => '--gz-background-color',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 60,
            ],
            'topbar_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.topbar',
                        'property' => '--gz-text-color',
                    ],
                    [
                        'element' => '.topbar-slides .swiper .swiper-button-text',
                        'property' => '--gz-arrow-color',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 65,
            ],
            'topbar_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Hover Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.topbar',
                        'property' => '--gz-text-hover-color',
                    ],
                    [
                        'element' => '.topbar-slides .swiper .swiper-button-text',
                        'property' => '--gz-arrow-color-hover',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 65,
            ],
            'topbar_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.topbar',
                        'property' => '--gz-topbar-border-color',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'topbar_border',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 65,
            ],
            'topbar_custom_heading_5' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Topbar Style', 'glozin').'</h2>',
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 70,
            ],
            'topbar_height' => [
                'type' => 'slider',
                'label' => esc_html__('Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => [
                    'desktop' => 42,
                    'tablet' => 42,
                    'mobile' => 42,
                ],
                'responsive' => true,
                'choices' => [
                    'min' => 0,
                    'max' => 200,
                ],
                'output' => [
                    [
                        'element' => '.topbar',
                        'property' => 'height',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                    [
                        'element' => '.topbar .topbar-items',
                        'property' => 'line-height',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 70,
            ],
            'topbar_border' => [
                'type' => 'toggle',
                'label' => esc_html__('Border', 'glozin'),
                'default' => false,
                'priority' => 75,
                'active_callback' => [
                    [
                        'setting' => 'topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
        ];

        // Header layout settings.
        $settings['header_layout'] = [
            'header_present' => [
                'type' => 'radio',
                'label' => esc_html__('Present', 'glozin'),
                'description' => esc_html__('Select a prebuilt header or build your own', 'glozin'),
                'default' => 'prebuild',
                'choices' => [
                    'prebuild' => esc_html__('Use pre-build header', 'glozin'),
                    'custom' => esc_html__('Build my own', 'glozin'),
                ],
            ],
            'header_version' => [
                'type' => 'select',
                'label' => esc_html__('Prebuilt Header', 'glozin'),
                'description' => esc_html__('Select a prebuilt header present', 'glozin'),
                'default' => 'v2',
                'choices' => [
                    'v1' => esc_html__('Header V1', 'glozin'),
                    'v2' => esc_html__('Header V2', 'glozin'),
                    'v3' => esc_html__('Header V3', 'glozin'),
                    'v4' => esc_html__('Header V4', 'glozin'),
                    'v5' => esc_html__('Header V5', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_fullwidth' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Full Width', 'glozin'),
                'default' => true,
            ],
            'header_element' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_prebuild_currency' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Currency', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_prebuild_search' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Search', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_prebuild_account' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Account', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_prebuild_wishlist' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Wishlist', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_prebuild_compare' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Compare', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_prebuild_cart' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Cart', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
        ];

        // Header main settings.
        $settings['header_main'] = [
            'header_main_left' => [
                'type' => 'repeater',
                'label' => esc_html__('Left Items', 'glozin'),
                'description' => esc_html__('Control items on the left side of header main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_main_left' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 10,
            ],
            'header_main_center' => [
                'type' => 'repeater',
                'label' => esc_html__('Center Items', 'glozin'),
                'description' => esc_html__('Control items at the center of header main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_main_center' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 15,
            ],
            'header_main_right' => [
                'type' => 'repeater',
                'label' => esc_html__('Right Items', 'glozin'),
                'description' => esc_html__('Control items on the right of header main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_main_right' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 20,
            ],
            'header_main_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'priority' => 25,
            ],
            'header_main_height' => [
                'type' => 'slider',
                'label' => esc_html__('Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '70',
                'choices' => [
                    'min' => 50,
                    'max' => 500,
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__desktop .header-main',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
                'priority' => 30,
            ],
            'header_main_divider' => [
                'type' => 'toggle',
                'label' => esc_html__('Divider', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'priority' => 35,
            ],
        ];

        // Header bottom settings.
        $settings['header_bottom'] = [
            'header_bottom_left' => [
                'type' => 'repeater',
                'label' => esc_html__('Left Items', 'glozin'),
                'description' => esc_html__('Control items on the left side of header bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_bottom_left' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 10,
            ],
            'header_bottom_center' => [
                'type' => 'repeater',
                'label' => esc_html__('Center Items', 'glozin'),
                'description' => esc_html__('Control items at the center of header bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_bottom_center' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 15,
            ],
            'header_bottom_right' => [
                'type' => 'repeater',
                'label' => esc_html__('Right Items', 'glozin'),
                'description' => esc_html__('Control items on the right of header bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_bottom_right' => [
                        'selector' => '#site-header',
                        'render_callback' => [Main::instance(), 'render'],
                    ],
                ],
                'priority' => 20,
            ],
            'header_bottom_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'priority' => 25,
            ],
            'header_bottom_height' => [
                'type' => 'slider',
                'label' => esc_html__('Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '60',
                'choices' => [
                    'min' => 30,
                    'max' => 500,
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__desktop .header-bottom',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
                'priority' => 30,
            ],
            'header_bottom_divider' => [
                'type' => 'toggle',
                'label' => esc_html__('Divider', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'priority' => 35,
            ],
        ];

        // Header sticky settings.
        $settings['header_sticky'] = [
            'header_sticky' => [
                'type' => 'toggle',
                'label' => esc_html__('Sticky Header', 'glozin'),
                'default' => false,
            ],
            'header_sticky_on' => [
                'type' => 'select',
                'label' => esc_html__('Sticky On', 'glozin'),
                'default' => 'down',
                'choices' => [
                    'down' => esc_html__('Scroll Down', 'glozin'),
                    'up' => esc_html__('Scroll Up', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'header_sticky_el' => [
                'type' => 'select',
                'label' => esc_html__('Sticky Header Section', 'glozin'),
                'default' => 'header_main',
                'choices' => [
                    'header_main' => esc_html__('Header Main', 'glozin'),
                    'header_bottom' => esc_html__('Header Bottom', 'glozin'),
                    'both' => esc_html__('Both', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'header_sticky_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_sticky_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Main Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '85',
                'choices' => [
                    'min' => 30,
                    'max' => 400,
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'header_sticky_el',
                        'operator' => '!==',
                        'value' => 'header_bottom',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__desktop.minimized .header-main, .site-header__desktop.headroom--not-top .header-main',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                    [
                        'element' => '.site-header__desktop.minimized .header-sticky + .header-bottom, .site-header__desktop.headroom--not-top .header-sticky + .header-bottom',
                        'property' => 'top',
                        'units' => 'px',
                    ],
                ],
            ],
            'header_sticky_bottom_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Bottom Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '64',
                'choices' => [
                    'min' => 30,
                    'max' => 400,
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'header_sticky_el',
                        'operator' => '!==',
                        'value' => 'header_main',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__desktop.minimized .header-bottom, .site-header__desktop.headroom--not-top .header-bottom',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
            ],
        ];

        $settings['header_background'] = [
            'header_background_heading_1' => [
                'type' => 'custom',
                'default' => '<h2>'.esc_html__('Header Main', 'glozin').'</h2>',
            ],
            'header_main_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-main',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'header_main_text_color' => [
                'type' => 'color',
                'label' => esc_html__('Text Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-main',
                        'property' => '--gz-header-color',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-main',
                        'property' => 'color',
                    ],
                ],
            ],
            'header_main_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-main',
                        'property' => '--gz-header-main-border-color',
                    ],
                ],
            ],
            'header_main_shadow_color' => [
                'type' => 'color',
                'label' => esc_html__('Box Shadow Color', 'glozin'),
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-main',
                        'property' => '--gz-header-main-shadow-color',
                    ],
                ],
            ],
            'header_background_heading_2' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Header Bottom', 'glozin').'</h2>',
            ],
            'header_bottom_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-bottom',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'header_bottom_text_color' => [
                'type' => 'color',
                'label' => esc_html__('Text Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-bottom',
                        'property' => '--gz-header-color',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-bottom',
                        'property' => 'color',
                    ],
                ],
            ],
            'header_bottom_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-bottom',
                        'property' => '--gz-header-bottom-border-color',
                    ],
                ],
            ],
            'header_bottom_shadow_color' => [
                'type' => 'color',
                'label' => esc_html__('Box Shadow Color', 'glozin'),
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__desktop .header-bottom',
                        'property' => '--gz-header-bottom-shadow-color',
                    ],
                ],
            ],
            'header_background_heading_3' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Header Counter', 'glozin').'</h2>',
            ],
            'header_counter_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.header-counter',
                        'property' => '--gz-color-primary',
                    ],
                ],
            ],
            'header_counter_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.header-counter',
                        'property' => '--gz-text-color-on-primary',
                    ],
                ],
            ],
        ];

        // Campaign bar.
        $settings['header_campaign'] = [
            'campaign_bar' => [
                'type' => 'toggle',
                'label' => esc_html__('Campaign Bar', 'glozin'),
                'description' => esc_html__('Display a bar before the site header.', 'glozin'),
                'default' => false,
                'priority' => 0,
            ],
            'campaign_bar_type' => [
                'type' => 'select',
                'label' => esc_html__('Type', 'glozin'),
                'default' => 'countdown',
                'choices' => [
                    'countdown' => esc_html__('Countdown', 'glozin'),
                    'slides' => esc_html__('Slides', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 10,
            ],
            'campaign_bar_width' => [
                'type' => 'slider',
                'label' => esc_html__('Width', 'glozin'),
                'transport' => 'postMessage',
                'default' => '550',
                'choices' => [
                    'min' => 100,
                    'max' => 2000,
                ],
                'js_vars' => [
                    [
                        'element' => '.campaign-bar-type--slides',
                        'property' => '--gz-campaign-bar-width',
                        'units' => 'px',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'campaign_bar_type',
                        'operator' => '==',
                        'value' => 'slides',
                    ],
                ],
            ],
            'campaign_items_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 20,
            ],
            'campaign_items' => [
                'type' => 'repeater',
                'label' => esc_html__('Campaign Items', 'glozin'),
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Campaign', 'glozin'),
                    'field' => 'text',
                ],
                'fields' => [
                    'text' => [
                        'type' => 'textarea',
                        'label' => esc_html__('Text', 'glozin'),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'campaign_bar_type',
                        'operator' => '==',
                        'value' => 'slides',
                    ],
                ],
                'priority' => 25,
            ],
            'campaign_image' => [
                'type' => 'image',
                'label' => esc_html__('Image Before Text', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'campaign_bar_type',
                        'operator' => '==',
                        'value' => 'countdown',
                    ],
                ],
                'priority' => 30,
            ],
            'campaign_text' => [
                'type' => 'textarea',
                'label' => esc_html__('Text', 'glozin'),
                'description' => esc_html__('Paste text of your campaign here', 'glozin'),
                'output' => [
                    [
                        'element' => '.campaign-bar',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'campaign_bar_type',
                        'operator' => '==',
                        'value' => 'countdown',
                    ],
                ],
                'priority' => 35,
            ],
            'campaign_date' => [
                'type' => 'date',
                'label' => esc_html__('Date', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'campaign_bar_type',
                        'operator' => '==',
                        'value' => 'countdown',
                    ],
                ],
                'priority' => 40,
            ],
            'campaign_custom_heading' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Campaign Background', 'glozin').'</h2>',
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 55,
            ],
            'campaign_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.campaign-bar',
                        'property' => '--gz-campaign-background',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 60,
            ],
            'campaign_color' => [
                'type' => 'color',
                'label' => esc_html__('Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.campaign-bar',
                        'property' => '--gz-campaign-text-color',
                    ],
                    [
                        'element' => '.campaign-bar-type--slides .swiper .swiper-button-text',
                        'property' => '--gz-arrow-color',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 65,
            ],
            'campaign_hover_color' => [
                'type' => 'color',
                'label' => esc_html__('Hover Color', 'glozin'),
                'default' => '',
                'transport' => 'postMessage',
                'js_vars' => [
                    [
                        'element' => '.campaign-bar__close',
                        'property' => '--gz-button-color-hover',
                    ],
                    [
                        'element' => '.campaign-bar-type--slides .swiper .swiper-button-text',
                        'property' => '--gz-arrow-color-hover',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'campaign_bar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'priority' => 65,
            ],
        ];

        // Logo.
        $settings['header_logo'] = [
            'logo_type' => [
                'type' => 'radio',
                'label' => esc_html__('Logo Type', 'glozin'),
                'default' => 'image',
                'choices' => [
                    'image' => esc_html__('Image', 'glozin'),
                    'text' => esc_html__('Text', 'glozin'),
                    'svg' => esc_html__('SVG', 'glozin'),
                ],
            ],
            'logo_text' => [
                'type' => 'text',
                'label' => esc_html__('Logo Text', 'glozin'),
                'default' => 'Glozin',
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '==',
                        'value' => 'text',
                    ],
                ],
            ],
            'logo_svg' => [
                'type' => 'textarea',
                'label' => esc_html__('Logo SVG', 'glozin'),
                'description' => esc_html__('Paste SVG code of your logo here', 'glozin'),
                'sanitize_callback' => 'Glozin\Icon::sanitize_svg',
                'output' => [
                    [
                        'element' => '.site-header .header-logo',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '==',
                        'value' => 'svg',
                    ],
                ],
            ],
            'logo' => [
                'type' => 'image',
                'label' => esc_html__('Logo', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '==',
                        'value' => 'image',
                    ],
                ],
            ],
            'logo_light' => [
                'type' => 'image',
                'label' => esc_html__('Logo Light', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '==',
                        'value' => 'image',
                    ],
                ],
            ],
            'logo_dimension' => [
                'type' => 'dimensions',
                'label' => esc_html__('Logo Dimension', 'glozin'),
                'default' => [
                    'width' => 'auto',
                    'height' => 'auto',
                ],
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '!=',
                        'value' => 'text',
                    ],
                ],
            ],
        ];

        // Header account.
        $settings['header_account'] = [
            'header_signin_icon_behaviour' => [
                'type' => 'radio',
                'label' => esc_html__('Sign in Icon Behaviour', 'glozin'),
                'default' => 'popup',
                'choices' => [
                    'popup' => esc_html__('Open the account popup', 'glozin'),
                    'page' => esc_html__('Open the account page', 'glozin'),
                ],
            ],
            'header_account_display' => [
                'type' => 'select',
                'label' => esc_html__('Account Display', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => esc_html__('Icon Only', 'glozin'),
                    'icon-text' => esc_html__('Icon & Text', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'header_account_size' => [
                'type' => 'select',
                'label' => esc_html__('Icon Size', 'glozin'),
                'default' => 'medium',
                'choices' => [
                    'medium' => esc_html__('Medium', 'glozin'),
                    'large' => esc_html__('Large', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
        ];

        // Header wishlist.
        $settings['header_wishlist'] = [
            'header_wishlist_size' => [
                'type' => 'select',
                'label' => esc_html__('Icon Size', 'glozin'),
                'default' => 'medium',
                'choices' => [
                    'medium' => esc_html__('Medium', 'glozin'),
                    'large' => esc_html__('Large', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
        ];

        // Header wishlist.
        $settings['header_compare'] = [
            'header_compare_size' => [
                'type' => 'select',
                'label' => esc_html__('Icon Size', 'glozin'),
                'default' => 'medium',
                'choices' => [
                    'medium' => esc_html__('Medium', 'glozin'),
                    'large' => esc_html__('Large', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
        ];

        // Header cart.
        $settings['header_cart'] = [
            'cart_icon_source' => [
                'type' => 'radio',
                'label' => esc_html__('Cart Icon', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => esc_attr__('Built-in Icon', 'glozin'),
                    'svg' => esc_attr__('SVG Code', 'glozin'),
                ],
            ],
            'cart_icon' => [
                'type' => 'radio-image',
                'default' => '',
                'choices' => [
                    '' => get_template_directory_uri().'/assets/svg/shopping-bag.svg',
                    'shopping-bag-2' => get_template_directory_uri().'/assets/svg/shopping-bag-2.svg',
                    'shopping-cart' => get_template_directory_uri().'/assets/svg/shopping-cart.svg',
                    'shopping-cart-2' => get_template_directory_uri().'/assets/svg/shopping-cart-2.svg',
                    'shopping-cart-3' => get_template_directory_uri().'/assets/svg/shopping-cart-3.svg',
                ],
                'active_callback' => [
                    [
                        'setting' => 'cart_icon_source',
                        'operator' => '==',
                        'value' => 'icon',
                    ],
                ],
            ],
            'cart_icon_svg' => [
                'type' => 'textarea',
                'description' => esc_html__('Icon SVG code', 'glozin'),
                'sanitize_callback' => '\Glozin\Icon::sanitize_svg',
                'active_callback' => [
                    [
                        'setting' => 'cart_icon_source',
                        'operator' => '==',
                        'value' => 'svg',
                    ],
                ],
            ],
            'cart_icon_svg_size' => [
                'type' => 'slider',
                'label' => esc_html__('Size', 'glozin'),
                'transport' => 'postMessage',
                'default' => 24,
                'choices' => [
                    'min' => 0,
                    'max' => 50,
                ],
                'output' => [
                    [
                        'element' => '.header-cart__icon .glozin-svg-icon--custom-cart, ul.products li.product .product-loop-button .glozin-svg-icon.glozin-svg-icon--custom-cart',
                        'property' => 'font-size',
                        'units' => 'px',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'cart_icon_source',
                        'operator' => '==',
                        'value' => 'svg',
                    ],
                ],
            ],
            'cart_hr_1' => [
                'type' => 'custom',
                'section' => 'header_cart',
                'default' => '<hr>',
            ],
            'header_cart_display' => [
                'type' => 'select',
                'label' => esc_html__('Display', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => esc_html__('Icon Only', 'glozin'),
                    'icon-text' => esc_html__('Icon & Text', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'header_cart_size' => [
                'type' => 'select',
                'label' => esc_html__('Icon Size', 'glozin'),
                'default' => 'medium',
                'choices' => [
                    'medium' => esc_html__('Medium', 'glozin'),
                    'large' => esc_html__('Large', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'mini_cart_products' => [
                'type' => 'select',
                'label' => esc_html__('Recommended Products', 'glozin'),
                'description' => esc_html__('Display recommended products on the mini cart', 'glozin'),
                'default' => 'recent_products',
                'choices' => [
                    'none' => esc_html__('None', 'glozin'),
                    'best_selling_products' => esc_html__('Best selling products', 'glozin'),
                    'featured_products' => esc_html__('Featured products', 'glozin'),
                    'recent_products' => esc_html__('Recent products', 'glozin'),
                    'sale_products' => esc_html__('Sale products', 'glozin'),
                    'top_rated_products' => esc_html__('Top rated products', 'glozin'),
                    'crosssells_products' => esc_html__('Cross-sells products', 'glozin'),

                ],
            ],
            'mini_cart_products_limit' => [
                'type' => 'number',
                'description' => esc_html__('Number of products', 'glozin'),
                'default' => 4,
            ],
            'mini_cart_products_layout' => [
                'type' => 'select',
                'label' => esc_html__('Recommended Products Layout', 'glozin'),
                'default' => 'sidebar',
                'choices' => [
                    'sidebar' => esc_html__('Sidebar List', 'glozin'),
                    'carousel' => esc_html__('Carousel', 'glozin'),
                ],
            ],
        ];

        // Header search.
        $settings['header_search'] = [
            'header_search_layout' => [
                'type' => 'select',
                'label' => esc_html__('Layout', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => __('Icon', 'glozin'),
                    'form' => __('Form', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'priority' => 5,
            ],
            'header_search_form_width' => [
                'type' => 'slider',
                'label' => esc_html__('Search Field Width', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'choices' => [
                    'min' => 0,
                    'max' => 1000,
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header .header-search__field',
                        'property' => 'width',
                        'units' => 'px',
                    ],
                ],
                'active_callback' => function () {
                    return ! $this->display_header_search_option();
                },
                'priority' => 5,
            ],
            'header_search_type' => [
                'type' => 'select',
                'label' => esc_html__('Type', 'glozin'),
                'default' => 'popup',
                'choices' => [
                    'popup' => __('Popup', 'glozin'),
                    'sidebar' => __('Sidebar', 'glozin'),
                ],
                'priority' => 5,
            ],
            'header_search_hr_1' => [
                'type' => 'custom',
                'default' => '<hr>',
                'priority' => 10,
            ],
            'header_search_trending' => [
                'type' => 'toggle',
                'label' => esc_html__('Trending', 'glozin'),
                'description' => esc_html__('Display a list of links in the search modal', 'glozin'),
                'default' => false,
                'priority' => 15,
            ],
            'header_search_links' => [
                'type' => 'repeater',
                'label' => esc_html__('Links', 'glozin'),
                'description' => esc_html__('Add custom links of the trending searches', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Link', 'glozin'),
                    'field' => 'text',
                ],
                'fields' => [
                    'text' => [
                        'type' => 'text',
                        'label' => esc_html__('Text', 'glozin'),
                    ],
                    'url' => [
                        'type' => 'text',
                        'label' => esc_html__('URL', 'glozin'),
                    ],
                ],
                'priority' => 20,
            ],
            'header_search_hr_5' => [
                'type' => 'custom',
                'default' => '<hr>',
                'priority' => 25,
            ],
            'header_search_products' => [
                'type' => 'toggle',
                'label' => esc_html__('Products', 'glozin'),
                'description' => esc_html__('Display a products list before searching', 'glozin'),
                'default' => false,
                'priority' => 30,
            ],
            'header_search_products_type' => [
                'type' => 'select',
                'label' => esc_html__('Type', 'glozin'),
                'default' => 'recent_products',
                'choices' => [
                    'recent_products' => __('Recent Products', 'glozin'),
                    'featured_products' => __('Featured Products', 'glozin'),
                    'sale_products' => __('Sale Products', 'glozin'),
                    'best_selling_products' => __('Best Selling Products', 'glozin'),
                    'top_rated_products' => __('Top Rated Products', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_search_products',
                        'operator' => '==',
                        'value' => '1',
                    ],
                ],
                'priority' => 35,
            ],
            'header_search_product_limit' => [
                'type' => 'number',
                'label' => esc_html__('Limit', 'glozin'),
                'default' => '10',
                'active_callback' => [
                    [
                        'setting' => 'header_search_products',
                        'operator' => '==',
                        'value' => '1',
                    ],
                ],
                'priority' => 40,
            ],
        ];

        // Product Categories
        $settings['header_product_categories'] = [
            'header_sidebar_categories' => [
                'type' => 'toggle',
                'default' => '',
                'label' => esc_html__('Sidebar Categories', 'glozin'),
                'description' => esc_html__('Enable this option to display the category sidebar on desktop screens.', 'glozin'),
            ],
        ];

        // Custom HTML
        $settings['header_custom_html'] = [
            'header_custom_html' => [
                'type' => 'textarea',
                'label' => esc_html__('Custom HTML', 'glozin'),
                'description' => esc_html__('Paste your HTML here', 'glozin'),
            ],
        ];

        // Hambuger menu
        $settings['header_mobile_menu'] = [
            'header_mobile_menu_els' => [
                'type' => 'multicheck',
                'label' => esc_html__('Mobile Menu Elements', 'glozin'),
                'default' => ['primary-menu', 'custom-menu'],
                'choices' => [
                    'primary-menu' => esc_html__('Primary Menu', 'glozin'),
                    'custom-menu' => esc_html__('Custom Menu', 'glozin'),
                    'category-menu' => esc_html__('Category Menu', 'glozin'),
                    'currency' => esc_html__('Currency', 'glozin'),
                    'language' => esc_html__('Language', 'glozin'),
                ],
                'description' => esc_html__('Select which elements you want to show.', 'glozin'),
            ],
            'header_mobile_menu_primary_menu' => [
                'type' => 'select',
                'label' => esc_html__('Primary Menu', 'glozin'),
                'default' => '',
                'choices' => $this->get_menus(),
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_menu_els',
                        'operator' => 'contains',
                        'value' => 'primary-menu',
                    ],
                ],
            ],
            'header_mobile_menu_custom_menu' => [
                'type' => 'select',
                'label' => esc_html__('Custom Menu', 'glozin'),
                'default' => '',
                'choices' => $this->get_menus(),
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_menu_els',
                        'operator' => 'contains',
                        'value' => 'custom-menu',
                    ],
                ],
            ],
            'header_mobile_menu_category_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_menu_category_menu' => [
                'type' => 'select',
                'label' => esc_html__('Category Menu', 'glozin'),
                'default' => '',
                'choices' => $this->get_menus(),
            ],
            'header_mobile_menu_open_primary_submenus_on_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_menu_open_primary_submenus_on' => [
                'type' => 'select',
                'label' => esc_html__('Open Submenu Items on', 'glozin'),
                'default' => 'all',
                'choices' => [
                    'all' => esc_html__('Title & Icon click', 'glozin'),
                    'icon' => esc_html__('Icon click', 'glozin'),
                ],
            ],
        ];

        $settings['post_card'] = [
            'image_rounded_shape_post_card' => [
                'type' => 'select',
                'label' => esc_html__('Corner Radius', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Default', 'glozin'),
                    'square' => esc_html__('Square', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
            ],
            'image_rounded_number_post_card' => [
                'type' => 'number',
                'label' => esc_html__('Number(px)', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'image_rounded_shape_post_card',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],

        ];

        // Blog Header.
        $settings['blog_header'] = [
            'blog_header' => [
                'type' => 'toggle',
                'default' => true,
                'label' => esc_html__('Enable Blog Header', 'glozin'),
                'description' => esc_html__('Enable to show a blog header for the page below the site header', 'glozin'),
            ],
            'blog_header_hr' => [
                'type' => 'custom',
                'default' => '<hr/>',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'blog_header_els' => [
                'type' => 'multicheck',
                'label' => esc_html__('Elements', 'glozin'),
                'default' => ['breadcrumb', 'title'],
                'choices' => [
                    'breadcrumb' => esc_html__('BreadCrumb', 'glozin'),
                    'title' => esc_html__('Title', 'glozin'),
                    'description' => esc_html__('Description', 'glozin'),
                ],
                'description' => esc_html__('Select which elements you want to show.', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'blog_header_description_lines' => [
                'type' => 'number',
                'label' => esc_html__('Description Number Lines', 'glozin'),
                'default' => 5,
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'blog_header_els',
                        'operator' => 'in',
                        'value' => 'description',
                    ],
                ],
            ],
            'blog_header_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/><h3>'.esc_html__('Custom', 'glozin').'</h3>',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'blog_header_background_image' => [
                'type' => 'image',
                'label' => esc_html__('Background Image', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'blog_header_background_overlay' => [
                'type' => 'color',
                'label' => esc_html__('Background Overlay', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--blog .page-header__image::before',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'blog_header_title_color' => [
                'type' => 'color',
                'label' => esc_html__('Title Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'blog_header_els',
                        'operator' => 'in',
                        'value' => 'title',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--blog .page-header__title',
                        'property' => 'color',
                    ],
                ],
            ],
            'blog_header_breadcrumb_link_color' => [
                'type' => 'color',
                'label' => esc_html__('Breadcrumb Link Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'blog_header_els',
                        'operator' => 'in',
                        'value' => 'breadcrumb',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--blog .site-breadcrumb',
                        'property' => '--gz-site-breadcrumb-link-color',
                    ],
                ],
            ],
            'blog_header_breadcrumb_color' => [
                'type' => 'color',
                'label' => esc_html__('Breadcrumb Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'blog_header_els',
                        'operator' => 'in',
                        'value' => 'breadcrumb',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--blog .site-breadcrumb',
                        'property' => '--gz-site-breadcrumb-color',
                    ],
                ],
            ],
            'blog_header_description_color' => [
                'type' => 'color',
                'label' => esc_html__('Description Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'blog_header_els',
                        'operator' => 'in',
                        'value' => 'description',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--blog .page-header__description',
                        'property' => 'color',
                    ],
                ],
            ],
            'blog_header_padding_top' => [
                'type' => 'slider',
                'label' => esc_html__('Padding Top', 'glozin'),
                'transport' => 'postMessage',
                'default' => [
                    'desktop' => 80,
                    'tablet' => 80,
                    'mobile' => 60,
                ],
                'responsive' => true,
                'choices' => [
                    'min' => 0,
                    'max' => 500,
                ],
                'output' => [
                    [
                        'element' => '.page-header.page-header--blog',
                        'property' => '--gz-page-header-padding-top',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => '1',
                    ],
                ],
            ],
            'blog_header_padding_bottom' => [
                'type' => 'slider',
                'label' => esc_html__('Padding Bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [
                    'desktop' => 10,
                    'tablet' => 10,
                    'mobile' => 10,
                ],
                'responsive' => true,
                'choices' => [
                    'min' => 0,
                    'max' => 500,
                ],
                'output' => [
                    [
                        'element' => '.page-header.page-header--blog',
                        'property' => '--gz-page-header-padding-bottom',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'blog_header',
                        'operator' => '==',
                        'value' => '1',
                    ],
                ],
            ],
        ];

        // Blog.
        $settings['blog_page'] = [
            'blog_layout' => [
                'type' => 'radio',
                'label' => esc_html__('Layout', 'glozin'),
                'default' => 'list',
                'choices' => [
                    'grid' => esc_html__('Grid', 'glozin'),
                    'list' => esc_html__('List', 'glozin'),
                ],
            ],
            'blog_columns' => [
                'type' => 'select',
                'label' => esc_html__('Grid Columns', 'glozin'),
                'default' => '2',
                'choices' => [
                    '2' => esc_html__('2 Columns', 'glozin'),
                    '3' => esc_html__('3 Columns', 'glozin'),
                    '4' => esc_html__('4 Columns', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'blog_layout',
                        'operator' => '==',
                        'value' => 'grid',
                    ],
                ],
            ],
            'blog_sidebar' => [
                'type' => 'radio',
                'label' => esc_html__('Sidebar', 'glozin'),
                'default' => 'sidebar-content',
                'choices' => [
                    'no-sidebar' => esc_html__('No Sidebar', 'glozin'),
                    'sidebar-content' => esc_html__('Left Sidebar', 'glozin'),
                    'content-sidebar' => esc_html__('Right Sidebar', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'blog_columns',
                        'operator' => '!==',
                        'value' => '3',
                    ],
                    [
                        'setting' => 'blog_columns',
                        'operator' => '!==',
                        'value' => '4',
                    ],
                ],
            ],
            'blog_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'blog_pagination' => [
                'type' => 'radio',
                'label' => esc_html__('Pagination Type', 'glozin'),
                'default' => 'numeric',
                'choices' => [
                    'numeric' => esc_attr__('Numeric', 'glozin'),
                    'infinite' => esc_attr__('Infinite Scroll', 'glozin'),
                    'loadmore' => esc_attr__('Load More', 'glozin'),
                ],
            ],
            'blog_pagination_ajax_url_change' => [
                'type' => 'checkbox',
                'label' => esc_html__('Change the URL after page loaded', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'blog_pagination',
                        'operator' => '!=',
                        'value' => 'numeric',
                    ],
                ],
            ],
        ];

        // Blog single.
        $settings['blog_single'] = [
            'single_post_header_els' => [
                'type' => 'multicheck',
                'label' => esc_html__('Post Header Elements', 'glozin'),
                'default' => ['breadcrumb'],
                'choices' => [
                    'breadcrumb' => esc_html__('BreadCrumb', 'glozin'),
                ],
                'description' => esc_html__('Select which elements you want to show.', 'glozin'),
            ],
            'single_post_image_rounded_shape_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'post_featured_image' => [
                'type' => 'toggle',
                'label' => esc_html__('Featured Image', 'glozin'),
                'description' => esc_html__('Enable featured image.', 'glozin'),
                'default' => true,
            ],
            'image_rounded_shape_featured_post' => [
                'type' => 'select',
                'label' => esc_html__('Featured Image Corner Radius', 'glozin'),
                'default' => '',
                'choices' => [
                    '' => esc_html__('Default', 'glozin'),
                    'square' => esc_html__('Square', 'glozin'),
                    'custom' => esc_html__('Custom', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'post_featured_image',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'image_rounded_number_featured_post' => [
                'type' => 'number',
                'label' => esc_html__('Number(px)', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'image_rounded_shape_featured_post',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                    [
                        'setting' => 'post_featured_image',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'single_post_sidebar_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'post_sidebar' => [
                'type' => 'select',
                'label' => esc_html__('Post Sidebar', 'glozin'),
                'description' => esc_html__('The layout of single posts', 'glozin'),
                'default' => 'no-sidebar',
                'choices' => [
                    'no-sidebar' => esc_html__('No Sidebar', 'glozin'),
                    'content-sidebar' => esc_html__('Right Sidebar', 'glozin'),
                    'sidebar-content' => esc_html__('Left Sidebar', 'glozin'),
                ],
            ],
            'post_sharing' => [
                'type' => 'toggle',
                'label' => esc_html__('Post Sharing', 'glozin'),
                'description' => esc_html__('Enable post sharing.', 'glozin'),
                'default' => false,
            ],
            'post_navigation' => [
                'type' => 'toggle',
                'label' => esc_html__('Post Navigation', 'glozin'),
                'description' => esc_html__('Display the next and previous posts', 'glozin'),
                'default' => true,
            ],
            'posts_related_custom' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'posts_related' => [
                'type' => 'toggle',
                'label' => esc_html__('Related Posts', 'glozin'),
                'description' => esc_html__('Display related posts', 'glozin'),
                'default' => true,
            ],
            'posts_related_number' => [
                'type' => 'number',
                'label' => esc_html__('Posts Numbers', 'glozin'),
                'default' => 5,
            ],
            'posts_related_spacing' => [
                'type' => 'number',
                'label' => esc_html__('Posts Spacing', 'glozin'),
                'default' => 30,
            ],
        ];

        // Back To Top.
        $settings['backtotop'] = [
            'backtotop' => [
                'type' => 'toggle',
                'label' => esc_html__('Back To Top', 'glozin'),
                'description' => esc_html__('Check this to show back to top.', 'glozin'),
                'default' => true,
            ],
        ];

        // Share socials
        $settings['share_socials'] = [
            'post_sharing_socials' => [
                'type' => 'sortable',
                'description' => esc_html__('Select social media for sharing posts/products', 'glozin'),
                'default' => [
                    'twitter',
                    'facebook',
                    'pinterest',
                    'instagram',
                ],
                'choices' => [
                    'facebook' => esc_html__('Facebook', 'glozin'),
                    'twitter' => esc_html__('Twitter', 'glozin'),
                    'googleplus' => esc_html__('Google Plus', 'glozin'),
                    'pinterest' => esc_html__('Pinterest', 'glozin'),
                    'tumblr' => esc_html__('Tumblr', 'glozin'),
                    'reddit' => esc_html__('Reddit', 'glozin'),
                    'linkedin' => esc_html__('Linkedin', 'glozin'),
                    'stumbleupon' => esc_html__('StumbleUpon', 'glozin'),
                    'digg' => esc_html__('Digg', 'glozin'),
                    'telegram' => esc_html__('Telegram', 'glozin'),
                    'whatsapp' => esc_html__('WhatsApp', 'glozin'),
                    'vk' => esc_html__('VK', 'glozin'),
                    'email' => esc_html__('Email', 'glozin'),
                    'instagram' => esc_html__('Instagram', 'glozin'),
                ],
            ],
            'post_sharing_whatsapp_number' => [
                'type' => 'text',
                'description' => esc_html__('WhatsApp Phone Number', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'post_sharing_socials',
                        'operator' => 'contains',
                        'value' => 'whatsapp',
                    ],
                ],
            ],
        ];

        // Page Header.
        $settings['page_header'] = [
            'page_header' => [
                'type' => 'toggle',
                'default' => true,
                'label' => esc_html__('Enable Page Header', 'glozin'),
                'description' => esc_html__('Enable to show a page header for the page below the site header', 'glozin'),
            ],
            'page_header_hr' => [
                'type' => 'custom',
                'default' => '<hr/>',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'page_header_els' => [
                'type' => 'multicheck',
                'label' => esc_html__('Elements', 'glozin'),
                'default' => ['title'],
                'choices' => [
                    'title' => esc_html__('Title', 'glozin'),
                    'breadcrumb' => esc_html__('BreadCrumb', 'glozin'),
                    'description' => esc_html__('Description', 'glozin'),
                ],
                'description' => esc_html__('Select which elements you want to show.', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'page_header_description_lines' => [
                'type' => 'number',
                'label' => esc_html__('Description Number Lines', 'glozin'),
                'default' => 5,
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'page_header_els',
                        'operator' => 'in',
                        'value' => 'description',
                    ],
                ],
            ],
            'page_header_hr_1' => [
                'type' => 'custom',
                'default' => '<hr/><h3>'.esc_html__('Custom', 'glozin').'</h3>',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'page_header_background_image' => [
                'type' => 'image',
                'label' => esc_html__('Background Image', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'page_header_background_overlay' => [
                'type' => 'color',
                'label' => esc_html__('Background Overlay', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--page::before',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'page_header_title_color' => [
                'type' => 'color',
                'label' => esc_html__('Title Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'page_header_els',
                        'operator' => 'in',
                        'value' => 'title',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--page .page-header__title',
                        'property' => 'color',
                    ],
                ],
            ],
            'page_header_breadcrumb_link_color' => [
                'type' => 'color',
                'label' => esc_html__('Breadcrumb Link Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'page_header_els',
                        'operator' => 'in',
                        'value' => 'breadcrumb',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--page .site-breadcrumb',
                        'property' => '--gz-site-breadcrumb-link-color',
                    ],
                ],
            ],
            'page_header_breadcrumb_color' => [
                'type' => 'color',
                'label' => esc_html__('Breadcrumb Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'page_header_els',
                        'operator' => 'in',
                        'value' => 'breadcrumb',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--page .site-breadcrumb',
                        'property' => '--gz-site-breadcrumb-color',
                    ],
                ],
            ],
            'page_header_description_color' => [
                'type' => 'color',
                'label' => esc_html__('Description Color', 'glozin'),
                'transport' => 'postMessage',
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'page_header_els',
                        'operator' => 'in',
                        'value' => 'description',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.page-header.page-header--page .page-header__description',
                        'property' => 'color',
                    ],
                ],
            ],
            'page_header_padding_top' => [
                'type' => 'slider',
                'label' => esc_html__('Padding Top', 'glozin'),
                'transport' => 'postMessage',
                'choices' => [
                    'min' => 0,
                    'max' => 500,
                ],
                'default' => [
                    'desktop' => 80,
                    'tablet' => 80,
                    'mobile' => 60,
                ],
                'output' => [
                    [
                        'element' => '.page-header',
                        'property' => '--gz-page-header-padding-top',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                ],
                'responsive' => true,
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => '1',
                    ],
                ],
            ],
            'page_header_padding_bottom' => [
                'type' => 'slider',
                'label' => esc_html__('Padding Bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [
                    'desktop' => 10,
                    'tablet' => 10,
                    'mobile' => 10,
                ],
                'responsive' => true,
                'choices' => [
                    'min' => 0,
                    'max' => 500,
                ],
                'output' => [
                    [
                        'element' => '.page-header',
                        'property' => '--gz-page-header-padding-bottom',
                        'units' => 'px',
                        'media_query' => [
                            'desktop' => '@media (min-width: 1200px)',
                            'tablet' => is_customize_preview() ? '@media (min-width: 699px) and (max-width: 1199px)' : '@media (min-width: 768px) and (max-width: 1199px)',
                            'mobile' => '@media (max-width: 767px)',
                        ],
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'page_header',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
        ];

        $settings['topbar_mobile'] = [
            'mobile_topbar' => [
                'type' => 'toggle',
                'label' => esc_html__('Topbar', 'glozin'),
                'description' => esc_html__('Display topbar on mobile', 'glozin'),
                'default' => false,
            ],
            'mobile_topbar_breakpoint' => [
                'type' => 'slider',
                'label' => esc_html__('Breakpoint (px)', 'glozin'),
                'description' => esc_html__('Set a breakpoint where the mobile navigation bar displays.', 'glozin'),
                'transport' => 'postMessage',
                'default' => '1024',
                'choices' => [
                    'min' => 375,
                    'max' => 1199,
                ],
                'active_callback' => [
                    [
                        'setting' => 'mobile_topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'mobile_topbar_section' => [
                'type' => 'select',
                'label' => esc_html__('Topbar Items', 'glozin'),
                'default' => 'left',
                'choices' => [
                    'left' => esc_html__('Keep left items', 'glozin'),
                    'right' => esc_html__('Keep right items', 'glozin'),
                    'all' => esc_html__('Keep all items', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'mobile_topbar',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
        ];

        // Header Mobile
        $settings['header_mobile_layout'] = [
            'header_mobile_breakpoint' => [
                'type' => 'slider',
                'label' => esc_html__('Breakpoint (px)', 'glozin'),
                'description' => esc_html__('Set a breakpoint where the mobile header displays and the desktop header is hidden.', 'glozin'),
                'transport' => 'postMessage',
                'default' => '1199',
                'choices' => [
                    'min' => 991,
                    'max' => 1199,
                ],
            ],
            'header_mobile_present_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_present' => [
                'type' => 'radio',
                'label' => esc_html__('Present', 'glozin'),
                'description' => esc_html__('Select a prebuilt header or build your own', 'glozin'),
                'default' => 'prebuild',
                'choices' => [
                    'prebuild' => esc_html__('Use pre-build header', 'glozin'),
                    'custom' => esc_html__('Build my own', 'glozin'),
                ],
            ],
            'header_mobile_prebuild_search' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Search', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_mobile_prebuild_account' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Account', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_mobile_prebuild_wishlist' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Wishlist', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_mobile_prebuild_compare' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Compare', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_mobile_prebuild_cart' => [
                'type' => 'toggle',
                'label' => esc_html__('Header Cart', 'glozin'),
                'default' => true,
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'prebuild',
                    ],
                ],
            ],
            'header_mobile_main_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_icon_auto_width' => [
                'type' => 'toggle',
                'label' => esc_html__('Auto Icon Width', 'glozin'),
                'default' => false,
            ],
            'header_mobile_main_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Main Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '64',
                'choices' => [
                    'min' => 30,
                    'max' => 500,
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__mobile .header-mobile-main',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
            ],
            'header_mobile_bottom_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_bottom_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Bottom Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '60',
                'choices' => [
                    'min' => 30,
                    'max' => 500,
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__mobile .header-mobile-bottom',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
        ];

        // Header sticky settings.
        $settings['header_mobile_sticky'] = [
            'header_mobile_sticky' => [
                'type' => 'toggle',
                'label' => esc_html__('Sticky Header', 'glozin'),
                'default' => false,
            ],
            'header_mobile_sticky_el' => [
                'type' => 'select',
                'label' => esc_html__('Sticky Header Section', 'glozin'),
                'default' => 'header_main',
                'choices' => [
                    'header_main' => esc_html__('Header Main', 'glozin'),
                    'header_bottom' => esc_html__('Header Bottom', 'glozin'),
                    'both' => esc_html__('Both', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                ],
            ],
            'header_mobile_sticky_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'header_mobile_sticky_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Main Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '64',
                'choices' => [
                    'min' => 30,
                    'max' => 200,
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'header_mobile_sticky_el',
                        'operator' => '!==',
                        'value' => 'header_bottom',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__mobile.minimized .header-mobile-main, .site-header__mobile.headroom--not-top .header-mobile-main',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                    [
                        'element' => '.site-header__mobile.minimized .header-mobile-sticky + .header-mobile-bottom, .site-header__mobile.headroom--not-top .header-mobile-sticky + .header-mobile-bottom',
                        'property' => 'top',
                        'units' => 'px',
                    ],
                ],
            ],
            'header_mobile_sticky_bottom_height' => [
                'type' => 'slider',
                'label' => esc_html__('Header Bottom Height', 'glozin'),
                'transport' => 'postMessage',
                'default' => '60',
                'choices' => [
                    'min' => 30,
                    'max' => 200,
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_sticky',
                        'operator' => '==',
                        'value' => true,
                    ],
                    [
                        'setting' => 'header_mobile_sticky_el',
                        'operator' => '!==',
                        'value' => 'header_main',
                    ],
                ],
                'js_vars' => [
                    [
                        'element' => '.site-header__mobile.minimized .header-mobile-bottom, .site-header__mobile.headroom--not-top .header-mobile-bottom',
                        'property' => 'height',
                        'units' => 'px',
                    ],
                ],
            ],
        ];

        // Header main settings.
        $settings['header_mobile_main'] = [
            'header_mobile_main_left' => [
                'type' => 'repeater',
                'label' => esc_html__('Left Items', 'glozin'),
                'description' => esc_html__('Control items on the left side of header mobile main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_main_left' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
            'header_mobile_main_center' => [
                'type' => 'repeater',
                'label' => esc_html__('Center Items', 'glozin'),
                'description' => esc_html__('Control items at the center of header mobile main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_main_center' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
            'header_mobile_main_right' => [
                'type' => 'repeater',
                'label' => esc_html__('Right Items', 'glozin'),
                'description' => esc_html__('Control items on the right of header mobile main', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_main_right' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
        ];

        // Header bottom settings.
        $settings['header_mobile_bottom'] = [
            'header_mobile_bottom_left' => [
                'type' => 'repeater',
                'label' => esc_html__('Left Items', 'glozin'),
                'description' => esc_html__('Control items on the left side of header mobile bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_bottom_left' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
            'header_mobile_bottom_center' => [
                'type' => 'repeater',
                'label' => esc_html__('Center Items', 'glozin'),
                'description' => esc_html__('Control items at the center of header mobile bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_bottom_center' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
            'header_mobile_bottom_right' => [
                'type' => 'repeater',
                'label' => esc_html__('Right Items', 'glozin'),
                'description' => esc_html__('Control items on the right of header mobile bottom', 'glozin'),
                'transport' => 'postMessage',
                'default' => [],
                'row_label' => [
                    'type' => 'field',
                    'value' => esc_html__('Item', 'glozin'),
                    'field' => 'item',
                ],
                'fields' => [
                    'item' => [
                        'type' => 'select',
                        'choices' => $this->header_mobile_items_option(),
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
                'partial_refresh' => [
                    'header_mobile_bottom_right' => [
                        'selector' => '#site-header',
                        'render_callback' => [Mobile::instance(), 'render'],
                    ],
                ],
            ],
        ];

        $settings['header_mobile_background'] = [
            'header_mobile_background_heading_1' => [
                'type' => 'custom',
                'default' => '<h2>'.esc_html__('Header Main', 'glozin').'</h2>',
            ],
            'header_mobile_main_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__mobile .header-mobile-main',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'header_mobile_main_text_color' => [
                'type' => 'color',
                'label' => esc_html__('Text Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-main',
                        'property' => '--gz-color-dark',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-main',
                        'property' => '--gz-header-color',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-main',
                        'property' => 'color',
                    ],
                ],
            ],
            'header_mobile_main_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-main',
                        'property' => '--gz-header-mobile-main-border-color',
                    ],
                ],
            ],
            'header_mobile_main_shadow_color' => [
                'type' => 'color',
                'label' => esc_html__('Box Shadow Color', 'glozin'),
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__mobile .header-mobile-main',
                        'property' => '--gz-header-mobile-main-shadow-color',
                    ],
                ],
            ],
            'header_mobile_background_heading_2' => [
                'type' => 'custom',
                'default' => '<hr/><h2>'.esc_html__('Header Bottom', 'glozin').'</h2>',
            ],
            'header_mobile_bottom_background_color' => [
                'type' => 'color',
                'label' => esc_html__('Background Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__mobile .header-mobile-bottom',
                        'property' => 'background-color',
                    ],
                ],
            ],
            'header_mobile_bottom_text_color' => [
                'type' => 'color',
                'label' => esc_html__('Text Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-bottom',
                        'property' => '--gz-color-dark',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-bottom',
                        'property' => '--gz-header-color',
                    ],
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-bottom',
                        'property' => 'color',
                    ],
                ],
            ],
            'header_mobile_bottom_border_color' => [
                'type' => 'color',
                'label' => esc_html__('Border Color', 'glozin'),
                'default' => '',
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .header-mobile-bottom',
                        'property' => '--gz-header-mobile-bottom-border-color',
                    ],
                ],
            ],
            'header_mobile_bottom_shadow_color' => [
                'type' => 'color',
                'label' => esc_html__('Box Shadow Color', 'glozin'),
                'default' => '',
                'choices' => [
                    'alpha' => true,
                ],
                'js_vars' => [
                    [
                        'element' => 'body:not(.header-transparent) .site-header__mobile .header-mobile-bottom',
                        'property' => '--gz-header-mobile-bottom-shadow-color',
                    ],
                ],
            ],
        ];

        // Header mobile menu.
        $settings['header_mobile_elements'] = [
            'mobile_logo_type' => [
                'type' => 'radio',
                'label' => esc_html__('Logo Type', 'glozin'),
                'default' => 'default',
                'choices' => [
                    'default' => esc_html__('Default', 'glozin'),
                    'image' => esc_html__('Image', 'glozin'),
                    'text' => esc_html__('Text', 'glozin'),
                    'svg' => esc_html__('SVG', 'glozin'),
                ],
            ],
            'mobile_logo_text' => [
                'type' => 'text',
                'label' => esc_html__('Logo Text', 'glozin'),
                'default' => 'Glozin',
                'active_callback' => [
                    [
                        'setting' => 'mobile_logo_type',
                        'operator' => '==',
                        'value' => 'text',
                    ],
                ],
            ],
            'mobile_logo_svg' => [
                'type' => 'textarea',
                'label' => esc_html__('Logo SVG', 'glozin'),
                'description' => esc_html__('Paste SVG code of your logo here', 'glozin'),
                'sanitize_callback' => 'Glozin\Icon::sanitize_svg',
                'output' => [
                    [
                        'element' => '.site-header .header-logo',
                    ],
                ],
                'active_callback' => [
                    [
                        'setting' => 'mobile_logo_type',
                        'operator' => '==',
                        'value' => 'svg',
                    ],
                ],
            ],
            'mobile_logo_image' => [
                'type' => 'image',
                'label' => esc_html__('Logo', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'mobile_logo_type',
                        'operator' => '==',
                        'value' => 'image',
                    ],
                ],
            ],
            'mobile_logo_image_light' => [
                'type' => 'image',
                'label' => esc_html__('Logo Light', 'glozin'),
                'default' => '',
                'active_callback' => [
                    [
                        'setting' => 'mobile_logo_type',
                        'operator' => '==',
                        'value' => 'image',
                    ],
                ],
            ],
            'mobile_logo_dimension' => [
                'type' => 'dimensions',
                'label' => esc_html__('Logo Dimension', 'glozin'),
                'default' => [
                    'width' => '',
                    'height' => '',
                ],
                'active_callback' => [
                    [
                        'setting' => 'logo_type',
                        'operator' => '!=',
                        'value' => 'text',
                    ],
                ],
            ],
            'mobile_header_hamburger_menu_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'mobile_header_hamburger_menu_text' => [
                'type' => 'text',
                'label' => esc_html__('Hamburger Menu Text', 'glozin'),
                'default' => '',
            ],
            'mobile_header_account_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'mobile_header_wishlist_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'header_mobile_wishlist_display' => [
                'type' => 'select',
                'label' => esc_html__('Wishlist Display', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => esc_html__('Icon Only', 'glozin'),
                    'icon-text' => esc_html__('Icon & Text', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'mobile_header_compare_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'header_mobile_compare_display' => [
                'type' => 'select',
                'label' => esc_html__('Compare Display', 'glozin'),
                'default' => 'icon',
                'choices' => [
                    'icon' => esc_html__('Icon Only', 'glozin'),
                    'icon-text' => esc_html__('Icon & Text', 'glozin'),
                ],
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'mobile_header_custom_html_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
            'header_mobile_custom_html' => [
                'type' => 'textarea',
                'label' => esc_html__('Custom HTML', 'glozin'),
                'description' => esc_html__('Paste your HTML here', 'glozin'),
                'active_callback' => [
                    [
                        'setting' => 'header_mobile_present',
                        'operator' => '==',
                        'value' => 'custom',
                    ],
                ],
            ],
        ];

        // Mobile Product Catalog
        $settings['mobile_product_catalog'] = [
            'mobile_product_catalog_heading_1' => [
                'type' => 'custom',
                'default' => '<h2>'.esc_html__('Product Grid', 'glozin').'</h2>',
            ],
            'mobile_product_columns' => [
                'label' => esc_html__('Product Columns', 'glozin'),
                'type' => 'select',
                'default' => '2',
                'choices' => [
                    '1' => esc_html__('1 Column', 'glozin'),
                    '2' => esc_html__('2 Columns', 'glozin'),
                ],
            ],
        ];

        // Mobile Product Card
        $settings['mobile_product_card'] = [
            'mobile_product_card_featured_icons' => [
                'type' => 'toggle',
                'label' => esc_html__('Always Show Featured Icons', 'glozin'),
                'default' => true,
            ],
            'mobile_product_card_atc' => [
                'type' => 'toggle',
                'label' => esc_html__('Show Add To Cart Button', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'product_card_layout',
                        'operator' => '!==',
                        'value' => '2',
                    ],
                ],
            ],
            'mobile_product_card_wishlist' => [
                'type' => 'toggle',
                'label' => esc_html__('Wishlist button', 'glozin'),
                'default' => true,
            ],
            'mobile_product_card_compare' => [
                'type' => 'toggle',
                'label' => esc_html__('Compare button', 'glozin'),
                'default' => false,
            ],
            'mobile_product_card_quick_view' => [
                'type' => 'toggle',
                'label' => esc_html__('Quick View button', 'glozin'),
                'default' => false,
            ],
        ];

        // Mobile Single Product
        $settings['mobile_single_product'] = [
            'mobile_single_product_gallery_arrows' => [
                'type' => 'toggle',
                'label' => esc_html__('Show Gallery Arrows', 'glozin'),
                'default' => false,
                'active_callback' => [
                    [
                        'setting' => 'product_gallery_layout',
                        'operator' => 'in',
                        'value' => ['', 'bottom-thumbnails', 'hidden-thumbnails'],
                    ],
                ],
            ],
            'mobile_single_product_slides_per_view_auto_hr' => [
                'type' => 'custom',
                'default' => '<hr>',
            ],
            'mobile_single_product_slides_per_view_auto' => [
                'type' => 'multicheck',
                'label' => esc_html__('Slides Per View Auto', 'glozin'),
                'default' => [],
                'choices' => [
                    'related' => esc_html__('Related', 'glozin'),
                    'upsells' => esc_html__('Upsells', 'glozin'),
                    'recently_viewed' => esc_html__('Recently Viewed', 'glozin'),
                ],
            ],
        ];

        return [
            'theme' => 'glozin',
            'panels' => apply_filters('glozin_customize_panels', $panels),
            'sections' => apply_filters('glozin_customize_sections', $sections),
            'settings' => apply_filters('glozin_customize_settings', $settings),
        ];

    }

    /**
     * Get nav menus
     *
     * @since 1.0.0
     *
     * @return array
     */
    public static function get_menus()
    {
        if (! is_admin()) {
            return [];
        }

        $menus = wp_get_nav_menus();
        if (! $menus) {
            return [];
        }

        $output = [
            0 => esc_html__('Select Menu', 'glozin'),
        ];
        foreach ($menus as $menu) {
            $output[$menu->slug] = $menu->name;
        }

        return $output;
    }

    /**
     * Get the list of fonts for Kirki
     *
     * @return array
     */
    public static function customizer_fonts_choices()
    {
        if (get_theme_mod('typo_font_family', true)) {
            $args_fonts = [
                'families' => [
                    ['id' => 'Instrument Sans', 'text' => 'Instrument Sans'],
                ],
                'variants' => [
                    'Instrument Sans' => ['regular', '500', '600', '700', '800'],
                ],
            ];
        } else {
            $args_fonts = [];
        }

        // Compatible custom fonts plugin
        if (defined('BSF_CUSTOM_FONTS_POST_TYPE')) {
            $args = [
                'post_type' => BSF_CUSTOM_FONTS_POST_TYPE,
                'post_status' => 'publish',
                'fields' => 'ids',
                'no_found_rows' => true,
                'posts_per_page' => '-1',
            ];

            $query = new \WP_Query($args);
            $bsf_fonts = $query->posts;

            if (! empty($bsf_fonts)) {
                foreach ($bsf_fonts as $key => $post_id) {
                    $bsf_font_data = get_post_meta($post_id, 'fonts-data', true);
                    $variants = [];
                    foreach ($bsf_font_data['variations'] as $variations) {
                        $variants[] = $variations['font_weight'] == '400' ? 'regular' : $variations['font_weight'];
                    }

                    $args_fonts['families'][] = [
                        'id' => $bsf_font_data['font_name'],
                        'text' => $bsf_font_data['font_name'],
                    ];

                    $args_fonts['variants'][$bsf_font_data['font_name']] = $variants;
                }
            }

            wp_reset_postdata();
        }

        $custom_fonts = apply_filters('glozin_custom_fonts_options', $args_fonts);

        $fonts = [
            'standard' => ['serif', 'sans-serif', 'monospace'],
            'google' => [],
        ];

        if (! empty($custom_fonts) && ! empty($custom_fonts['families'])) {
            $fonts['families'] = [
                'custom' => [
                    'text' => esc_html__('Glozin Custom Fonts', 'glozin'),
                    'children' => $custom_fonts['families'],
                ],
            ];

            if (! empty($custom_fonts['variants'])) {
                $fonts['variants'] = $custom_fonts['variants'];
            }
        }

        return apply_filters('glozin_customize_fonts_choices', [
            'fonts' => $fonts,
        ]);
    }

    /**
     * Display header search
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function display_header_search_option()
    {
        if (get_theme_mod('header_present') == 'custom') {
            if (get_theme_mod('header_search_layout') == 'icon') {
                return true;
            }

            return false;
        }

        return true;
    }
}
