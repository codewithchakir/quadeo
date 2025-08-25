<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'duration',
        'location',
        'image',
    ];

    protected $appends = ['image_urls'];

    public function getImageUrlsAttribute()
    {
        $imagePaths = json_decode($this->image, true) ?? [];
        $urls = [];
        
        foreach ($imagePaths as $path) {
            // Use asset() helper to generate full URL
            $urls[] = asset('storage/' . $path);
        }
        
        return $urls;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}