<?php

use Glozin\Icon;

/**
 * Template part for displaying the filter sidebar panel
 */
if (! function_exists('WC')) {
    return;
}
$rtl_class = is_rtl() ? 'offscreen-panel--side-left' : 'offscreen-panel--side-right';
?>

<div id="filter-sidebar-panel" class="offscreen-panel filter-sidebar-panel <?php echo esc_attr($rtl_class); ?>">
	<div class="panel__backdrop"></div>
	<div class="panel__container">
		<?php echo Icon::get_svg('close', 'ui', ['class' => 'panel__button-close gz-button gz-button-icon gz-button-text position-absolute z-3 top-10 end-15']); ?>
		<div class="panel__header d-flex align-items-center h6">
			<?php echo esc_html__('Filter', 'glozin'); ?>
		</div>
		<div class="panel__content">
		<?php
            if (is_active_sidebar('catalog-filters-sidebar')) {
                dynamic_sidebar('catalog-filters-sidebar');
            }
?>
		</div>
	</div>
</div>