<?php

use Glozin\Header\Main;
use Glozin\Helper;
use Glozin\Icon;

/**
 * Template part for displaying the logo
 */
$show_title = isset($args['title']) ? $args['title'] : true;
$logo = apply_filters('glozin_header_logo', '', $args['type']);
$logo_light = apply_filters('glozin_header_logo_light', '', $args['type']);

if (empty($logo)) {
    if ($args['type'] == 'text') {
        $logo = ! empty($args['logo']) ? $args['logo'] : Helper::get_option('logo_text');
    } elseif ($args['type'] == 'svg') {
        $logo = ! empty($args['logo']) ? $args['logo'] : Helper::get_option('logo_svg');

    } else {
        $logo = ! empty($args['logo']) ? $args['logo'] : Helper::get_option('logo');

        if (empty($logo)) {
            $logo = get_template_directory_uri().'/images/logo.svg';
        }
    }
}

if (empty($logo_light)) {
    if ($args['type'] == 'image') {
        $logo_light = (isset($args['logo_light']) && ! empty($args['logo_light'])) ? $args['logo_light'] : Helper::get_option('logo_light');
    }
}

?>
<div class="header-logo position-relative z-3 <?php echo esc_attr($args['classes']); ?>">
	<a class="d-block position-relative fw-semibold lh-1" href="<?php echo esc_url(home_url()) ?>">
		<?php if ($logo) { ?>
			<?php if ($args['type'] == 'text') { ?>
				<span class="header-logo__text fs-32"><?php echo esc_html($logo) ?></span>
			<?php } elseif ($args['type'] == 'svg') { ?>
				<span class="header-logo__svg fs-32"><?php echo Icon::sanitize_svg($logo); ?></span>
			<?php } elseif ($args['type'] == 'svg_upload') { ?>
				<span class="header-logo__svg fs-32"><?php echo ! empty($logo) ? $logo : ''; ?></span>
			<?php } else { ?>
				<?php if (! empty($logo_light)) { ?>
					<img src="<?php echo esc_url($logo_light); ?>" alt="<?php echo get_bloginfo('name'); ?>" class="logo-light">
				<?php } ?>
				<img src="<?php echo esc_url($logo); ?>" class="logo-dark d-inline-block" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
			<?php } ?>
		<?php } ?>
	</a>
	<?php if ($show_title) { ?>
	<?php Main::site_branding_title(); ?>
	<?php Main::site_branding_description(); ?>
	<?php } ?>
</div>
