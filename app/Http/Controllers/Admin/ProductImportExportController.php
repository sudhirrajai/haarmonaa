<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductImportExportController extends Controller
{
    /**
     * Download sample CSV template.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'name',
            'slug',
            'category',
            'collections',
            'price',
            'original_price',
            'discount_percent',
            'stock_quantity',
            'in_stock',
            'images',
            'description',
            'status',
            'is_featured',
            'is_best_seller',
            'shipping_type',
            'shipping_fee',
            'Attribute 1 name',
            'Attribute 1 value(s)',
            'Attribute 2 name',
            'Attribute 2 value(s)',
        ];

        $samples = [
            [
                '18K Gold Vermeil Ripple Ring',
                '18k-gold-vermeil-ripple-ring',
                'Rings',
                'Best Sellers, Summer Glow',
                '1299',
                '2499',
                '48',
                '25',
                '1',
                '/storage/media/sample-ring-1.webp, /storage/media/sample-ring-2.webp',
                'Handcrafted 18K thick gold vermeil ripple ring. 100% waterproof and hypoallergenic.',
                'published',
                '1',
                '1',
                'default',
                '0',
                'Material',
                '18K Gold Vermeil',
                'Size',
                '6, 7, 8',
            ],
            [
                'Floating Pearl Drop Earrings',
                'floating-pearl-drop-earrings',
                'Earrings, Earrings > Hoops',
                'Festive Collection',
                '1499',
                '2999',
                '50',
                '15',
                '1',
                '/storage/media/sample-earrings-1.webp',
                'Lustrous freshwater pearls suspended on 18K solid gold plated sterling silver.',
                'published',
                '1',
                '0',
                'default',
                '0',
                'Gemstone',
                'Freshwater Pearl',
                'Style',
                'Modern',
            ],
        ];

        $callback = function () use ($headers, $samples) {
            $handle = fopen('php://output', 'w');
            // Write UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, $headers);

            foreach ($samples as $sample) {
                fputcsv($handle, $sample);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="haarmonaa-products-import-template.csv"',
        ]);
    }

    /**
     * Preview CSV file contents before committing to database.
     * Supports both Haarmonaa standard CSV and WordPress/WooCommerce product exports.
     */
    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');

        if (! $handle) {
            return response()->json(['success' => false, 'message' => 'Unable to read the CSV file.'], 422);
        }

        $rawHeaders = fgetcsv($handle);
        if (! $rawHeaders) {
            fclose($handle);

            return response()->json(['success' => false, 'message' => 'CSV file appears to be empty.'], 422);
        }

        // Normalize header names
        $headers = array_map(function ($h) {
            $cleaned = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', trim((string) $h));

            return strtolower(str_replace(' ', '_', $cleaned));
        }, $rawHeaders);

        // Required field validation (Supports 'name' AND ('price' OR 'sale_price' OR 'regular_price'))
        $hasName = in_array('name', $headers);
        $hasPrice = in_array('price', $headers) || in_array('sale_price', $headers) || in_array('regular_price', $headers);

        if (! $hasName || ! $hasPrice) {
            fclose($handle);

            return response()->json([
                'success' => false,
                'message' => 'CSV is missing required columns. It must include Product Name ("Name") and Price ("Price" or "Sale price" / "Regular price").',
            ], 422);
        }

        $previewRows = [];
        $validationErrors = [];
        $totalRows = 0;

        while (($row = fgetcsv($handle)) !== false) {
            if (empty(array_filter($row))) {
                continue;
            }

            $totalRows++;
            $rowData = [];
            foreach ($headers as $index => $headerKey) {
                $rowData[$headerKey] = isset($row[$index]) ? trim($row[$index]) : '';
            }

            // Universal price & name extraction
            $name = $rowData['name'] ?? '';
            $salePrice = str_replace([',', '$', '₹', ' '], '', $rowData['sale_price'] ?? '');
            $regularPrice = str_replace([',', '$', '₹', ' '], '', $rowData['regular_price'] ?? '');
            $priceDirect = str_replace([',', '$', '₹', ' '], '', $rowData['price'] ?? '');

            $price = is_numeric($salePrice) && (float) $salePrice > 0
                ? $salePrice
                : (is_numeric($priceDirect) ? $priceDirect : (is_numeric($regularPrice) ? $regularPrice : ''));

            $originalPrice = is_numeric($regularPrice) && (float) $regularPrice > 0
                ? $regularPrice
                : ($rowData['original_price'] ?? $price);

            // Categories extraction
            $category = $rowData['categories'] ?? $rowData['category'] ?? '';

            // Detect attributes in row
            $attributesFound = [];
            foreach ($rowData as $k => $v) {
                if (preg_match('/^attribute_(\d+)_name$/i', $k, $m)) {
                    $attrName = trim($v);
                    $valKey = "attribute_{$m[1]}_value(s)";
                    $attrVal = $rowData[$valKey] ?? $rowData["attribute_{$m[1]}_values"] ?? $rowData["attribute_{$m[1]}_value"] ?? '';
                    if (! empty($attrName) && ! empty($attrVal)) {
                        $attributesFound[] = "{$attrName}: {$attrVal}";
                    }
                }
            }

            $rowErrors = [];
            if (empty($name)) {
                $rowErrors[] = 'Missing Product Name';
            }
            if (! is_numeric($price)) {
                $rowErrors[] = 'Invalid/Missing Price';
            }

            $previewItem = [
                '_row_number' => $totalRows,
                '_errors' => $rowErrors,
                '_is_valid' => empty($rowErrors),
                'name' => $name,
                'category' => $category,
                'collections' => $rowData['collections'] ?? $rowData['tags'] ?? '',
                'price' => $price,
                'original_price' => $originalPrice,
                'images' => $rowData['images'] ?? '',
                'attributes' => implode(' | ', $attributesFound),
                'status' => $rowData['status'] ?? (isset($rowData['published']) && $rowData['published'] == '1' ? 'published' : 'published'),
            ];

            if (! empty($rowErrors)) {
                $validationErrors[] = "Row {$totalRows}: ".implode(', ', $rowErrors);
            }

            if ($totalRows <= 10) {
                $previewRows[] = $previewItem;
            }
        }

        fclose($handle);

        return response()->json([
            'success' => true,
            'headers' => $headers,
            'total_rows' => $totalRows,
            'preview_rows' => $previewRows,
            'error_count' => count($validationErrors),
            'sample_errors' => array_slice($validationErrors, 0, 5),
        ]);
    }

    /**
     * Execute full CSV import (supports WooCommerce & Haarmonaa CSV formats).
     */
    public function execute(Request $request): JsonResponse
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
            'update_existing' => 'nullable|boolean',
            'default_status' => 'nullable|string|in:published,draft',
        ]);

        $updateExisting = (bool) $request->input('update_existing', true);
        $defaultStatus = $request->input('default_status', 'published');

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');

        if (! $handle) {
            return response()->json(['success' => false, 'message' => 'Unable to read the CSV file.'], 422);
        }

        $rawHeaders = fgetcsv($handle);
        $headers = array_map(function ($h) {
            $cleaned = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', trim((string) $h));

            return strtolower(str_replace(' ', '_', $cleaned));
        }, $rawHeaders);

        $createdCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;
        $attributesCount = 0;
        $errors = [];
        $rowNumber = 0;

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($handle)) !== false) {
                if (empty(array_filter($row))) {
                    continue;
                }

                $rowNumber++;
                $data = [];
                foreach ($headers as $index => $headerKey) {
                    $data[$headerKey] = isset($row[$index]) ? trim($row[$index]) : '';
                }

                $name = $data['name'] ?? '';

                // Handle price from 'sale_price', 'price', or 'regular_price'
                $salePriceRaw = str_replace([',', '$', '₹', ' '], '', $data['sale_price'] ?? '');
                $regularPriceRaw = str_replace([',', '$', '₹', ' '], '', $data['regular_price'] ?? '');
                $priceDirectRaw = str_replace([',', '$', '₹', ' '], '', $data['price'] ?? '');

                $price = null;
                $originalPrice = null;

                if (is_numeric($salePriceRaw) && (float) $salePriceRaw > 0) {
                    $price = (float) $salePriceRaw;
                    $originalPrice = is_numeric($regularPriceRaw) && (float) $regularPriceRaw > 0 ? (float) $regularPriceRaw : $price;
                } elseif (is_numeric($priceDirectRaw) && (float) $priceDirectRaw > 0) {
                    $price = (float) $priceDirectRaw;
                    $originalPrice = is_numeric($regularPriceRaw) && (float) $regularPriceRaw > 0 ? (float) $regularPriceRaw : (is_numeric($data['original_price'] ?? '') ? (float) $data['original_price'] : $price);
                } elseif (is_numeric($regularPriceRaw) && (float) $regularPriceRaw > 0) {
                    $price = (float) $regularPriceRaw;
                    $originalPrice = (float) $regularPriceRaw;
                }

                if (empty($name) || $price === null) {
                    $skippedCount++;
                    $errors[] = "Row {$rowNumber}: Skipped due to missing product name or invalid price.";

                    continue;
                }

                // Calculate discount percentage
                $discountPercent = isset($data['discount_percent']) && is_numeric($data['discount_percent'])
                    ? (int) $data['discount_percent']
                    : ($originalPrice > $price ? (int) round((($originalPrice - $price) / $originalPrice) * 100) : 0);

                // Categories Resolution (Supports "Earrings, Earrings > Hoops" or "Rings")
                $rawCategories = $data['categories'] ?? $data['category'] ?? '';
                $categoryId = null;
                $categoryName = 'Jewelry';
                $categoryIds = [];

                if (! empty($rawCategories)) {
                    // Split by comma
                    $catGroups = array_map('trim', explode(',', $rawCategories));
                    foreach ($catGroups as $group) {
                        // If hierarchical like "Earrings > Hoops"
                        $levels = array_map('trim', explode('>', $group));
                        foreach ($levels as $levelName) {
                            if (! empty($levelName)) {
                                $catSlug = Str::slug($levelName);
                                $cat = Category::firstOrCreate(
                                    ['slug' => $catSlug],
                                    ['name' => $levelName, 'is_active' => true]
                                );
                                $categoryIds[] = $cat->id;
                                if (! $categoryId) {
                                    $categoryId = $cat->id;
                                    $categoryName = $cat->name;
                                }
                            }
                        }
                    }
                }

                // Images Resolution (comma or pipe separated URLs)
                $rawImages = $data['images'] ?? '';
                $imagesArray = [];
                if (! empty($rawImages)) {
                    $delimiter = str_contains($rawImages, '|') ? '|' : ',';
                    $parts = explode($delimiter, $rawImages);
                    $imagesArray = array_values(array_filter(array_map('trim', $parts)));
                }

                $primaryImage = $imagesArray[0] ?? null;
                $secondaryImage = $imagesArray[1] ?? $primaryImage;

                // Description (Prefer full Description, fallback to Short description)
                $rawDescription = ! empty($data['description']) ? $data['description'] : ($data['short_description'] ?? '');
                $description = $this->cleanDescription($rawDescription);

                // Stock & Status
                $stockQuantity = isset($data['stock']) && is_numeric($data['stock'])
                    ? (int) $data['stock']
                    : (isset($data['stock_quantity']) && is_numeric($data['stock_quantity']) ? (int) $data['stock_quantity'] : 20);

                $inStock = isset($data['in_stock?'])
                    ? (bool) $data['in_stock?']
                    : (isset($data['in_stock']) ? (bool) in_array(strtolower((string) $data['in_stock']), ['1', 'true', 'yes']) : true);

                $status = isset($data['published'])
                    ? ($data['published'] == '1' ? 'published' : 'draft')
                    : (in_array(strtolower($data['status'] ?? ''), ['published', 'draft']) ? strtolower($data['status']) : $defaultStatus);

                $isFeatured = (isset($data['is_featured?']) && $data['is_featured?'] == '1')
                    || (isset($data['is_featured']) && in_array(strtolower((string) $data['is_featured']), ['1', 'true', 'yes']));

                // Base Slug
                $slug = ! empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($name);

                // Check existing product
                $existingProduct = null;
                if ($updateExisting) {
                    $existingProduct = Product::where('slug', $slug)
                        ->orWhere('name', $name)
                        ->first();
                }

                $productPayload = [
                    'name' => $name,
                    'category_id' => $categoryId,
                    'category_name' => $categoryName,
                    'price' => $price,
                    'original_price' => $originalPrice,
                    'discount_percent' => $discountPercent,
                    'stock_quantity' => $stockQuantity,
                    'in_stock' => $inStock,
                    'description' => $description,
                    'status' => $status,
                    'is_featured' => $isFeatured,
                    'is_best_seller' => isset($data['is_best_seller']) && in_array(strtolower((string) $data['is_best_seller']), ['1', 'true', 'yes']),
                    'shipping_type' => in_array($data['shipping_type'] ?? '', ['default', 'free', 'flat_rate']) ? $data['shipping_type'] : 'default',
                    'shipping_fee' => isset($data['shipping_fee']) && is_numeric($data['shipping_fee']) ? (float) $data['shipping_fee'] : 0,
                ];

                if (! empty($imagesArray)) {
                    $productPayload['image'] = $primaryImage;
                    $productPayload['secondary_image'] = $secondaryImage;
                    $productPayload['images'] = $imagesArray;
                }

                if ($existingProduct) {
                    $existingProduct->update($productPayload);
                    $product = $existingProduct;
                    $updatedCount++;
                } else {
                    $baseSlug = $slug;
                    $counter = 1;
                    while (Product::where('slug', $slug)->exists()) {
                        $slug = "{$baseSlug}-{$counter}";
                        $counter++;
                    }
                    $productPayload['slug'] = $slug;
                    $product = Product::create($productPayload);
                    $createdCount++;
                }

                // Sync Multiple Categories
                if (! empty($categoryIds)) {
                    $product->categories()->syncWithoutDetaching($categoryIds);
                }

                // Collections / Tags Resolution
                $rawCollections = $data['collections'] ?? $data['tags'] ?? '';
                if (! empty($rawCollections)) {
                    $collectionNames = array_map('trim', explode(',', $rawCollections));
                    $collectionIds = [];
                    foreach ($collectionNames as $colName) {
                        if (! empty($colName) && strlen($colName) < 80) {
                            $colSlug = Str::slug($colName);
                            $collection = Collection::firstOrCreate(
                                ['slug' => $colSlug],
                                ['name' => $colName, 'is_active' => true]
                            );
                            $collectionIds[] = $collection->id;
                        }
                    }
                    if (! empty($collectionIds)) {
                        $product->collections()->syncWithoutDetaching($collectionIds);
                    }
                }

                // ==========================================
                // ATTRIBUTES PROCESSING (WordPress / Custom)
                // ==========================================
                $productAttributesData = [];
                foreach ($data as $key => $val) {
                    if (preg_match('/^attribute_(\d+)_name$/i', $key, $matches)) {
                        $idx = $matches[1];
                        $attrName = trim($val);
                        $valKey = "attribute_{$idx}_value(s)";
                        $attrValueStr = $data[$valKey] ?? $data["attribute_{$idx}_values"] ?? $data["attribute_{$idx}_value"] ?? '';

                        if (! empty($attrName) && ! empty($attrValueStr)) {
                            // 1. Create / find Global Attribute
                            $attribute = Attribute::firstOrCreate(
                                ['slug' => Str::slug($attrName)],
                                [
                                    'name' => ucfirst($attrName),
                                    'display_type' => in_array(strtolower($attrName), ['color', 'colour']) ? 'color' : 'button',
                                    'description' => ucfirst($attrName).' attribute imported from catalog',
                                ]
                            );

                            // 2. Create / find Attribute Values
                            $rawVals = array_map('trim', explode(',', $attrValueStr));
                            $storedValues = [];
                            foreach ($rawVals as $v) {
                                if (! empty($v)) {
                                    AttributeValue::firstOrCreate(
                                        [
                                            'attribute_id' => $attribute->id,
                                            'value' => $v,
                                        ],
                                        [
                                            'name' => $v,
                                        ]
                                    );
                                    $storedValues[] = $v;
                                    $attributesCount++;
                                }
                            }

                            if (! empty($storedValues)) {
                                $productAttributesData[$attribute->name] = $storedValues;
                            }
                        }
                    }
                }

                // If attributes exist, save / update default ProductVariant
                if (! empty($productAttributesData)) {
                    $sku = ! empty($data['sku']) ? $data['sku'] : 'HRM-'.Str::upper(Str::random(6));
                    ProductVariant::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'sku' => $sku,
                        ],
                        [
                            'name' => $product->name.' (Default)',
                            'price' => $product->price,
                            'stock_quantity' => $product->stock_quantity,
                            'image' => $product->image,
                            'attributes' => $productAttributesData,
                        ]
                    );
                }
            }

            DB::commit();
            fclose($handle);

            return response()->json([
                'success' => true,
                'created_count' => $createdCount,
                'updated_count' => $updatedCount,
                'skipped_count' => $skippedCount,
                'attributes_count' => $attributesCount,
                'errors' => $errors,
                'message' => "Import complete: {$createdCount} products created, {$updatedCount} updated, {$attributesCount} attributes linked.",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);

            return response()->json([
                'success' => false,
                'message' => 'Import failed on line '.$rowNumber.': '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export all products to CSV.
     */
    public function export(): StreamedResponse
    {
        $headers = [
            'name',
            'slug',
            'category',
            'collections',
            'price',
            'original_price',
            'discount_percent',
            'stock_quantity',
            'in_stock',
            'images',
            'description',
            'status',
            'is_featured',
            'is_best_seller',
            'shipping_type',
            'shipping_fee',
        ];

        $callback = function () use ($headers) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, $headers);

            Product::with(['category', 'collections'])->chunk(100, function ($products) use ($handle) {
                foreach ($products as $p) {
                    $imagesStr = is_array($p->images) && ! empty($p->images)
                        ? implode(', ', $p->images)
                        : ($p->image ? $p->image : '');

                    $collectionsStr = $p->collections->pluck('name')->implode(', ');

                    fputcsv($handle, [
                        $p->name,
                        $p->slug,
                        $p->category ? $p->category->name : $p->category_name,
                        $collectionsStr,
                        $p->price,
                        $p->original_price,
                        $p->discount_percent,
                        $p->stock_quantity,
                        $p->in_stock ? '1' : '0',
                        $imagesStr,
                        $p->description,
                        $p->status,
                        $p->is_featured ? '1' : '0',
                        $p->is_best_seller ? '1' : '0',
                        $p->shipping_type,
                        $p->shipping_fee,
                    ]);
                }
            });

            fclose($handle);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="haarmonaa-products-export-'.date('Y-m-d').'.csv"',
        ]);
    }

    /**
     * Clean and sanitize imported product description.
     */
    private function cleanDescription(?string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // 1. Remove literal escaped sequences like "\r\n", "\n", "\r", "\t" that were exported as text in CSV
        $cleaned = str_replace(['\\r\\n', '\\n', '\\r', '\\t'], ["\n", "\n", "\n", ' '], $html);

        // 2. Remove WordPress block/Gutenberg metadata attributes like data-start="...", data-end="...", data-section-id="..."
        $cleaned = preg_replace('/\s*(data-start|data-end|data-section-id|data-is-last-node|data-is-only-node)="[^"]*"/', '', $cleaned);

        // 3. Remove standalone literal \n text that might be left between tags
        $cleaned = preg_replace('/>\s*\\\\n\s*</', '><', $cleaned);
        $cleaned = preg_replace('/\\\\n/', ' ', $cleaned);

        // 4. Remove empty paragraph tags with only whitespace or newlines
        $cleaned = preg_replace('/<p>\s*<\/p>/', '', $cleaned);

        return trim($cleaned);
    }
}
