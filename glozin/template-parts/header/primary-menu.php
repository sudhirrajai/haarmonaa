<?php

use Glozin\Addons\Modules\Mega_Menu\Walker;

/**
 * Template part for displaying the primary menu
 */
?>

<?php
    if (! has_nav_menu('primary-menu')) {
        return;
    }

$theme_location = isset($args['theme_location']) && $args['theme_location'] ? $args['theme_location'] : 'primary-menu';
$theme_location = has_nav_menu($theme_location) ? $theme_location : 'primary-menu';
$container_class = isset($args['container_class']) && $args['container_class'] ? $args['container_class'] : '';
$menu_class = isset($args['menu_class']) && $args['menu_class'] ? 'nav-menu menu' : 'menu';

if (class_exists('\Glozin\Addons\Modules\Mega_Menu\Walker')) {
    wp_nav_menu(apply_filters('glozin_navigation_primary_menu_content', [
        'theme_location' => $theme_location,
        'container' => 'nav',
        'container_class' => 'main-navigation'.$container_class,
        'menu_class' => $menu_class,
        'walker' => new Walker,
    ]));
} else {
    wp_nav_menu(apply_filters('glozin_navigation_primary_menu_content', [
        'theme_location' => $theme_location,
        'container' => 'nav',
        'container_class' => $container_class,
        'menu_class' => $menu_class,
    ]));
}
?>