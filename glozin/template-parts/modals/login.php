<?php

use Glozin\Helper;
use Glozin\Icon;

/**
 * Template part for displaying the my login modal
 */
if (! function_exists('WC')) {
    return;
}

if (Helper::get_option('header_signin_icon_behaviour') == 'page') {
    return;
}
?>

<div id="login-modal" class="login-modal modal woocommerce woocommerce-account">
	<div class="modal__backdrop"></div>
	<div class="modal__container">
		<div class="modal__wrapper">
			<a href="#" class="modal__button-close gz-button gz-button-icon gz-button-text position-absolute z-3 top-10 end-10">
				<?php echo Icon::get_svg('close', 'ui'); ?>
			</a>
			<div class="modal__content">
				<?php wc_get_template('myaccount/form-login.php', ['action' => 'popup']); ?>
			</div>
		</div>
	</div>
	<span class="modal__loader"><span class="glozinSpinner"></span></span>
</div>