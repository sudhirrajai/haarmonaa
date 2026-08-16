<?php

use Glozin\Blog\Post;
use Glozin\Blog\Single;

/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */
$container_class = 'container-min';
$entry_class = 'justify-content-center';
if (Single::sidebar()) {
    $container_class = '';
    $entry_class = '';
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header <?php echo esc_attr($container_class); ?>">
		<?php Post::category('gz-blog-badge-outline', true); ?>
		<?php Post::title('h1', true); ?>
		<div class="entry-meta d-flex flex-wrap align-items-center lh-normal <?php echo esc_attr($entry_class); ?>">
			<?php Post::author(); ?>
			<?php Post::date(); ?>
			<?php Post::comment(); ?>
		</div>
	</header>
	<div class="entry-content entry-single-content <?php echo esc_attr($container_class); ?> mt-40 clearfix">
		<?php Post::content(); ?>
	</div>
	<footer class="entry-footer <?php echo esc_attr($container_class); ?> mt-40 mb-40 d-flex flex-wrap align-items-center justify-content-between gap-15">
		<?php Post::tags(); ?>
		<?php Post::share(); ?>
	</footer>
</article>
