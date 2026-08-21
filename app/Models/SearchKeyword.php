<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class SearchKeyword extends Model
{
    protected $fillable = [
        'keyword',
        'hits_count',
        'results_count',
        'last_searched_at',
    ];

    protected $casts = [
        'last_searched_at' => 'datetime',
        'hits_count' => 'integer',
        'results_count' => 'integer',
    ];

    /**
     * Curated Fine Jewelry Fallback Keywords.
     */
    public const DEFAULT_KEYWORDS = [
        'Gold Necklace',
        'Solitaire Ring',
        'Diamond Earrings',
        'Pearl Choker',
        '18K Gold Bracelet',
        'Anti-Tarnish Anklet',
        'Gemstone Pendant',
        'Statement Hoops',
    ];

    /**
     * Record a user search query.
     */
    public static function recordSearch(string $query, int $resultsCount = 0): void
    {
        $clean = trim(mb_strtolower($query));
        if (mb_strlen($clean) < 2 || mb_strlen($clean) > 80) {
            return;
        }

        // Title Case display name
        $display = ucwords($clean);

        try {
            if (! Schema::hasTable('search_keywords')) {
                return;
            }

            $record = static::firstOrCreate(
                ['keyword' => $display],
                ['hits_count' => 0, 'results_count' => $resultsCount, 'last_searched_at' => now()]
            );

            $record->increment('hits_count');
            $record->update([
                'results_count' => $resultsCount,
                'last_searched_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // Silently ignore DB errors during background tracking
        }
    }

    /**
     * Retrieve top searched keywords with smart jewelry fallbacks.
     *
     * @return array<string>
     */
    public static function getPopular(int $limit = 8): array
    {
        try {
            if (! Schema::hasTable('search_keywords')) {
                return self::DEFAULT_KEYWORDS;
            }

            $popular = static::orderByDesc('hits_count')
                ->orderByDesc('last_searched_at')
                ->limit($limit)
                ->pluck('keyword')
                ->all();

            if (empty($popular)) {
                return self::DEFAULT_KEYWORDS;
            }

            // If we have fewer than limit, merge with defaults without duplicates
            if (count($popular) < $limit) {
                $merged = array_unique(array_merge($popular, self::DEFAULT_KEYWORDS));

                return array_values(array_slice($merged, 0, $limit));
            }

            return $popular;
        } catch (\Throwable $e) {
            return self::DEFAULT_KEYWORDS;
        }
    }
}
