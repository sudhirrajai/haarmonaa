<?php
/**
 * Header Main functions and definitions.
 */

namespace Glozin\Header;

use Glozin\Helper;
use Glozin\Options;
use Glozin\Theme;
use WCBoost\ProductsCompare\Plugin;

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Header Main initial
 */
class Main
{
    /**
     * Instance
     */
    protected static $instance = null;

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
     * @since 1.0.0
     *
     * @return void
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
                'left' => Helper::get_option('header_main_left'),
                'center' => Helper::get_option('header_main_center'),
                'right' => Helper::get_option('header_main_right'),
            ];

            $classes = $this->header_classes('main', ['header-main', 'header-contents', 'position-relative']);

            if (Helper::get_option('header_sticky') && Helper::get_option('header_sticky_el') === 'header_main') {
                $classes .= ' header-sticky';
            }

            $this->contents($sections, $options, ['class' => $classes]);

            // Header bottom.
            $sections = [
                'left' => Helper::get_option('header_bottom_left'),
                'center' => Helper::get_option('header_bottom_center'),
                'right' => Helper::get_option('header_bottom_right'),
            ];

            $classes = $this->header_classes('bottom', ['header-bottom', 'header-contents', 'position-relative']);

            if (Helper::get_option('header_sticky') && Helper::get_option('header_sticky_el') === 'header_bottom') {
                $classes .= ' header-sticky';
            }

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

        $present = Helper::get_option('header_present');
        if ($present) {
            self::$header_layout = $present == 'prebuild' ? Helper::get_option('header_version') : 'custom';
        } else {
            self::$header_layout = 'v1';
        }

        self::$header_layout = apply_filters('glozin_get_header_layout', self::$header_layout);

        return self::$header_layout;
    }

    /**
     * Display pre-build header
     *
     * @since 1.0.0
     *
     * @param  string  $version
     */
    public function prebuild($version = 'v1')
    {
        $sections = $this->get_prebuild($version);

        $classes = $this->header_classes('main', ['header-main', 'header-contents', 'position-relative']);

        if (Helper::get_option('header_sticky') && Helper::get_option('header_sticky_el') === 'header_main') {
            $classes .= ' header-sticky';
        }

        $this->contents($sections['main'], $sections['main_options'], ['class' => $classes]);

        $classes = $this->header_classes('bottom', ['header-bottom', 'header-contents', 'position-relative']);

        if (Helper::get_option('header_sticky') && Helper::get_option('header_sticky_el') === 'header_bottom') {
            $classes .= ' header-sticky';
        }

        $this->contents($sections['bottom'], $sections['bottom_options'], ['class' => $classes]);
    }

    /**
     * Display pre-build header
     *
     * @since 1.0.0
     *
     * @param  string  $version
     */
    public function get_prebuild($version = 'v1')
    {
        switch ($version) {
            case 'v1':
                $main_sections = [
                    'left' => [
                        ['item' => 'logo'],
                    ],
                    'center' => [
                        ['item' => 'primary-menu'],
                    ],
                    'right' => $this->get_header_items(['search', 'account', 'compare', 'wishlist', 'cart']),
                ];
                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                        'account_size' => 'medium',
                    ],
                    'compare' => [
                        'compare_size' => 'medium',
                    ],
                    'wishlist' => [
                        'wishlist_size' => 'medium',
                    ],
                    'cart' => [
                        'cart_display' => 'icon',
                        'cart_size' => 'medium',
                    ],
                ];
                $bottom_sections = [];
                $bottom_options = [];
                break;
            case 'v2':
                $main_sections = [
                    'left' => [
                        ['item' => 'logo'],
                    ],
                    'center' => [
                        ['item' => 'primary-menu'],
                    ],
                    'right' => $this->get_header_items(['search', 'account', 'compare', 'wishlist', 'cart']),
                ];
                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                        'account_size' => 'medium',
                    ],
                    'compare' => [
                        'compare_size' => 'medium',
                    ],
                    'wishlist' => [
                        'wishlist_size' => 'medium',
                    ],
                    'cart' => [
                        'cart_display' => 'icon',
                        'cart_size' => 'medium',
                    ],
                ];
                $bottom_sections = [];
                $bottom_options = [];
                break;

            case 'v3':
                $main_sections = [
                    'left' => [
                        ['item' => 'custom-html'],
                    ],
                    'center' => [
                        ['item' => 'logo'],
                    ],
                    'right' => $this->get_header_items(['currency', 'search', 'account', 'compare', 'wishlist', 'cart']),
                ];
                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                        'account_size' => 'medium',
                    ],
                    'compare' => [
                        'compare_size' => 'medium',
                    ],
                    'wishlist' => [
                        'wishlist_size' => 'medium',
                    ],
                    'cart' => [
                        'cart_display' => 'icon',
                        'cart_size' => 'medium',
                    ],
                ];
                $bottom_sections = [
                    'left' => [],
                    'center' => [
                        ['item' => 'primary-menu'],
                    ],
                    'right' => [],
                ];
                $bottom_options = [];
                break;
            case 'v4':
                $main_sections = [
                    'left' => [
                        ['item' => 'logo'],
                    ],
                    'center' => [
                        ['item' => 'search'],
                    ],
                    'right' => $this->get_header_items(['account', 'wishlist', 'cart']),
                ];
                $main_options = [
                    'account' => [
                        'account_display' => 'icon-text',
                        'account_size' => 'large',
                    ],
                    'wishlist' => [
                        'wishlist_size' => 'large',
                    ],
                    'cart' => [
                        'cart_display' => 'icon-text',
                        'cart_size' => 'large',
                    ],
                ];
                $bottom_sections = [
                    'left' => [
                        ['item' => 'primary-menu'],
                    ],
                    'center' => [],
                    'right' => [
                        ['item' => 'secondary-menu'],
                    ],
                ];
                $bottom_options = [];
                break;
            case 'v5':
                $main_sections = [
                    'left' => [
                        ['item' => 'logo'],
                        ['item' => 'primary-menu'],
                    ],
                    'center' => [],
                    'right' => $this->get_header_items(['search', 'account', 'compare', 'wishlist', 'cart']),
                ];
                $main_options = [
                    'account' => [
                        'account_display' => 'icon',
                        'account_size' => 'medium',
                    ],
                    'compare' => [
                        'compare_size' => 'medium',
                    ],
                    'wishlist' => [
                        'wishlist_size' => 'medium',
                    ],
                    'cart' => [
                        'cart_display' => 'icon',
                        'cart_size' => 'medium',
                    ],
                ];
                $bottom_sections = [];
                $bottom_options = [];
                break;
            default:
                $main_sections = [];
                $main_options = [];
                $bottom_sections = [];
                $bottom_options = [];
                break;
        }

        return apply_filters('glozin_prebuild_header', ['main' => $main_sections, 'main_options' => $main_options, 'bottom' => $bottom_sections, 'bottom_options' => $bottom_options], $version);
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
            if (Helper::get_option('header_prebuild_'.$key)) {
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
			<div class="site-header__container d-flex align-items-center gap-10 h-100 <?php echo esc_attr(apply_filters('glozin_header_container_classes', 'container-xxl')) ?>">
				<?php foreach ($sections as $section => $items) { ?>
					<?php
                    $class = [];
				    $item_names = wp_list_pluck($items, 'item');

				    if ($section == 'left') {
				        $class[] = 'justify-content-start text-left gap-30';
				    } elseif ($section == 'right') {
				        $class[] = 'justify-content-end text-right gap-5';
				    } else {
				        $class[] = 'justify-content-center gap-30';
				    }

				    if (in_array('primary-menu', $item_names)) {
				        $class[] = 'has-menu';
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
            $item['item'] = $item['item'] ? $item['item'] : key(Options::header_items_option());
            $template_file = $item['item'];
            $args = [];
            $load_file = true;

            switch ($item['item']) {
                case 'logo':
                    $args = $this->logo_options($options);
                    break;
                case 'primary-menu':
                    $args = $this->primary_menu_options($options);
                    break;
                case 'search':
                    $args = $this->search_options();
                    $template_file = 'search-'.$args['search_layout'];

                    Theme::set_prop('modals', 'search');
                    break;
                case 'cart':
                    $args = $this->cart_options($options);

                    Theme::set_prop('panels', 'cart');
                    Theme::set_prop('modals', 'quick-edit');
                    break;
                case 'account':
                    $args = $this->account_options($options);

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

                    $args = $this->compare_options($options);
                    break;

                case 'wishlist':
                    if (! class_exists('\WCBoost\Wishlist\Helper')) {
                        break;
                    }

                    $args = $this->wishlist_options($options);
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
        $args = [];
        $args['title'] = ! empty($options) && isset($options['logo_title']) ? $options['logo_title'] : true;
        $options = isset($options['logo']) ? $options['logo'] : '';
        $args['type'] = ! empty($options) && isset($options['type']) ? $options['type'] : Helper::get_option('logo_type');
        $args['type'] = apply_filters('glozin_header_logo_type', $args['type']);
        $args['logo_light'] = ! empty($options) && isset($options['logo_light']) ? $options['logo_light'] : '';
        $args['classes'] = ! empty($options) && isset($options['classes']) ? $options['classes'] : 'flex-grow-0 flex-shrink-1';

        return $args;
    }

    /**
     * Primary Menu options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public function primary_menu_options($options)
    {
        $options = isset($options['primary_menu']) ? $options['primary_menu'] : '';
        $args = [];

        $args['menu_class'] = ! empty($options) && isset($options['menu_class']) ? $options['menu_class'] : true;

        $args['container_class'] = ' primary-navigation';

        return $args;
    }

    /**
     * Search options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public static function search_options()
    {
        $args = [];

        $header_layout = self::get_layout();

        switch ($header_layout) {
            case 'v1':
                $args['search_layout'] = 'form';
                break;
            case 'v2':
                $args['search_layout'] = 'icon';
                break;
            case 'v3':
                $args['search_layout'] = 'icon';
                break;
            case 'v4':
                $args['search_layout'] = 'form';
                break;
            case 'v5':
                $args['search_layout'] = 'form';
                break;
            default:
                $args['search_layout'] = Helper::get_option('header_search_layout');
                break;
        }

        $args['search_type'] = Helper::get_option('header_search_type');

        return $args;
    }

    /**
     * Account options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public static function cart_options($options)
    {
        $options = isset($options['cart']) ? $options['cart'] : '';
        $args = [];

        $args['cart_display'] = ! empty($options) && isset($options['cart_display']) ? $options['cart_display'] : Helper::get_option('header_cart_display');
        $args['cart_size'] = ! empty($options) && isset($options['cart_size']) ? $options['cart_size'] : Helper::get_option('header_cart_size');

        $args['cart_classes'] = '';

        if ($args['cart_size'] == 'large') {
            $args['cart_classes'] .= ' header__size-large header-cart__size-large';
        }

        if ($args['cart_display'] == 'icon-text') {
            $args['cart_text_class'] = 'fs-11';
        }

        return $args;
    }

    /**
     * Account options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public static function account_options($options)
    {
        $options = isset($options['account']) ? $options['account'] : '';
        $args = [];

        $args['account_display'] = ! empty($options) && isset($options['account_display']) ? $options['account_display'] : Helper::get_option('header_account_display');
        $args['account_size'] = ! empty($options) && isset($options['account_size']) ? $options['account_size'] : Helper::get_option('header_account_size');
        $args['account_login_text'] = '';

        $args['data_toggle'] = is_user_logged_in() ? 'off-canvas' : 'modal';
        $args['data_target'] = is_user_logged_in() ? 'account-panel' : 'login-modal';
        $args['account_text'] = is_user_logged_in() ? esc_html__('Account', 'glozin') : esc_html__('Login', 'glozin');
        $args['account_classes'] = ' header-account__icon';
        $args['account_text_class'] = 'screen-reader-text';

        if ($args['account_size'] == 'large') {
            $args['account_classes'] .= ' header-account__size-large';
        }

        if ($args['account_display'] == 'icon-text') {
            $args['account_text_class'] = 'fw-semibold';
        } else {
            $args['account_classes'] .= ' gz-button-icon';
        }

        return $args;
    }

    /**
     * Compare options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public static function compare_options($options)
    {
        $options = isset($options['compare']) ? $options['compare'] : '';
        $args = [];

        $args['compare_size'] = ! empty($options) && isset($options['compare_size']) ? $options['compare_size'] : Helper::get_option('header_compare_size');
        $args['compare_count'] = Plugin::instance()->list->count_items();

        $args['compare_classes'] = '';
        $args['compare_text_class'] = 'screen-reader-text';
        $args['compare_counter_class'] = 'header-counter header-compare__counter';

        if ($args['compare_size'] == 'large') {
            $args['compare_classes'] .= ' header__size-large header-compare__size-large';
        }

        if ($args['compare_count'] == 0) {
            $args['compare_counter_class'] .= ' empty-counter';
        }

        return $args;
    }

    /**
     * Wishlist options
     *
     * @since 1.0.0
     *
     * @param  array  $options
     * @return array $args
     */
    public static function wishlist_options($options)
    {
        $options = isset($options['wishlist']) ? $options['wishlist'] : '';
        $args = [];

        $args['wishlist_size'] = ! empty($options) && isset($options['wishlist_size']) ? $options['wishlist_size'] : Helper::get_option('header_wishlist_size');
        $args['wishlist_count'] = \WCBoost\Wishlist\Helper::get_wishlist()->count_items();

        $args['wishlist_classes'] = '';
        $args['wishlist_text_class'] = 'screen-reader-text';
        $args['wishlist_counter_class'] = 'header-counter header-wishlist__counter';

        if ($args['wishlist_size'] == 'large') {
            $args['wishlist_classes'] .= ' header__size-large header-wishlist__size-large';
        }

        if ($args['wishlist_count'] == 0) {
            $args['wishlist_counter_class'] .= ' empty-counter';
        }

        return $args;
    }

    /**
     * Return classe
     *
     * @since 1.0.0
     *
     * @param  array  $classes
     * @return array $args
     */
    public function header_classes($section, $classes = [])
    {
        return implode(' ', $classes);
    }

    /**
     * Display the site branding title
     *
     * @since 1.0.0
     *
     * @param  array  $args
     * @return void
     */
    public static function site_branding_title($args = [])
    {
        $args = wp_parse_args($args, [
            'class' => '',
            'echo' => true,
        ]);

        // Ensure included a space at beginning.
        $class = ' site-title screen-reader-text';

        // HTML tag for this title.
        $tag = is_front_page() || is_home() ? 'h1' : 'p';
        $tag = apply_filters('glozin_site_branding_title_tag', $tag, $args);

        if (is_array($args['class'])) {
            $class = implode(' ', $args['class']).$class;
        } elseif (is_string($args['class'])) {
            $class = $args['class'].$class;
        }

        $title = sprintf(
            '<%1$s class="%2$s"><a href="%3$s" rel="home">%4$s</a></%1$s>',
            $tag,
            esc_attr(trim($class)),
            esc_url(home_url('/')),
            get_bloginfo('name')
        );

        if (! $args['echo']) {
            return $title;
        }

        echo apply_filters('glozin_site_branding_title_html', $title);
    }

    /**
     * Display the site branding description
     *
     * @since 1.0.0
     *
     * @param  array  $args
     * @return void
     */
    public static function site_branding_description($args = [])
    {
        $text = get_bloginfo('description', 'display');

        if (empty($text)) {
            return '';
        }

        $args = wp_parse_args($args, [
            'class' => '',
            'echo' => true,
        ]);

        // Ensure included a space at beginning.
        $class = ' site-description screen-reader-text';

        if (is_array($args['class'])) {
            $class = implode(' ', $args['class']).$class;
        } elseif (is_string($args['class'])) {
            $class = $args['class'].$class;
        }

        $description = sprintf(
            '<p class="%s">%s</p>',
            esc_attr(trim($class)),
            wp_kses_post($text)
        );

        if (! $args['echo']) {
            return $description;
        }

        echo apply_filters('site_branding_description_html', $description);
    }
}
