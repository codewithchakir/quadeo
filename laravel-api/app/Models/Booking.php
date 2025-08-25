<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'client_name',
        'client_email',
        'client_phone',
        'date',
        'guests',
        'status',
    ];

    // protected $casts = [
    //     'date' => 'date', 
    // ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
