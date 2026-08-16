<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AttributeController extends Controller
{
    public function index(): Response
    {
        $attributes = Attribute::with('values')->latest()->get();

        return Inertia::render('Admin/Attributes/Index', [
            'attributes' => $attributes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'display_type' => 'required|in:color_swatch,button_pill,select_dropdown',
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Attribute::create($validated);

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute created successfully.');
    }

    public function update(Request $request, Attribute $attribute): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'display_type' => 'required|in:color_swatch,button_pill,select_dropdown',
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $attribute->update($validated);

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute): RedirectResponse
    {
        $attribute->delete();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute deleted successfully.');
    }

    public function storeValue(Request $request, Attribute $attribute): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'nullable|string|max:255',
            'color_code' => 'nullable|string|max:50',
            'swatch_image' => 'nullable|string',
        ]);

        $attribute->values()->create($validated);

        return back()->with('success', "Attribute value '{$validated['name']}' added.");
    }

    public function destroyValue(AttributeValue $value): RedirectResponse
    {
        $value->delete();

        return back()->with('success', 'Attribute value deleted.');
    }
}
