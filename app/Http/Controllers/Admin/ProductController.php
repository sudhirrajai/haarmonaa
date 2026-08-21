<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Collection;
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
        $query = Product::with(['category', 'variants', 'collections'])->latest();

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

        $products = $query->get();
        $categories = Category::all();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->query('search', ''),
                'category' => $request->query('category', 'all'),
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
            'images' => 'nullable|array|max:10',
            'images.*' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'shipping_type' => 'nullable|string|in:default,free,flat_rate,exclude_free_shipping',
            'shipping_fee' => 'nullable|numeric|min:0',
            'variants' => 'nullable|array',
        ]);

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
        $validated['slug'] = Str::slug($validated['name']).'-'.time();

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
            'shipping_type' => 'nullable|string|in:default,free,flat_rate,exclude_free_shipping',
            'shipping_fee' => 'nullable|numeric|min:0',
            'variants' => 'nullable|array',
        ]);

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

    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        $path = $request->file('file')->store('products', 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
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
