<?php

use Glozin\Blog\Post;

/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('gz-post-grid swiper-slide'); ?>>
	<?php if (has_post_thumbnail()) { ?>
		<div class="entry-header mb-30">
			<?php Post::thumbnail(); ?>
		</div>
	<?php } ?>
	<?php Post::title('h6', false, ['mt-0', 'mb-10', 'heading-letter-spacing']); ?>
	<div class="entry-meta d-flex flex-wrap align-items-center lh-normal">
		<?php Post::author(); ?>
		<?php Post::date(false); ?>
	</div>
</article>