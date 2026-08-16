<?php

use Glozin\WooCommerce\Currency;

/**
 * Template part for displaying the currency
 */
if (! function_exists('WC')) {
    return;
}

?>

<div class="header-currency glozin-currency glozin-currency-language gz-color-dark">
	<?php echo Currency::currency_switcher(); ?>
</div>