<?php

use Glozin\Blog\Post;

/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if (has_post_thumbnail()) { ?>
		<?php Post::thumbnail(); ?>
	<?php } ?>
	<div class="entry-summary d-flex flex-column align-items-center justify-content-center text-center">
		<?php Post::category('fw-medium'); ?>
		<?php Post::title('h3', false, ['mt-0 mb-10 fs-20']); ?>
		<?php Post::excerpt(24, ['p' => ['mt-0', 'mb-20']]); ?>
		<div class="entry-meta d-flex flex-wrap align-items-center lh-normal gap-10">
			<?php Post::author(false); ?>
			<?php Post::date(false); ?>
		</div>
	</div>
</article>