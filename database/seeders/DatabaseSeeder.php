<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Image CDN Helpers
        $images = [
            'ring_1' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
            'ring_2' => 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
            'ring_3' => 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop',
            'ring_4' => 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop',
            'necklace_1' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
            'necklace_2' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
            'necklace_3' => 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop',
            'necklace_4' => 'https://images.unsplash.com/photo-1611591475102-7634599ce074?q=80&w=800&auto=format&fit=crop',
            'earring_1' => 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop',
            'earring_2' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
            'earring_3' => 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
            'earring_4' => 'https://images.unsplash.com/photo-1576022361669-aa2488806282?q=80&w=800&auto=format&fit=crop',
            'bracelet_1' => 'https://images.unsplash.com/photo-1611591475102-7634599ce074?q=80&w=800&auto=format&fit=crop',
            'bracelet_2' => 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
            'bracelet_3' => 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
            'bracelet_4' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
        ];

        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@haarmonaa.in'],
            [
                'name' => 'Haarmonaa Admin',
                'password' => bcrypt('admin123'),
            ]
        );

        // 2. Categories
        $categoriesData = [
            [
                'name' => 'Earrings',
                'slug' => 'earrings',
                'image' => $images['earring_1'],
                'description' => 'Fine artisanal hoops, studs, and drop earrings in 18k solid gold vermeil.',
                'item_count' => 6,
            ],
            [
                'name' => 'Bracelets',
                'slug' => 'bracelets',
                'image' => $images['bracelet_1'],
                'description' => 'Delicate cuffs, tennis chains, and waterproof charm bracelets.',
                'item_count' => 6,
            ],
            [
                'name' => 'Rings',
                'slug' => 'rings',
                'image' => $images['ring_1'],
                'description' => 'Anti-tarnish adjustable statement bands and stacking rings.',
                'item_count' => 6,
            ],
            [
                'name' => 'Necklaces',
                'slug' => 'necklaces',
                'image' => $images['necklace_1'],
                'description' => 'Heirloom pendants, crystal chokers, and layered link chains.',
                'item_count' => 6,
            ],
        ];

        $categoryModels = [];
        foreach ($categoriesData as $cData) {
            $categoryModels[$cData['slug']] = Category::updateOrCreate(['slug' => $cData['slug']], $cData);
        }

        // 2.1 Global Attributes & Values
        $attr1 = Attribute::updateOrCreate(
            ['slug' => 'metal-finish'],
            [
                'name' => 'Metal Finish',
                'display_type' => 'color_swatch',
                'description' => 'Lustrous anti-tarnish metal finishes and plating colors.',
            ]
        );
        $attr1->values()->updateOrCreate(['name' => '18K Yellow Gold'], ['value' => '18k-yellow-gold', 'color_code' => '#D4AF37']);
        $attr1->values()->updateOrCreate(['name' => 'Rose Gold'], ['value' => 'rose-gold', 'color_code' => '#E8A598']);
        $attr1->values()->updateOrCreate(['name' => 'Sterling Silver'], ['value' => 'sterling-silver', 'color_code' => '#E3E3E3']);

        $attr2 = Attribute::updateOrCreate(
            ['slug' => 'ring-size'],
            [
                'name' => 'Ring Size',
                'display_type' => 'button_pill',
                'description' => 'Comfort-fit US ring standard sizing.',
            ]
        );
        $attr2->values()->updateOrCreate(['name' => 'Adjustable'], ['value' => 'adjustable']);
        $attr2->values()->updateOrCreate(['name' => 'US 5'], ['value' => 'us-5']);
        $attr2->values()->updateOrCreate(['name' => 'US 6'], ['value' => 'us-6']);
        $attr2->values()->updateOrCreate(['name' => 'US 7'], ['value' => 'us-7']);
        $attr2->values()->updateOrCreate(['name' => 'US 8'], ['value' => 'us-8']);

        $attr3 = Attribute::updateOrCreate(
            ['slug' => 'gemstone'],
            [
                'name' => 'Gemstone',
                'display_type' => 'select_dropdown',
                'description' => 'Fine handset precious and semi-precious gemstones.',
            ]
        );
        $attr3->values()->updateOrCreate(['name' => 'Natural Diamond'], ['value' => 'natural-diamond']);
        $attr3->values()->updateOrCreate(['name' => 'Freshwater Pearl'], ['value' => 'freshwater-pearl']);
        $attr3->values()->updateOrCreate(['name' => 'Emerald Green'], ['value' => 'emerald-green']);
        $attr3->values()->updateOrCreate(['name' => 'Cubic Zirconia'], ['value' => 'cubic-zirconia']);

        // 3. Products (24 Items with Curated Luxury Jewelry Images)
        $productsData = [
            // --- RINGS (6 Items) ---
            [
                'name' => 'Anti-Tarnish Starfish Crown Adjustable Ring',
                'slug' => 'starfish-crown-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 199.00,
                'original_price' => 220.00,
                'discount_percent' => 10,
                'image' => $images['ring_1'],
                'secondary_image' => $images['ring_2'],
                'description' => 'Crafted with premium waterproof materials and 18k yellow gold plating. Adjustable fit for effortless stacking.',
                'rating' => 5.0,
                'review_count' => 24,
                'in_stock' => true,
                'stock_quantity' => 45,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Dual Pebble Minimalist Adjustable Ring',
                'slug' => 'dual-pebble-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 150.00,
                'original_price' => 199.00,
                'discount_percent' => 25,
                'image' => $images['ring_2'],
                'secondary_image' => $images['ring_3'],
                'description' => 'Sculpted organic dual pebble contour in polished 18k solid gold vermeil.',
                'rating' => 5.0,
                'review_count' => 18,
                'in_stock' => true,
                'stock_quantity' => 30,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Golden Heart Open Cuff Adjustable Ring',
                'slug' => 'golden-heart-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 210.00,
                'original_price' => 250.00,
                'discount_percent' => 16,
                'image' => $images['ring_3'],
                'secondary_image' => $images['ring_4'],
                'description' => 'A symbol of enduring affection, featuring an open wrap heart design.',
                'rating' => 5.0,
                'review_count' => 32,
                'in_stock' => true,
                'stock_quantity' => 25,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Fluid Wave Organic Stacking Ring',
                'slug' => 'fluid-wave-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 180.00,
                'original_price' => 210.00,
                'discount_percent' => 14,
                'image' => $images['ring_4'],
                'secondary_image' => $images['ring_1'],
                'description' => 'Inspired by undulating ocean waves, coated with multi-layer hypoallergenic gold.',
                'rating' => 5.0,
                'review_count' => 14,
                'in_stock' => true,
                'stock_quantity' => 60,
                'is_featured' => true,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Twisted Eternity Pavé Crystal Ring',
                'slug' => 'twisted-eternity-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 230.00,
                'original_price' => 280.00,
                'discount_percent' => 18,
                'image' => $images['ring_1'],
                'secondary_image' => $images['ring_3'],
                'description' => 'Continuous shimmering micro-pavé crystals woven in an infinite dual twist band.',
                'rating' => 5.0,
                'review_count' => 21,
                'in_stock' => true,
                'stock_quantity' => 35,
                'is_featured' => false,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Celestial Sunburst Signet Ring',
                'slug' => 'celestial-sunburst-ring',
                'category_slug' => 'rings',
                'category_name' => 'Rings',
                'price' => 250.00,
                'original_price' => 300.00,
                'discount_percent' => 17,
                'image' => $images['ring_2'],
                'secondary_image' => $images['ring_4'],
                'description' => 'Hand-engraved celestial ray motif centered with a brilliant diamond-cut gemstone.',
                'rating' => 4.9,
                'review_count' => 16,
                'in_stock' => true,
                'stock_quantity' => 40,
                'is_featured' => false,
                'is_best_seller' => false,
            ],

            // --- EARRINGS (6 Items) ---
            [
                'name' => 'Flourish Waterdrop Glaze Statement Earrings',
                'slug' => 'flourish-waterdrop-earrings',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 220.00,
                'original_price' => 260.00,
                'discount_percent' => 15,
                'image' => $images['earring_1'],
                'secondary_image' => $images['earring_2'],
                'description' => 'Mirror-finish teardrop silhouette designed to catch luminous ambient light.',
                'rating' => 5.0,
                'review_count' => 29,
                'in_stock' => true,
                'stock_quantity' => 50,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Chunky Hollow Dome Gold Hoops',
                'slug' => 'chunky-hollow-dome-hoops',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 175.00,
                'original_price' => 210.00,
                'discount_percent' => 17,
                'image' => $images['earring_2'],
                'secondary_image' => $images['earring_3'],
                'description' => 'Ultra-lightweight everyday statement hoops crafted with hollow core architecture.',
                'rating' => 5.0,
                'review_count' => 42,
                'in_stock' => true,
                'stock_quantity' => 40,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Lustre Cascade Baroque Pearl Drops',
                'slug' => 'lustre-cascade-pearl-drops',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 240.00,
                'original_price' => 290.00,
                'discount_percent' => 17,
                'image' => $images['earring_3'],
                'secondary_image' => $images['earring_4'],
                'description' => 'Irregular organic freshwater baroque pearls suspended on 18k gold vermeil posts.',
                'rating' => 4.9,
                'review_count' => 19,
                'in_stock' => true,
                'stock_quantity' => 22,
                'is_featured' => true,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Gilded Bamboo Textured Huggie Earrings',
                'slug' => 'gilded-bamboo-huggies',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 160.00,
                'original_price' => 190.00,
                'discount_percent' => 16,
                'image' => $images['earring_4'],
                'secondary_image' => $images['earring_1'],
                'description' => 'Subtle natural bamboo segment ribbed detailing with secure click latch closure.',
                'rating' => 5.0,
                'review_count' => 25,
                'in_stock' => true,
                'stock_quantity' => 55,
                'is_featured' => false,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Triple Tier Prism Chandelier Earrings',
                'slug' => 'triple-tier-prism-earrings',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 280.00,
                'original_price' => 340.00,
                'discount_percent' => 18,
                'image' => $images['earring_1'],
                'secondary_image' => $images['earring_3'],
                'description' => 'Dramatic kinetic cascading links engineered for evening luxury looks.',
                'rating' => 5.0,
                'review_count' => 11,
                'in_stock' => true,
                'stock_quantity' => 18,
                'is_featured' => false,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Petite Solitaire Diamond Studs',
                'slug' => 'petite-solitaire-diamond-studs',
                'category_slug' => 'earrings',
                'category_name' => 'Earrings',
                'price' => 190.00,
                'original_price' => 225.00,
                'discount_percent' => 15,
                'image' => $images['earring_2'],
                'secondary_image' => $images['earring_4'],
                'description' => 'Four-prong basket setting holding high-clarity lab-grown brilliant diamonds.',
                'rating' => 5.0,
                'review_count' => 38,
                'in_stock' => true,
                'stock_quantity' => 30,
                'is_featured' => false,
                'is_best_seller' => true,
            ],

            // --- NECKLACES (6 Items) ---
            [
                'name' => 'Heirloom Medallion Coin Pendant Necklace',
                'slug' => 'heirloom-medallion-necklace',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 240.00,
                'original_price' => 290.00,
                'discount_percent' => 17,
                'image' => $images['necklace_1'],
                'secondary_image' => $images['necklace_2'],
                'description' => 'Vintage Roman mythological emblem pressed into heavy 18k gold over solid bronze core.',
                'rating' => 5.0,
                'review_count' => 45,
                'in_stock' => true,
                'stock_quantity' => 35,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Herringbone Snake Flat Chain Collar',
                'slug' => 'herringbone-snake-chain',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 210.00,
                'original_price' => 250.00,
                'discount_percent' => 16,
                'image' => $images['necklace_2'],
                'secondary_image' => $images['necklace_3'],
                'description' => 'Silky-smooth liquid gold ribbon chain resting gracefully along collarbones.',
                'rating' => 5.0,
                'review_count' => 52,
                'in_stock' => true,
                'stock_quantity' => 60,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Solstice Sun Ray Floating Diamond Choker',
                'slug' => 'solstice-sun-ray-choker',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 265.00,
                'original_price' => 320.00,
                'discount_percent' => 17,
                'image' => $images['necklace_3'],
                'secondary_image' => $images['necklace_4'],
                'description' => 'Radiant solar flare motif holding a single floating bezel-set gemstone.',
                'rating' => 4.9,
                'review_count' => 18,
                'in_stock' => true,
                'stock_quantity' => 20,
                'is_featured' => true,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Paperclip Link Layered Statement Chain',
                'slug' => 'paperclip-link-layered-chain',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 225.00,
                'original_price' => 270.00,
                'discount_percent' => 17,
                'image' => $images['necklace_4'],
                'secondary_image' => $images['necklace_1'],
                'description' => 'Modern architectural elongated links with custom clasp connector.',
                'rating' => 5.0,
                'review_count' => 31,
                'in_stock' => true,
                'stock_quantity' => 40,
                'is_featured' => false,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Baroque Keshi Pearl Floating Strand',
                'slug' => 'baroque-keshi-pearl-strand',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 295.00,
                'original_price' => 360.00,
                'discount_percent' => 18,
                'image' => $images['necklace_1'],
                'secondary_image' => $images['necklace_3'],
                'description' => 'Hand-knotted lustrous freeform Keshi pearls on silk cord with gold filigree clasp.',
                'rating' => 5.0,
                'review_count' => 14,
                'in_stock' => true,
                'stock_quantity' => 15,
                'is_featured' => false,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Dainty Emerald Teardrop Solitaire Pendant',
                'slug' => 'dainty-emerald-teardrop-pendant',
                'category_slug' => 'necklaces',
                'category_name' => 'Necklaces',
                'price' => 250.00,
                'original_price' => 310.00,
                'discount_percent' => 19,
                'image' => $images['necklace_2'],
                'secondary_image' => $images['necklace_4'],
                'description' => 'Rich Colombian emerald-hued crystal encased in high-polish three-prong setting.',
                'rating' => 5.0,
                'review_count' => 27,
                'in_stock' => true,
                'stock_quantity' => 28,
                'is_featured' => false,
                'is_best_seller' => true,
            ],

            // --- BRACELETS (6 Items) ---
            [
                'name' => 'Eternity Tennis Bracelet with Bezel Crystals',
                'slug' => 'eternity-tennis-bracelet',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 260.00,
                'original_price' => 320.00,
                'discount_percent' => 19,
                'image' => $images['bracelet_1'],
                'secondary_image' => $images['bracelet_2'],
                'description' => 'Seamless row of high-brilliance crystals mounted in secure smooth bezels.',
                'rating' => 5.0,
                'review_count' => 64,
                'in_stock' => true,
                'stock_quantity' => 45,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Sculpted Minimalist Torque Cuff Bangle',
                'slug' => 'sculpted-torque-cuff-bangle',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 210.00,
                'original_price' => 250.00,
                'discount_percent' => 16,
                'image' => $images['bracelet_2'],
                'secondary_image' => $images['bracelet_3'],
                'description' => 'Clean architectural open band with tapered spherical ends in 18k solid gold finish.',
                'rating' => 5.0,
                'review_count' => 33,
                'in_stock' => true,
                'stock_quantity' => 38,
                'is_featured' => true,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Figaro Cuban Link Chunky Chain Bracelet',
                'slug' => 'figaro-cuban-link-bracelet',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 195.00,
                'original_price' => 240.00,
                'discount_percent' => 19,
                'image' => $images['bracelet_3'],
                'secondary_image' => $images['bracelet_4'],
                'description' => 'Classic Italian rhythm pattern with high-gloss beveled edges and lobster clasp.',
                'rating' => 4.9,
                'review_count' => 26,
                'in_stock' => true,
                'stock_quantity' => 50,
                'is_featured' => true,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Celestial Charm Dangling Coin Bracelet',
                'slug' => 'celestial-charm-coin-bracelet',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 230.00,
                'original_price' => 280.00,
                'discount_percent' => 18,
                'image' => $images['bracelet_4'],
                'secondary_image' => $images['bracelet_1'],
                'description' => 'Five embossed astronomical talisman charms spaced on an adjustable rolo chain.',
                'rating' => 5.0,
                'review_count' => 22,
                'in_stock' => true,
                'stock_quantity' => 30,
                'is_featured' => false,
                'is_best_seller' => true,
            ],
            [
                'name' => 'Herringbone Woven Ribbon Wristband',
                'slug' => 'herringbone-woven-wristband',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 185.00,
                'original_price' => 220.00,
                'discount_percent' => 16,
                'image' => $images['bracelet_1'],
                'secondary_image' => $images['bracelet_3'],
                'description' => 'Supremely flexible fluid weave engineered for day-to-night wrist comfort.',
                'rating' => 5.0,
                'review_count' => 19,
                'in_stock' => true,
                'stock_quantity' => 42,
                'is_featured' => false,
                'is_best_seller' => false,
            ],
            [
                'name' => 'Triple Strand Beaded Stacking Bracelet',
                'slug' => 'triple-strand-beaded-bracelet',
                'category_slug' => 'bracelets',
                'category_name' => 'Bracelets',
                'price' => 215.00,
                'original_price' => 260.00,
                'discount_percent' => 17,
                'image' => $images['bracelet_2'],
                'secondary_image' => $images['bracelet_4'],
                'description' => 'Micro-faceted gold beads strung with high-durability memory core wiring.',
                'rating' => 5.0,
                'review_count' => 28,
                'in_stock' => true,
                'stock_quantity' => 35,
                'is_featured' => false,
                'is_best_seller' => true,
            ],
        ];

        foreach ($productsData as $pData) {
            $catSlug = $pData['category_slug'];
            $category = $categoryModels[$catSlug] ?? null;

            $product = Product::updateOrCreate(
                ['slug' => $pData['slug']],
                [
                    'name' => $pData['name'],
                    'price' => $pData['price'],
                    'original_price' => $pData['original_price'],
                    'discount_percent' => $pData['discount_percent'],
                    'image' => $pData['image'],
                    'secondary_image' => $pData['secondary_image'],
                    'description' => $pData['description'],
                    'rating' => $pData['rating'],
                    'review_count' => $pData['review_count'],
                    'in_stock' => $pData['in_stock'],
                    'stock_quantity' => $pData['stock_quantity'],
                    'is_featured' => $pData['is_featured'],
                    'is_best_seller' => $pData['is_best_seller'],
                    'category_id' => $category?->id,
                    'category_name' => $pData['category_name'],
                ]
            );

            if ($category) {
                $product->categories()->syncWithoutDetaching([$category->id]);
            }

            // Create 3 Luxury Variants for each product
            $metalVariants = [
                ['finish' => '18K Yellow Gold', 'sku_code' => 'YG', 'price_diff' => 0, 'img' => $pData['image']],
                ['finish' => 'Rose Gold', 'sku_code' => 'RG', 'price_diff' => 15, 'img' => $pData['secondary_image']],
                ['finish' => 'Sterling Silver', 'sku_code' => 'SS', 'price_diff' => -20, 'img' => $pData['image']],
            ];

            foreach ($metalVariants as $mVar) {
                $varSku = strtoupper(substr($product->slug, 0, 8)).'-'.$mVar['sku_code'];
                $varPrice = max(50, $product->price + $mVar['price_diff']);

                $product->variants()->updateOrCreate(
                    ['sku' => $varSku],
                    [
                        'name' => $product->name.' - '.$mVar['finish'],
                        'price' => $varPrice,
                        'stock_quantity' => rand(15, 45),
                        'image' => $mVar['img'],
                        'attributes' => [
                            'Metal Finish' => $mVar['finish'],
                            'Ring Size' => $catSlug === 'rings' ? 'Adjustable' : null,
                        ],
                    ]
                );
            }
        }

        // 4. Initial Sample Customers
        $customers = [
            ['name' => 'Pooja Verma', 'email' => 'pooja.verma@example.com', 'phone' => '+91 98765 43210', 'city' => 'Mumbai', 'total_orders' => 4, 'total_spent' => 2450.00],
            ['name' => 'Ananya Sharma', 'email' => 'ananya.sharma@example.com', 'phone' => '+91 98234 56789', 'city' => 'Delhi', 'total_orders' => 2, 'total_spent' => 980.00],
            ['name' => 'Rohan Mehta', 'email' => 'rohan.mehta@example.com', 'phone' => '+91 97112 34567', 'city' => 'Bengaluru', 'total_orders' => 3, 'total_spent' => 1650.00],
        ];
        foreach ($customers as $c) {
            Customer::updateOrCreate(['email' => $c['email']], $c);
        }

        // 5. Initial Sample Orders
        $orders = [
            [
                'order_number' => 'ORD-2026-8942',
                'customer_name' => 'Pooja Verma',
                'customer_email' => 'pooja.verma@example.com',
                'customer_phone' => '+91 98765 43210',
                'shipping_address' => '402, Sea Breeze Heights, Hill Road, Bandra West',
                'city' => 'Mumbai',
                'postal_code' => '400050',
                'subtotal' => 640.00,
                'tax' => 19.20,
                'shipping' => 0.00,
                'total_amount' => 659.20,
                'status' => 'delivered',
                'payment_method' => 'RAZORPAY',
                'payment_status' => 'paid',
                'created_at' => now()->subDays(3),
            ],
            [
                'order_number' => 'ORD-2026-9104',
                'customer_name' => 'Ananya Sharma',
                'customer_email' => 'ananya.sharma@example.com',
                'customer_phone' => '+91 98234 56789',
                'shipping_address' => '78, Golf Links, Lodhi Road',
                'city' => 'New Delhi',
                'postal_code' => '110003',
                'subtotal' => 450.00,
                'tax' => 13.50,
                'shipping' => 0.00,
                'total_amount' => 463.50,
                'status' => 'shipped',
                'payment_method' => 'RAZORPAY',
                'payment_status' => 'paid',
                'created_at' => now()->subDays(1),
            ],
            [
                'order_number' => 'ORD-2026-9428',
                'customer_name' => 'Rohan Mehta',
                'customer_email' => 'rohan.mehta@example.com',
                'customer_phone' => '+91 97112 34567',
                'shipping_address' => '12B, Indiranagar 100ft Road',
                'city' => 'Bengaluru',
                'postal_code' => '560038',
                'subtotal' => 240.00,
                'tax' => 7.20,
                'shipping' => 49.00,
                'total_amount' => 296.20,
                'status' => 'processing',
                'payment_method' => 'COD',
                'payment_status' => 'pending',
                'created_at' => now(),
            ],
        ];

        foreach ($orders as $ordData) {
            $order = Order::updateOrCreate(['order_number' => $ordData['order_number']], $ordData);
            if ($order->items()->count() === 0) {
                $p1 = Product::first();
                if ($p1) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $p1->id,
                        'product_name' => $p1->name.' (18K Yellow Gold)',
                        'product_image' => $p1->image,
                        'unit_price' => $p1->price,
                        'quantity' => 1,
                        'subtotal' => $p1->price,
                    ]);
                }
            }
        }

        // 6. Settings Defaults
        $settings = [
            'store_name' => 'Haarmonaa Luxury Jewelry',
            'store_email' => 'concierge@haarmonaa.in',
            'currency' => '₹',
            'tax_rate' => 3.0, // 3% GST on jewelry
            'shipping_fee' => 49.00,
            'free_shipping_threshold' => 999.00,
        ];

        foreach ($settings as $k => $v) {
            Setting::updateOrCreate(['key' => $k], ['value' => (string) $v]);
        }

        // 7. Curated Luxury Collections
        $allCreatedProducts = Product::all();

        $c1 = Collection::updateOrCreate(
            ['slug' => 'summer-solstice-capsule'],
            [
                'name' => 'Summer Solstice Capsule',
                'tagline' => 'SUNLIT WATERPROOF HEIRLOOMS',
                'description' => 'A luminous collection of anti-tarnish 18k gold vermeil curated to shine effortlessly under sunlight and ocean mist.',
                'image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ]
        );
        $c1->products()->sync($allCreatedProducts->take(6)->pluck('id'));

        $c2 = Collection::updateOrCreate(
            ['slug' => 'baroque-pearl-series'],
            [
                'name' => 'Baroque Pearl Series',
                'tagline' => 'ORGANIC MODERN PEARLS',
                'description' => 'Lustrous freshwater baroque pearls set in sculpted recycled 18k solid gold.',
                'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ]
        );
        $c2->products()->sync($allCreatedProducts->slice(6, 6)->pluck('id'));

        $c3 = Collection::updateOrCreate(
            ['slug' => 'heirloom-solid-gold'],
            [
                'name' => 'Heirloom Solid Gold',
                'tagline' => 'TIMELESS STATEMENT ADORNMENTS',
                'description' => 'Certified solid gold jewelry engineered with timeless architectural precision.',
                'image' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ]
        );
        $c3->products()->sync($allCreatedProducts->slice(12, 6)->pluck('id'));

        // 8. Sample Coupons & Promo Codes
        $coupons = [
            [
                'code' => 'WELCOME10',
                'description' => 'Welcome 10% discount on all luxury jewelry items',
                'type' => 'percent',
                'value' => 10.00,
                'min_spend' => 0.00,
                'max_discount' => 500.00,
                'usage_limit' => 500,
                'usage_limit_per_user' => 1,
                'usage_count' => 12,
                'is_active' => true,
            ],
            [
                'code' => 'JEWEL500',
                'description' => 'Flat ₹500 discount on orders above ₹1,999',
                'type' => 'fixed',
                'value' => 500.00,
                'min_spend' => 1999.00,
                'max_discount' => null,
                'usage_limit' => 100,
                'usage_limit_per_user' => 2,
                'usage_count' => 5,
                'is_active' => true,
            ],
            [
                'code' => 'FESTIVE15',
                'description' => 'Festive offer 15% discount on all purchases',
                'type' => 'percent',
                'value' => 15.00,
                'min_spend' => 999.00,
                'max_discount' => 1000.00,
                'usage_limit' => 200,
                'usage_limit_per_user' => 1,
                'usage_count' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $cpData) {
            Coupon::updateOrCreate(['code' => $cpData['code']], $cpData);
        }
    }
}
