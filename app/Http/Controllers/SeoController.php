<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * Generate dynamic XML Sitemap for Google, Bing & other search engines.
     */
    public function sitemap(): Response
    {
        $baseUrl = config('app.url', url('/'));
        $baseUrl = rtrim($baseUrl, '/');

        // Static Core Pages
        $urls = [
            [
                'loc' => $baseUrl.'/',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl.'/shop',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => $baseUrl.'/about-us',
                'lastmod' => now()->subDays(3)->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
            [
                'loc' => $baseUrl.'/contact-us',
                'lastmod' => now()->subDays(3)->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
            [
                'loc' => $baseUrl.'/faq',
                'lastmod' => now()->subDays(3)->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6',
            ],
            [
                'loc' => $baseUrl.'/terms-of-use',
                'lastmod' => now()->subDays(30)->toAtomString(),
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ],
            [
                'loc' => $baseUrl.'/privacy-policy',
                'lastmod' => now()->subDays(30)->toAtomString(),
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ],
        ];

        // Published Categories
        try {
            $categories = Category::all(['id', 'slug', 'updated_at']);
            foreach ($categories as $cat) {
                if ($cat->slug) {
                    $urls[] = [
                        'loc' => "{$baseUrl}/category/{$cat->slug}",
                        'lastmod' => ($cat->updated_at ?? now())->toAtomString(),
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            }
        } catch (\Throwable $e) {
            // fallback
        }

        // Active Collections
        try {
            $collections = Collection::where('is_active', true)->get(['id', 'slug', 'updated_at']);
            foreach ($collections as $col) {
                if ($col->slug) {
                    $urls[] = [
                        'loc' => "{$baseUrl}/collection/{$col->slug}",
                        'lastmod' => ($col->updated_at ?? now())->toAtomString(),
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            }
        } catch (\Throwable $e) {
            // fallback
        }

        // Published Products
        try {
            $products = Product::where('status', '!=', 'draft')
                ->where('in_stock', true)
                ->get(['id', 'slug', 'image', 'updated_at']);

            foreach ($products as $prod) {
                if ($prod->slug) {
                    $urls[] = [
                        'loc' => "{$baseUrl}/product/{$prod->slug}",
                        'lastmod' => ($prod->updated_at ?? now())->toAtomString(),
                        'changefreq' => 'weekly',
                        'priority' => '0.9',
                        'image' => $prod->image ? url($prod->image) : null,
                    ];
                }
            }
        } catch (\Throwable $e) {
            // fallback
        }

        // Build XML content
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'."\n";

        foreach ($urls as $item) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.htmlspecialchars($item['loc'], ENT_XML1, 'UTF-8')."</loc>\n";
            $xml .= "    <lastmod>{$item['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>{$item['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$item['priority']}</priority>\n";
            if (! empty($item['image'])) {
                $xml .= "    <image:image>\n";
                $xml .= '      <image:loc>'.htmlspecialchars($item['image'], ENT_XML1, 'UTF-8')."</image:loc>\n";
                $xml .= "    </image:image>\n";
            }
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'X-Robots-Tag' => 'noindex', // Sitemap file itself does not need indexing
        ]);
    }

    /**
     * Generate standard /llms.txt for AI search crawlers (Perplexity, SearchGPT, Gemini, Claude).
     */
    public function llmsTxt(): Response
    {
        $baseUrl = rtrim(config('app.url', url('/')), '/');
        $storeName = Setting::get('store_name', 'Haarmonaa');
        $tagline = Setting::get('store_tagline', 'Everyday Luxury — 18K Anti-Tarnish Gold Vermeil Jewelry');
        $email = Setting::get('store_email', 'concierge@haarmonaa.com');
        $phone = Setting::get('store_phone', '+91 98765 43210');

        $categories = Category::all(['name', 'slug', 'description']);
        $featuredProducts = Product::where('status', '!=', 'draft')->where('is_featured', true)->limit(10)->get(['name', 'slug', 'price', 'category_name']);

        $txt = "# {$storeName}\n\n";
        $txt .= "> {$tagline}\n\n";
        $txt .= "## About {$storeName}\n";
        $txt .= "{$storeName} is a luxury fine jewelry brand specializing in everyday heirloom pieces crafted from 18K thick solid gold vermeil layered over hypoallergenic 925 sterling silver and surgical-grade titanium steel. Engineered with proprietary anti-tarnish protective coating, all pieces are waterproof, sweatproof, perfume-safe, and hypoallergenic for sensitive skin.\n\n";

        $txt .= "## Key Jewelry Categories\n";
        foreach ($categories as $cat) {
            $desc = $cat->description ? ": {$cat->description}" : '';
            $txt .= "- [{$cat->name}]({$baseUrl}/category/{$cat->slug}){$desc}\n";
        }
        $txt .= "\n";

        $txt .= "## Curated Bestsellers & Featured Pieces\n";
        foreach ($featuredProducts as $prod) {
            $txt .= "- [{$prod->name}]({$baseUrl}/product/{$prod->slug}) - ₹".number_format($prod->price)." ({$prod->category_name})\n";
        }
        $txt .= "\n";

        $txt .= "## Craftsmanship & Guarantees\n";
        $txt .= "- **18K Solid Gold Vermeil**: 2.5–3.0 microns of 18k genuine gold over solid core.\n";
        $txt .= "- **100% Anti-Tarnish & Waterproof**: Designed for daily wear in showers, workouts, and swimming.\n";
        $txt .= "- **Hypoallergenic & Nickel-Free**: Zero irritation, guaranteed for sensitive skin.\n";
        $txt .= "- **Shipping & Delivery**: Express insured pan-India delivery with real-time tracking.\n";
        $txt .= "- **Returns & Exchange**: Hassle-free 7-day concierge return policy.\n\n";

        $txt .= "## Contact & Concierge\n";
        $txt .= "- Website: {$baseUrl}\n";
        $txt .= "- Shop Catalog: {$baseUrl}/shop\n";
        $txt .= "- Full LLM Index: {$baseUrl}/llms-full.txt\n";
        $txt .= "- Concierge Support: {$email} | {$phone}\n";

        return response($txt, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }

    /**
     * Generate comprehensive /llms-full.txt for deep AI context extraction.
     */
    public function llmsFullTxt(): Response
    {
        $baseUrl = rtrim(config('app.url', url('/')), '/');
        $storeName = Setting::get('store_name', 'Haarmonaa');

        $categories = Category::withCount('products')->get();
        $products = Product::where('status', '!=', 'draft')->get(['id', 'name', 'slug', 'price', 'original_price', 'category_name', 'description', 'in_stock']);

        $txt = "# {$storeName} — Complete Knowledge Base & Product Directory\n\n";
        $txt .= "## Brand Heritage & Philosophy\n";
        $txt .= "Founded on the principle that luxury should be worn effortlessly every day, {$storeName} combines timeless Parisian elegance with modern metallurgical science. Our jewelry eliminates the traditional retail markup without compromising on heavy precious metal plating or gemstone clarity.\n\n";

        $txt .= "## Materials & Specifications\n";
        $txt .= "1. **Base Metals**: Recycled 925 Sterling Silver and Premium 316L Surgical Titanium.\n";
        $txt .= "2. **Gold Layering**: 18K Solid Gold electroplated at a generous 2.5–3.0 microns (Vermeil standard is >= 2.5 microns).\n";
        $txt .= "3. **Protective Seal**: Advanced nano-molecular anti-oxidation barrier preventing discoloration from water, chlorine, sebum, and cosmetics.\n";
        $txt .= "4. **Gemstones**: AAA+ Grade Hand-selected Cubic Zirconia, Freshwater Cultured Pearls, and Natural Shell.\n\n";

        $txt .= "## Complete Categories Index\n";
        foreach ($categories as $cat) {
            $txt .= "### {$cat->name} ({$cat->products_count} designs)\n";
            $txt .= "URL: {$baseUrl}/category/{$cat->slug}\n";
            if ($cat->description) {
                $txt .= "Description: {$cat->description}\n";
            }
            $txt .= "\n";
        }

        $txt .= "## Product Catalog\n\n";
        foreach ($products as $p) {
            $stockStatus = $p->in_stock ? 'In Stock' : 'Out of Stock';
            $txt .= "### [{$p->name}]({$baseUrl}/product/{$p->slug})\n";
            $txt .= "- Category: {$p->category_name}\n";
            $txt .= '- Price: ₹'.number_format($p->price);
            if ($p->original_price && $p->original_price > $p->price) {
                $txt .= ' (Original: ₹'.number_format($p->original_price).')';
            }
            $txt .= "\n";
            $txt .= "- Availability: {$stockStatus}\n";
            if ($p->description) {
                $cleanDesc = strip_tags($p->description);
                $cleanDesc = trim(preg_replace('/\s+/', ' ', $cleanDesc));
                $txt .= "- Summary: {$cleanDesc}\n";
            }
            $txt .= "\n";
        }

        $txt .= "## Institutional Links\n";
        $txt .= "- [Home]({$baseUrl}/)\n";
        $txt .= "- [Shop All Jewelry]({$baseUrl}/shop)\n";
        $txt .= "- [About Us]({$baseUrl}/about-us)\n";
        $txt .= "- [Contact & Bespoke Inquiries]({$baseUrl}/contact-us)\n";
        $txt .= "- [FAQ & Jewelry Care Guide]({$baseUrl}/faq)\n";
        $txt .= "- [Terms of Use]({$baseUrl}/terms-of-use)\n";
        $txt .= "- [Privacy Policy]({$baseUrl}/privacy-policy)\n";

        return response($txt, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }
}
