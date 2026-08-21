<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\SearchKeyword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Log a user search keyword and return updated trending suggestions.
     */
    public function log(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $resultsCount = (int) $request->input('results_count', 0);

        if (! empty($query) && is_string($query)) {
            SearchKeyword::recordSearch($query, $resultsCount);
        }

        return response()->json([
            'success' => true,
            'popular' => SearchKeyword::getPopular(8),
        ]);
    }

    /**
     * Get top trending/popular search keywords.
     */
    public function popular(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'popular' => SearchKeyword::getPopular(8),
        ]);
    }
}
