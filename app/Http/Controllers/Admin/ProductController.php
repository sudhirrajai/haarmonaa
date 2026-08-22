<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Media;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $perPage = (int) $request->query('per_page', 10);
        if (! in_array($perPage, [10, 15, 20, 50, 100])) {
            $perPage = 10;
        }

        $query = Product::with(['category', 'variants', 'collections'])->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->query('category') !== 'all') {
            $query->where('category_name', 'like', "%{$request->query('category')}%");
        }

        $products = $query->paginate($perPage)->withQueryString();
        $categories = Category::all();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'statusCounts' => [
                'all' => Product::count(),
                'published' => Product::where('status', 'published')->count(),
                'draft' => Product::where('status', 'draft')->count(),
            ],
            'filters' => [
                'search' => $request->query('search', ''),
                'category' => $request->query('category', 'all'),
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => Category::all(),
            'collections' => Collection::all(['id', 'name']),
            'availableAttributes' => Attribute::with('values')->get(),
            'allProducts' => Product::select('id', 'name', 'price', 'image')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'collection_ids' => 'nullable|array',
            'collection_ids.*' => 'exists:collections,id',
            'upsell_ids' => 'nullable|array',
            'upsell_ids.*' => 'exists:products,id',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'image' => 'nullable|string',
            'secondary_image' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'status' => 'nullable|string|in:published,draft',
            'shipping_type' => 'nullable|string|in:default,free,flat_rate,exclude_free_shipping',
            'shipping_fee' => 'nullable|numeric|min:0',
            'variants' => 'nullable|array',
        ]);

        $validated['status'] = $validated['status'] ?? 'published';

        $imagesList = array_values(array_filter($request->input('images', [])));
        if (empty($imagesList) && ! empty($validated['image'])) {
            $imagesList[] = $validated['image'];
            if (! empty($validated['secondary_image'])) {
                $imagesList[] = $validated['secondary_image'];
            }
        }

        if (! empty($imagesList)) {
            $validated['images'] = $imagesList;
            $validated['image'] = $imagesList[0];
            $validated['secondary_image'] = $imagesList[1] ?? $imagesList[0];
        } elseif (empty($validated['image'])) {
            $validated['image'] = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
        }

        $categoryIds = $validated['category_ids'];
        $collectionIds = $validated['collection_ids'] ?? [];
        $categories = Category::whereIn('id', $categoryIds)->get();
        $primaryCategory = $categories->first();

        $validated['category_id'] = $primaryCategory ? $primaryCategory->id : null;
        $validated['category_name'] = $categories->pluck('name')->join(', ');

        $baseSlug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        $variants = $validated['variants'] ?? [];
        unset($validated['category_ids'], $validated['collection_ids'], $validated['variants']);

        $product = Product::create($validated);
        $product->categories()->sync($categoryIds);
        if (! empty($collectionIds)) {
            $product->collections()->sync($collectionIds);
        }

        // Store Variants
        if (! empty($variants)) {
            foreach ($variants as $v) {
                $product->variants()->create([
                    'name' => $v['name'] ?? null,
                    'sku' => $v['sku'] ?? (strtoupper(substr($product->slug, 0, 4)).'-'.rand(100, 999)),
                    'price' => ! empty($v['price']) ? (float) $v['price'] : $product->price,
                    'stock_quantity' => isset($v['stock_quantity']) ? (int) $v['stock_quantity'] : 20,
                    'image' => $v['image'] ?? $product->image,
                    'attributes' => $v['attributes'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['categories', 'variants', 'collections']);
        $productData = $product->toArray();
        $productData['category_ids'] = $product->categories->pluck('id')->all();
        if (empty($productData['category_ids']) && $product->category_id) {
            $productData['category_ids'] = [$product->category_id];
        }
        $productData['collection_ids'] = $product->collections->pluck('id')->all();
        $productData['upsell_ids'] = $product->upsell_ids ?: [];
        if (empty($productData['images'])) {
            $productData['images'] = array_values(array_filter([$product->image, $product->secondary_image]));
        }

        return Inertia::render('Admin/Products/Form', [
            'product' => $productData,
            'categories' => Category::all(),
            'collections' => Collection::all(['id', 'name']),
            'availableAttributes' => Attribute::with('values')->get(),
            'allProducts' => Product::where('id', '!=', $product->id)->select('id', 'name', 'price', 'image')->get(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,'.$product->id,
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'collection_ids' => 'nullable|array',
            'collection_ids.*' => 'exists:collections,id',
            'upsell_ids' => 'nullable|array',
            'upsell_ids.*' => 'exists:products,id',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'image' => 'nullable|string',
            'secondary_image' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'status' => 'nullable|string|in:published,draft',
            'shipping_type' => 'nullable|string|in:default,free,flat_rate,exclude_free_shipping',
            'shipping_fee' => 'nullable|numeric|min:0',
            'variants' => 'nullable|array',
        ]);

        $validated['status'] = $validated['status'] ?? ($product->status ?? 'published');

        if (! empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['slug']);
        } elseif (empty($product->slug) || preg_match('/-\d{8,12}$/', $product->slug)) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $imagesList = array_values(array_filter($request->input('images', [])));
        if (empty($imagesList) && ! empty($validated['image'])) {
            $imagesList[] = $validated['image'];
            if (! empty($validated['secondary_image'])) {
                $imagesList[] = $validated['secondary_image'];
            }
        }

        if (! empty($imagesList)) {
            $validated['images'] = $imagesList;
            $validated['image'] = $imagesList[0];
            $validated['secondary_image'] = $imagesList[1] ?? $imagesList[0];
        } elseif (empty($validated['image'])) {
            $validated['image'] = $product->image;
        }

        $categoryIds = $validated['category_ids'];
        $collectionIds = $validated['collection_ids'] ?? [];
        $categories = Category::whereIn('id', $categoryIds)->get();
        $primaryCategory = $categories->first();

        $validated['category_id'] = $primaryCategory ? $primaryCategory->id : null;
        $validated['category_name'] = $categories->pluck('name')->join(', ');

        $variants = $validated['variants'] ?? [];
        unset($validated['category_ids'], $validated['collection_ids'], $validated['variants']);

        $product->update($validated);
        $product->categories()->sync($categoryIds);
        $product->collections()->sync($collectionIds);

        // Update Variants
        $product->variants()->delete();
        if (! empty($variants)) {
            foreach ($variants as $v) {
                $product->variants()->create([
                    'name' => $v['name'] ?? null,
                    'sku' => $v['sku'] ?? (strtoupper(substr($product->slug, 0, 4)).'-'.rand(100, 999)),
                    'price' => ! empty($v['price']) ? (float) $v['price'] : $product->price,
                    'stock_quantity' => isset($v['stock_quantity']) ? (int) $v['stock_quantity'] : 20,
                    'image' => $v['image'] ?? $product->image,
                    'attributes' => $v['attributes'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|string|in:delete,publish,draft',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ]);

        $count = count($validated['product_ids']);

        if ($validated['action'] === 'delete') {
            Product::whereIn('id', $validated['product_ids'])->delete();

            return back()->with('success', "Successfully deleted {$count} products.");
        }

        if ($validated['action'] === 'publish') {
            Product::whereIn('id', $validated['product_ids'])->update(['status' => 'published']);

            return back()->with('success', "Successfully published {$count} products to storefront.");
        }

        if ($validated['action'] === 'draft') {
            Product::whereIn('id', $validated['product_ids'])->update(['status' => 'draft']);

            return back()->with('success', "Successfully set {$count} products to draft.");
        }

        return back();
    }

    public function toggleStatus(Product $product, Request $request)
    {
        $newStatus = $product->status === 'draft' ? 'published' : 'draft';
        $product->update(['status' => $newStatus]);

        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'status' => $newStatus,
                'message' => "Product status changed to {$newStatus}.",
            ]);
        }

        return back()->with('success', "Product status changed to {$newStatus}.");
    }

    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        $uploadedFile = $request->file('file');
        $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $uploadedFile->getClientOriginalExtension();
        $mimeType = $uploadedFile->getMimeType() ?: 'image/jpeg';
        $size = $uploadedFile->getSize() ?: 0;

        $slugName = Str::slug($originalName);
        $uniqueFileName = $slugName.'-'.time().'-'.Str::random(6).'.'.$extension;

        $path = $uploadedFile->storeAs('media', $uniqueFileName, 'public');
        $url = Storage::url($path);

        // Index in Media table so it appears in the Media Library
        $media = Media::create([
            'name' => $originalName,
            'file_name' => $uniqueFileName,
            'disk' => 'public',
            'mime_type' => $mimeType,
            'size' => $size,
            'url' => $url,
            'alt_text' => $originalName,
        ]);

        return response()->json([
            'success' => true,
            'url' => $url,
            'media' => $media,
        ]);
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    public function toggleFeatured(Product $product, Request $request)
    {
        $product->update([
            'is_featured' => ! $product->is_featured,
        ]);

        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'is_featured' => (bool) $product->is_featured,
                'message' => 'Product featured status updated successfully.',
            ]);
        }

        return back()->with('success', 'Product featured status updated successfully.');
    }
}
