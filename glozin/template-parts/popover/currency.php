<?php

use Glozin\Icon;
use Glozin\WooCommerce\Currency;

/**
 * Template part for displaying the currency popover
 */
if (! function_exists('WC')) {
    return;
}

?>

<div id="currency-popover" class="popover currency-popover">
	<div class="popover__backdrop"></div>
	<div class="popover__container">
		<?php echo Icon::get_svg('close', 'ui', ['class' => 'gz-button gz-button-icon gz-button-light popover__button-close']); ?>
		<div class="popover__content">
        <?php echo Currency::woocs_currency_switcher(); ?>
		</div>
	</div>
</div>