<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'total_orders',
        'total_spent',
        'avatar',
    ];

    protected $casts = [
        'total_orders' => 'integer',
        'total_spent' => 'float',
    ];
}
