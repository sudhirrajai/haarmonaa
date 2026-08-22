<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Display WordPress-style media library index.
     */
    public function index(Request $request): Response
    {
        $query = Media::query();

        // Search by keyword
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('file_name', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        // Filter by MIME type
        if ($type = $request->input('type')) {
            if ($type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($type === 'video') {
                $query->where('mime_type', 'like', 'video/%');
            } elseif ($type === 'document') {
                $query->where('mime_type', 'like', 'application/%');
            }
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'oldest':
                $query->oldest('id');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'size_desc':
                $query->orderBy('size', 'desc');
                break;
            case 'size_asc':
                $query->orderBy('size', 'asc');
                break;
            default:
                $query->latest('id');
                break;
        }

        $perPage = (int) $request->input('per_page', 24);
        if (! in_array($perPage, [12, 24, 48, 96, 120])) {
            $perPage = 24;
        }

        $mediaList = $query->paginate($perPage)->withQueryString();

        // Overall stats
        $totalCount = Media::count();
        $totalSizeBytes = (int) Media::sum('size');

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = $totalSizeBytes;
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        $formattedTotalSize = round($bytes, 2).' '.($units[$i] ?? 'B');

        return Inertia::render('Admin/Media/Index', [
            'media' => $mediaList,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', 'all'),
                'sort' => $sort,
                'per_page' => $perPage,
                'view' => $request->input('view', 'grid'),
            ],
            'stats' => [
                'total_count' => $totalCount,
                'total_size' => $formattedTotalSize,
            ],
        ]);
    }

    /**
     * Upload single or multiple files to media library.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'files' => 'nullable|array',
            'files.*' => 'file|max:20480', // 20MB max per file
            'file' => 'nullable|file|max:20480',
        ]);

        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            $uploadedFiles = $request->file('files');
        } elseif ($request->hasFile('file')) {
            $uploadedFiles = [$request->file('file')];
        }

        if (empty($uploadedFiles)) {
            if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json(['success' => false, 'message' => 'No files were uploaded.'], 422);
            }

            return back()->with('error', 'No files were selected for upload.');
        }

        $createdMedia = [];

        foreach ($uploadedFiles as $uploadedFile) {
            $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $uploadedFile->getClientOriginalExtension();
            $mimeType = $uploadedFile->getMimeType() ?: 'application/octet-stream';
            $size = $uploadedFile->getSize() ?: 0;

            // Generate clean unique filename
            $slugName = Str::slug($originalName);
            $uniqueFileName = $slugName.'-'.time().'-'.Str::random(6).'.'.$extension;

            // Store inside public storage disk (media folder)
            $path = $uploadedFile->storeAs('media', $uniqueFileName, 'public');
            $publicUrl = Storage::url($path);

            $media = Media::create([
                'name' => $originalName,
                'file_name' => $uniqueFileName,
                'disk' => 'public',
                'mime_type' => $mimeType,
                'size' => $size,
                'url' => $publicUrl,
                'alt_text' => $originalName,
            ]);

            $createdMedia[] = $media;
        }

        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => count($createdMedia).' file(s) uploaded successfully.',
                'media' => $createdMedia,
            ]);
        }

        return back()->with('success', count($createdMedia).' file(s) uploaded successfully to Media Library.');
    }

    /**
     * Update media details (name, alt text).
     */
    public function update(Request $request, Media $media): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'alt_text' => 'nullable|string|max:500',
        ]);

        $media->update($validated);

        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Media updated successfully.',
                'media' => $media,
            ]);
        }

        return back()->with('success', 'Media metadata updated successfully.');
    }

    /**
     * Delete single media file from storage and database.
     */
    public function destroy(Media $media, Request $request): JsonResponse|RedirectResponse
    {
        // Delete physical file
        if (Storage::disk($media->disk)->exists('media/'.$media->file_name)) {
            Storage::disk($media->disk)->delete('media/'.$media->file_name);
        }

        $media->delete();

        if ($request->expectsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Media item deleted successfully.',
            ]);
        }

        return back()->with('success', 'Media file permanently deleted.');
    }

    /**
     * Bulk delete multiple media files.
     */
    public function bulkDestroy(Request $request): JsonResponse|RedirectResponse
    {
        $ids = $request->input('ids', []);
        if (empty($ids) || ! is_array($ids)) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'No media files selected.'], 422);
            }

            return back()->with('error', 'No media items selected.');
        }

        $items = Media::whereIn('id', $ids)->get();
        $count = 0;

        foreach ($items as $item) {
            if (Storage::disk($item->disk)->exists('media/'.$item->file_name)) {
                Storage::disk($item->disk)->delete('media/'.$item->file_name);
            }
            $item->delete();
            $count++;
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => "{$count} media item(s) permanently deleted.",
            ]);
        }

        return back()->with('success', "{$count} media file(s) permanently deleted.");
    }
}
