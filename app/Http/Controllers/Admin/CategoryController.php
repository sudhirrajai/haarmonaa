<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 12);
        if (! in_array($perPage, [12, 24, 48, 100])) {
            $perPage = 12;
        }

        $query = Category::with(['parent', 'children'])->withCount('products');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($parentId = $request->input('parent_id')) {
            if ($parentId === 'parents_only') {
                $query->whereNull('parent_id');
            } elseif ($parentId === 'subcategories_only') {
                $query->whereNotNull('parent_id');
            } elseif (is_numeric($parentId)) {
                $query->where('parent_id', (int) $parentId);
            }
        }

        $categories = $query->orderBy('name', 'asc')->paginate($perPage)->withQueryString();

        $allCategories = Category::select('id', 'name', 'parent_id', 'slug')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'allCategories' => $allCategories,
            'filters' => [
                'search' => $request->input('search', ''),
                'parent_id' => $request->input('parent_id', ''),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        Category::create($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value && (int) $value === (int) $category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                    // Check if selected parent is a descendant of this category
                    if ($value) {
                        $descendantIds = $category->children()->pluck('id')->toArray();
                        if (in_array((int) $value, $descendantIds)) {
                            $fail('Cannot assign a subcategory as the parent.');
                        }
                    }
                },
            ],
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);
        if ($slug !== $category->slug) {
            $originalSlug = $slug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Nullify parent_id for any children so they become main categories, or let DB cascade
        $category->children()->update(['parent_id' => null]);
        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
