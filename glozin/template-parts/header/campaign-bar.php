<?php

use Glozin\Header\Campaign_Bar;
use Glozin\Icon;

/**
 * Template part for displaying the campaign bar
 */
?>
<div id="campaign-bar" class="campaign-bar position-relative d-flex align-items-center justify-content-center campaign-bar-type--<?php echo esc_attr($args['type']) ?>">
	<?php Campaign_Bar::content($args['type']); ?>
	<button class="campaign-bar__close gz-button-text gz-button-icon px-10 position-absolute top-50 end-0 z-1" aria-label="<?php esc_attr_e('Campaign Bar Close', 'glozin') ?>">
		<?php echo Icon::get_svg('close'); ?>
	</button>
</div>