<?php

use Glozin\Icon;
use Glozin\WooCommerce\Language;

/**
 * Template part for displaying the language popover
 */
if (! function_exists('WC')) {
    return;
}

?>

<div id="language-popover" class="popover language-popover">
	<div class="popover__backdrop"></div>
	<div class="popover__container">
		<?php echo Icon::get_svg('close', 'ui', ['class' => 'gz-button gz-button-icon gz-button-light popover__button-close']); ?>
		<div class="popover__content">
        <?php echo Language::language_switcher(); ?>
		</div>
	</div>
</div>