<?php

use Glozin\Helper;
use Glozin\Icon;

/**
 * Template part for displaying the hamburger menu
 */
?>

<button class="header-hamburger hamburger-menu gz-button-text" aria-label="<?php esc_attr_e('Header Hamburger', 'glozin'); ?>" data-toggle="off-canvas" data-target="mobile-menu-panel">
	<?php echo Icon::get_svg('hamburger', 'ui', 'class=hamburger__icon'); ?>
	<?php echo ! empty(Helper::get_option('mobile_header_hamburger_menu_text')) ? '<span class="hamburger-menu__text fw-600">'.Helper::get_option('mobile_header_hamburger_menu_text').'</span>' : ''; ?>
</button>