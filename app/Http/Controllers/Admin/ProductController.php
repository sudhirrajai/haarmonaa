<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'image' => 'required|string',
            'secondary_image' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'variants' => 'nullable|array',
        ]);

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

        return Inertia::render('Admin/Products/Form', [
            'product' => $productData,
            'categories' => Category::all(),
            'collections' => Collection::all(['id', 'name']),
            'availableAttributes' => Attribute::with('values')->get(),
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
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'image' => 'required|string',
            'secondary_image' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'in_stock' => 'boolean',
            'is_featured' => 'boolean',
            'is_best_seller' => 'boolean',
            'variants' => 'nullable|array',
        ]);

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

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
