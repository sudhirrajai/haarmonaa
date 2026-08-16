<?php

use Glozin\Icon;

/**
 * Template part for displaying the edit cart item modal
 */
if (! function_exists('WC')) {
    return;
}
?>

<div id="quick-edit-modal" class="quick-edit-modal modal single-product modal__quickedit">
	<div class="modal__backdrop"></div>
	<div class="modal__container">
		<div class="modal__wrapper">
			<div class="modal__header border-bottom">
				<h3 class="modal__title h5"><?php esc_html_e('Edit Option', 'glozin'); ?></h3>
				<a href="#" class="modal__button-close">
					<?php echo Icon::get_svg('close', 'ui'); ?>
				</a>
			</div>
			<div class="modal__content woocommerce">
				<div class="modal__product product-quickedit product"></div>
			</div>
		</div>
	</div>
</div>