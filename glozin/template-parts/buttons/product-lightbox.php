<?php

use Glozin\Icon;

/**
 * Template part for displaying the product lightbox button
 */
?>

<a href="#" class="glozin-button--product-lightbox" aria-label="<?php echo esc_attr__('Open product lightbox', 'glozin'); ?>">
	<?php echo Icon::get_svg('fullscreen'); ?>
</a>