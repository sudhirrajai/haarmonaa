<?php

use Glozin\Helper;

/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */
if (! Helper::is_built_with_elementor()) { ?>
<article id="post-<?php the_ID(); ?>" class="<?php echo implode(' ', get_post_class('', get_the_ID())); ?> clearfix" >
<?php } ?>
	<?php the_content(); ?>
	<?php
       wp_link_pages([
           'before' => '<div class="page-links">'.esc_html__('Pages:', 'glozin'),
           'after' => '</div>',
       ]);
?>
<?php if (! Helper::is_built_with_elementor()) { ?>
</article>
<?php } ?>