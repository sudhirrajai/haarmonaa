<?php

use Glozin\Page_Header;

/**
 * Template part for displaying the blog header
 */
?>

<div id="page-header" class="<?php Page_Header::classes('page-header'); ?>">
	<div class="container clearfix">
		<?php do_action('glozin_before_page_header_content'); ?>
		<div class="page-header__content position-relative d-flex flex-column <?php echo apply_filters('glozin_page_header_content_class', 'justify-content-center align-items-center text-center'); ?>">
			<?php Page_Header::breadcrumb(); ?>
			<?php echo Page_Header::title(); ?>
			<?php echo Page_Header::description(); ?>
		</div>
		<?php do_action('glozin_after_page_header_content'); ?>
	</div>
</div>