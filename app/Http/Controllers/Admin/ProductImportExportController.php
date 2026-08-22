<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
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
            ],
            [
                'Floating Pearl Drop Earrings',
                'floating-pearl-drop-earrings',
                'Earrings',
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
            ],
            [
                'Celestial Starburst Pendant Necklace',
                'celestial-starburst-pendant-necklace',
                'Necklaces',
                'New Arrivals',
                '1899',
                '3499',
                '46',
                '30',
                '1',
                '/storage/media/sample-necklace-1.webp, /storage/media/sample-necklace-2.webp',
                'Sparkling cubic zirconia center encased in a celestial starburst medallion.',
                'published',
                '0',
                '1',
                'default',
                '0',
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

        // Read header row
        $rawHeaders = fgetcsv($handle);
        if (! $rawHeaders) {
            fclose($handle);

            return response()->json(['success' => false, 'message' => 'CSV file appears to be empty.'], 422);
        }

        // Normalize header names (lowercase, trim, strip quotes/BOM)
        $headers = array_map(function ($h) {
            $cleaned = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', trim((string) $h));

            return strtolower(str_replace(' ', '_', $cleaned));
        }, $rawHeaders);

        // Required headers check
        $requiredHeaders = ['name', 'price'];
        $missingHeaders = array_diff($requiredHeaders, $headers);
        if (! empty($missingHeaders)) {
            fclose($handle);

            return response()->json([
                'success' => false,
                'message' => 'CSV is missing required header(s): '.implode(', ', $missingHeaders),
            ], 422);
        }

        $previewRows = [];
        $validationErrors = [];
        $totalRows = 0;

        while (($row = fgetcsv($handle)) !== false) {
            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }

            $totalRows++;
            $rowData = [];

            foreach ($headers as $index => $headerKey) {
                $rowData[$headerKey] = isset($row[$index]) ? trim($row[$index]) : '';
            }

            // Simple validation check
            $rowErrors = [];
            if (empty($rowData['name'])) {
                $rowErrors[] = 'Missing Product Name';
            }
            if (! isset($rowData['price']) || ! is_numeric(str_replace(',', '', $rowData['price']))) {
                $rowErrors[] = 'Invalid/Missing Price';
            }

            $rowData['_row_number'] = $totalRows;
            $rowData['_errors'] = $rowErrors;
            $rowData['_is_valid'] = empty($rowErrors);

            if (! empty($rowErrors)) {
                $validationErrors[] = "Row {$totalRows}: ".implode(', ', $rowErrors);
            }

            // Only capture the first 10 rows for visual preview
            if ($totalRows <= 10) {
                $previewRows[] = $rowData;
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
     * Execute full CSV import and persist to database.
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
                $rawPrice = str_replace([',', '$', '₹'], '', $data['price'] ?? '');

                if (empty($name) || ! is_numeric($rawPrice)) {
                    $skippedCount++;
                    $errors[] = "Row {$rowNumber}: Skipped due to missing name or invalid price.";

                    continue;
                }

                $price = (float) $rawPrice;
                $rawOriginalPrice = str_replace([',', '$', '₹'], '', $data['original_price'] ?? '');
                $originalPrice = is_numeric($rawOriginalPrice) && (float) $rawOriginalPrice > 0 ? (float) $rawOriginalPrice : $price;

                $discountPercent = isset($data['discount_percent']) && is_numeric($data['discount_percent'])
                    ? (int) $data['discount_percent']
                    : ($originalPrice > $price ? (int) round((($originalPrice - $price) / $originalPrice) * 100) : 0);

                // Category Resolution
                $categoryId = null;
                $categoryName = $data['category'] ?? null;
                if (! empty($categoryName)) {
                    $categorySlug = Str::slug($categoryName);
                    $category = Category::firstOrCreate(
                        ['slug' => $categorySlug],
                        ['name' => $categoryName, 'is_active' => true]
                    );
                    $categoryId = $category->id;
                    $categoryName = $category->name;
                }

                // Images List Resolution (comma or pipe separated)
                $rawImages = $data['images'] ?? '';
                $imagesArray = [];
                if (! empty($rawImages)) {
                    $delimiter = str_contains($rawImages, '|') ? '|' : ',';
                    $parts = explode($delimiter, $rawImages);
                    $imagesArray = array_values(array_filter(array_map('trim', $parts)));
                }

                $primaryImage = $imagesArray[0] ?? null;
                $secondaryImage = $imagesArray[1] ?? $primaryImage;

                // Base Slug
                $slug = ! empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($name);

                // Check for existing product by slug or name
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
                    'stock_quantity' => isset($data['stock_quantity']) && is_numeric($data['stock_quantity']) ? (int) $data['stock_quantity'] : 10,
                    'in_stock' => isset($data['in_stock']) ? (bool) in_array(strtolower($data['in_stock']), ['1', 'true', 'yes']) : true,
                    'description' => $data['description'] ?? '',
                    'status' => in_array(strtolower($data['status'] ?? ''), ['published', 'draft']) ? strtolower($data['status']) : $defaultStatus,
                    'is_featured' => isset($data['is_featured']) && in_array(strtolower($data['is_featured']), ['1', 'true', 'yes']),
                    'is_best_seller' => isset($data['is_best_seller']) && in_array(strtolower($data['is_best_seller']), ['1', 'true', 'yes']),
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
                    // Generate unique slug for new product
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

                // Collections association
                if (! empty($data['collections'])) {
                    $collectionNames = array_map('trim', explode(',', $data['collections']));
                    $collectionIds = [];
                    foreach ($collectionNames as $colName) {
                        if (! empty($colName)) {
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
            }

            DB::commit();
            fclose($handle);

            return response()->json([
                'success' => true,
                'created_count' => $createdCount,
                'updated_count' => $updatedCount,
                'skipped_count' => $skippedCount,
                'errors' => $errors,
                'message' => "Import complete: {$createdCount} created, {$updatedCount} updated, {$skippedCount} skipped.",
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
}
