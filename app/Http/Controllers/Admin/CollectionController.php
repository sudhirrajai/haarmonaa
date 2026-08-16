<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Collection::with(['products' => function ($q) {
            $q->select('products.id', 'products.name', 'products.image', 'products.price', 'products.category_name');
        }])->withCount('products')->orderBy('sort_order', 'asc')->latest();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('tagline', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $collections = $query->get();
        $products = Product::all(['id', 'name', 'image', 'price', 'category_name', 'in_stock']);

        return Inertia::render('Admin/Collections/Index', [
            'collections' => $collections,
            'products' => $products,
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:1000',
            'banner_image' => 'nullable|string|max:1000',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $baseSlug = $slug;
        $counter = 1;
        while (Collection::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $collection = Collection::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'tagline' => $validated['tagline'] ?? null,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'banner_image' => $validated['banner_image'] ?? null,
            'is_featured' => $validated['is_featured'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        if (! empty($validated['product_ids'])) {
            $syncData = [];
            foreach ($validated['product_ids'] as $idx => $prodId) {
                $syncData[$prodId] = ['sort_order' => $idx];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index')->with('success', 'Collection created successfully with attached products.');
    }

    public function update(Request $request, Collection $collection): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug,'.$collection->id,
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:1000',
            'banner_image' => 'nullable|string|max:1000',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $collection->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'tagline' => $validated['tagline'] ?? null,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? null,
            'banner_image' => $validated['banner_image'] ?? null,
            'is_featured' => $validated['is_featured'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        if (isset($validated['product_ids'])) {
            $syncData = [];
            foreach ($validated['product_ids'] as $idx => $prodId) {
                $syncData[$prodId] = ['sort_order' => $idx];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index')->with('success', 'Collection updated successfully.');
    }

    public function destroy(Collection $collection): RedirectResponse
    {
        $collection->products()->detach();
        $collection->delete();

        return redirect()->route('admin.collections.index')->with('success', 'Collection removed successfully.');
    }
}
