<?php
/**
 * Header Main functions and definitions.
 */

namespace Glozin\Header;

use Glozin\Helper;
use Glozin\Icon;
use Glozin\Options;
use Glozin\Theme;
use Glozin\WooCommerce\Currency;
use Glozin\WooCommerce\Language;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Header mobile initial
 */
class Mobile
{
    /**
     * Instance
     */
    protected static $instance = null;

    /**
     * header layout
     */
    protected static $header_layout = null;

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
    public function __construct() {}

    /**
     * Get the header.
     *
     * @return string
     */
    public function render()
    {
        $layout = self::get_layout();

        if ($layout != 'custom') {
            $this->prebuild($layout);
        } else {
            $options = [];

            // Header main.
            $sections = [
                'left' => Helper::get_option('header_mobile_main_left'),
                'center' => Helper::get_option('header_mobile_main_center'),
                'right' => Helper::get_option('header_mobile_main_right'),
            ];

            $classes = ['header-mobile-main', 'header-mobile-contents', 'position-relative'];

            if (Helper::get_option('header_mobile_sticky') && Helper::get_option('header_mobile_sticky_el') === 'header_main') {
                $classes[] = 'header-mobile-sticky';
            }

            $this->contents($sections, $options, ['class' => $classes]);

            // Header bottom.
            $sections = [
                'left' => Helper::get_option('header_mobile_bottom_left'),
                'center' => Helper::get_option('header_mobile_bottom_center'),
                'right' => Helper::get_option('header_mobile_bottom_right'),
            ];

            if (Helper::get_option('header_mobile_sticky') && Helper::get_option('header_mobile_sticky_el') === 'header_bottom') {
                $classes[] = 'header-mobile-sticky';
            }

            $classes = ['header-mobile-bottom', 'header-mobile-contents', 'position-relative'];

            $this->contents($sections, $options, ['class' => $classes]);
        }
    }

    /**
     * Get the header layout.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public static function get_layout()
    {
        if (isset(self::$header_layout)) {
            return self::$header_layout;
        }

        $present = Helper::get_option('header_mobile_present');

        if ($present) {
            self::$header_layout = $present == 'prebuild' ? 'v1' : 'custom';
        } else {
            self::$header_layout = 'v1';
        }

        self::$header_layout = apply_filters('glozin_get_header_mobile_layout', self::$header_layout);

        return self::$header_layout;
    }

    /**
     * Display pre-build header
     *
     * @param  string  $version
     */
    public function prebuild($version = 'v1')
    {
        $sections = $this->get_prebuild($version);

        $classes = ['header-mobile-main', 'header-mobile-contents', 'position-relative'];

        if (Helper::get_option('header_mobile_sticky') && Helper::get_option('header_mobile_sticky_el') === 'header_main') {
            $classes[] = 'header-mobile-sticky';
        }

        $this->contents($sections['main'], $sections['main_options'], ['class' => $classes]);

        $classes = ['header-mobile-bottom', 'header-mobile-contents', 'position-relative'];

        if (Helper::get_option('header_mobile_sticky') && Helper::get_option('header_mobile_sticky_el') === 'header_bottom') {
            $classes[] = 'header-mobile-sticky';
        }

        $this->contents($sections['bottom'], $sections['bottom_options'], ['class' => $classes]);
    }

    /**
     * Display pre-build header
     *
     * @param  string  $version
     */
    public function get_prebuild($version = 'v1')
    {
        switch ($version) {
            case 'v1':
                $main_sections = [
                    'left' => [
                        ['item' => 'hamburger'],
                    ],
                    'center' => [
                        ['item' => 'logo'],
                    ],
                    'right' => $this->get_header_items(['search', 'account', 'wishlist', 'compare', 'cart']),
                ];

                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                    ],
                    'compare' => [
                        'compare_display' => 'icon',
                    ],
                    'wishlist' => [
                        'wishlist_display' => 'icon',
                    ],
                ];
                $bottom_sections = [];
                $bottom_options = [];
                break;
            case 'v2':
                $main_sections = [
                    'left' => [
                        ['item' => 'hamburger'],
                    ],
                    'center' => [
                        ['item' => 'logo'],
                    ],
                    'right' => $this->get_header_items(['search', 'account', 'wishlist', 'compare', 'cart']),
                ];

                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                    ],
                    'compare' => [
                        'compare_display' => 'icon',
                    ],
                    'wishlist' => [
                        'wishlist_display' => 'icon',
                    ],
                ];

                $bottom_sections = [
                    'left' => [],
                    'center' => [
                        ['item' => 'secondary-menu'],
                    ],
                    'right' => [],
                ];
                $bottom_options = [];
                break;
            default:
                $main_sections = [];
                $main_options = [];
                $bottom_sections = [];
                $bottom_options = [];
                break;
        }

        return apply_filters('glozin_prebuild_header_mobile', ['main' => $main_sections, 'main_options' => $main_options, 'bottom' => $bottom_sections, 'bottom_options' => $bottom_options], $version);
    }

    /**
     * Display header attributes
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function get_header_items($atts = ['search'])
    {
        $items = [];
        foreach ($atts as $item) {
            if ($item === 'logo') {
                $items[] = ['item' => 'logo'];
            }
            $key = str_replace('-', '_', $item);
            if (Helper::get_option('header_mobile_prebuild_'.$key)) {
                $items[] = ['item' => $item];
            }
        }

        return $items;
    }

    /**
     * Display header items
     *
     * @since 1.0.0
     *
     * @param  string  $sections,  $atts
     */
    public function contents($sections, $options, $atts = [])
    {
        if (array_filter($sections) == false) {
            return;
        }

        $classes = [];
        if (isset($atts['class'])) {
            $classes = (array) $atts['class'];
            unset($atts['class']);
        }

        if (empty($sections['left']) && empty($sections['right'])) {
            unset($sections['left']);
            unset($sections['right']);
        }

        if (! empty($sections['center'])) {
            $classes[] = 'has-center';

            if (empty($sections['left']) && empty($sections['right'])) {
                $classes[] = 'no-sides';
            }
        } else {
            $classes[] = 'no-center';
            unset($sections['center']);

            if (empty($sections['left'])) {
                unset($sections['left']);
            }

            if (empty($sections['right'])) {
                unset($sections['right']);
            }
        }

        $attr = 'class="'.esc_attr(implode(' ', $classes)).'"';

        foreach ($atts as $name => $value) {
            $attr .= ' '.$name.'="'.esc_attr($value).'"';
        }
        ?>
		<div <?php echo ! empty($attr) ? $attr : ''; ?>>
			<div class="site-header__container container d-flex align-items-center gap-10 h-100">
				<?php foreach ($sections as $section => $items) { ?>
					<?php
                    $class = [];
				    $item_names = wp_list_pluck($items, 'item');

				    if ($section == 'left') {
				        $class[] = 'justify-content-start text-left gap-15';
				    } elseif ($section == 'right') {
				        $class[] = 'justify-content-end text-right gap-5';
				    } else {
				        $class[] = 'justify-content-center text-center gap-15';
				    }

				    if (in_array('primary-menu', $item_names)) {
				        $class[] = 'has-menu';
				    }

				    if (Helper::get_option('header_mobile_icon_auto_width')) {
				        $class[] = 'header-mobile-icon-auto-width';
				    }
				    ?>

					<div class="header-<?php echo esc_attr($section); ?>-items header-items d-flex align-items-center flex-1 h-100 <?php echo esc_attr(implode(' ', $class)); ?>">
						<?php $this->items($items, $options); ?>
					</div>

				<?php } ?>
			</div>
		</div>
		<?php
    }

    /**
     * Display header items
     *
     * @since 1.0.0
     *
     * @param  array  $items
     * @param  array  $options
     */
    public function items($items, $options)
    {
        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            $item['item'] = $item['item'] ? $item['item'] : key(Options::header_mobile_items_option());
            $template_file = $item['item'];
            $args = [];
            $load_file = true;

            switch ($item['item']) {
                case 'logo':
                    $args = $this->logo_options($options);
                    break;
                case 'hamburger':
                    Theme::set_prop('panels', 'hamburger');
                    break;
                case 'search':
                    $template_file = 'search-icon';
                    Theme::set_prop('modals', 'search');
                    break;
                case 'cart':
                    Theme::set_prop('panels', 'cart');
                    Theme::set_prop('modals', 'quick-edit');
                    break;
                case 'account':
                    $args = Main::account_options($options);
                    if (function_exists('is_account_page') && is_account_page()) {
                        break;
                    }
                    if (! is_user_logged_in()) {
                        Theme::set_prop('modals', 'login');
                    } else {
                        Theme::set_prop('panels', 'account');
                    }
                    break;
                case 'compare':
                    if (! class_exists('\WCBoost\ProductsCompare\Frontend')) {
                        break;
                    }
                    if (empty($options) || empty($options['compare'])) {
                        $options['compare'] = [
                            'compare_display' => Helper::get_option('header_mobile_compare_display'),
                        ];
                    }
                    $args = Main::compare_options($options);
                    break;

                case 'wishlist':
                    if (! class_exists('\WCBoost\Wishlist\Helper')) {
                        break;
                    }
                    if (empty($options) || empty($options['wishlist'])) {
                        $options['wishlist'] = [
                            'wishlist_display' => Helper::get_option('header_mobile_wishlist_display'),
                        ];
                    }
                    $args = Main::wishlist_options($options);
                    break;
                case 'custom-html':
                    $header_custom_html = Helper::get_option('header_mobile_custom_html');
                    if (empty($header_custom_html)) {
                        break;
                    }
                    echo '<div class="header-mobile-custom-html">';
                    echo do_shortcode(wp_kses_post($header_custom_html));
                    echo '</div>';
                    $load_file = false;
                    break;
            }

            if ($template_file && ! empty($load_file)) {
                get_template_part('template-parts/header/'.$template_file, '', $args);
            }
        }
    }

    /**
     * Logo options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public function logo_options($options)
    {
        $options = isset($options['logo']) ? $options['logo'] : '';
        $args = [];
        $mobile_type = Helper::get_option('mobile_logo_type');
        $mobile_type = $mobile_type != 'default' ? $mobile_type : Helper::get_option('logo_type');
        $args['type'] = ! empty($options) && isset($options['type']) ? $options['type'] : $mobile_type;
        $args['type'] = apply_filters('glozin_header_logo_type', $args['type']);
        $args['title'] = false;
        $args['logo_light'] = ! empty($options) && isset($options['logo_light']) ? $options['logo_light'] : Helper::get_option('mobile_logo_image_light');
        $mobile_logo = '';
        switch ($args['type']) {
            case 'text':
                $mobile_logo = Helper::get_option('mobile_logo_text');
                break;
            case 'image':
                $mobile_logo = Helper::get_option('mobile_logo_image');
                break;
            case 'svg':
                $mobile_logo = Helper::get_option('mobile_logo_svg');
                break;
            default:
                break;
        }

        if (! empty($mobile_logo)) {
            $args['logo'] = $mobile_logo;
        }

        $args['classes'] = ! empty($options) && isset($options['classes']) ? $options['classes'] : 'flex-grow-1 flex-shrink-0';

        return $args;
    }

    /**
     * Custom template tags of header
     *
     *
     * @since 1.0.0
     *
     * @param  $items
     */
    public static function mobile_menu_items()
    {
        $items = (array) Helper::get_option('header_mobile_menu_els');

        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            if (empty($item)) {
                continue;
            }

            switch ($item) {
                case 'primary-menu':
                    if (! empty(Helper::get_option('header_mobile_menu_primary_menu'))) {
                        self::menu_content(Helper::get_option('header_mobile_menu_primary_menu'));
                    } else {
                        $args = [
                            'theme_location' => 'primary-menu',
                            'container_class' => ' hambuger-navigation',
                        ];

                        get_template_part('template-parts/header/primary-menu', '', $args);
                    }

                    break;

                case 'custom-menu':
                    if (! empty(Helper::get_option('header_mobile_menu_custom_menu'))) {
                        self::menu_content(Helper::get_option('header_mobile_menu_custom_menu'), 'mobile-custom-menu');
                    }
                    break;

                default:
                    do_action('glozin_mobile_menu_items', $item);
                    break;
            }
        }
    }

    /**
     * Custom template tags of header
     *
     *
     * @since 1.0.0
     *
     * @param  $items
     */
    public static function mobile_menu_items_footer()
    {
        $items = (array) Helper::get_option('header_mobile_menu_els');

        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            if (empty($item)) {
                continue;
            }

            switch ($item) {
                case 'currency':
                    echo '<div class="glozin-currency-language glozin-currency-language-mobile-menu">';
                    echo '<div class="popover__backdrop"></div>';
                    echo Icon::get_svg('close', 'ui', ['class' => 'gz-button gz-button-icon gz-button-light popover__button-close']);
                    Currency::currency_switcher();
                    echo '</div>';
                    break;

                case 'language':
                    echo '<div class="glozin-currency-language glozin-currency-language-mobile-menu">';
                    echo '<div class="popover__backdrop"></div>';
                    echo Icon::get_svg('close', 'ui', ['class' => 'gz-button gz-button-icon gz-button-light popover__button-close']);
                    Language::language_switcher();
                    echo '</div>';
                    break;

                default:
                    do_action('glozin_mobile_menu_items_footer', $item);
                    break;
            }
        }
    }

    /**
     * Category menu items
     *
     *
     * @since 1.0.0
     *
     * @param  $items
     */
    public static function mobile_category_menu_items()
    {
        if (in_array('category-menu', (array) Helper::get_option('header_mobile_menu_els')) && ! empty(Helper::get_option('header_mobile_menu_category_menu'))) {
            self::menu_content(Helper::get_option('header_mobile_menu_category_menu'));
        }

    }

    /**
     * Menu content
     *
     *
     * @since 1.0.0
     */
    public static function menu_content($item_menu, $class = '')
    {
        if ($item_menu) {
            wp_nav_menu(apply_filters('glozin_navigation_mobile_menu_content', [
                'theme_location' => '__no_such_location',
                'menu' => $item_menu,
                'container' => 'nav',
                'container_class' => 'mobile-menu '.$class,
                'menu_class' => 'menu',
            ], $item_menu));
        }

    }
}
