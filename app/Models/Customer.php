<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'state',
        'postal_code',
        'address',
        'status',
        'notes',
        'total_orders',
        'total_spent',
        'avatar',
    ];

    protected $casts = [
        'total_orders' => 'integer',
        'total_spent' => 'float',
    ];
}
