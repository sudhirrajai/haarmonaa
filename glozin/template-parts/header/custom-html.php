<?php

use Glozin\Helper;

/**
 * Template part for displaying the custom HTML
 */
?>

<div class="header-custom-html">
	<?php echo do_shortcode(wp_kses_post(Helper::get_option('header_custom_html'))); ?>
</div>
