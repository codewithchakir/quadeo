<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;
use App\Models\Category;
use App\Models\User;

class ActivitiesSeeder extends Seeder
{
    public function run(): void
    {
        $owners = User::where('role', 'owner')->where('status', 'approved')->get();
        $categories = Category::all();

        $activities = [
            [
                'title' => 'Desert Quad Biking Adventure',
                'description' => 'Experience the thrill of quad biking through the beautiful desert landscapes. Suitable for beginners and experts.',
                'price' => 250.00,
                'duration' => '2 hours',
                'location' => 'Marrakech Desert',
            ],
            [
                'title' => 'Sunset Camel Ride',
                'description' => 'Enjoy a peaceful camel ride during sunset in the desert. Perfect for couples and families.',
                'price' => 150.00,
                'duration' => '1.5 hours',
                'location' => 'Sahara Desert',
            ],
            [
                'title' => 'Atlas Mountains Horse Riding',
                'description' => 'Explore the beautiful Atlas Mountains on horseback with experienced guides.',
                'price' => 300.00,
                'duration' => '3 hours',
                'location' => 'Atlas Mountains',
            ],
            [
                'title' => 'Dune Buggy Adventure',
                'description' => 'Drive through sand dunes and experience the excitement of dune buggy riding.',
                'price' => 350.00,
                'duration' => '2.5 hours',
                'location' => 'Agadir Desert',
            ],
            [
                'title' => 'Hot Air Balloon Ride',
                'description' => 'Float above the beautiful landscapes and enjoy breathtaking views from the sky.',
                'price' => 800.00,
                'duration' => '4 hours',
                'location' => 'Marrakech',
            ],
            [
                'title' => 'Coastal Paragliding',
                'description' => 'Soar above the beautiful coastline and experience the freedom of paragliding.',
                'price' => 450.00,
                'duration' => '1 hour',
                'location' => 'Essaouira',
            ],
            [
                'title' => 'Jet Ski & Water Sports',
                'description' => 'Enjoy various water sports including jet skiing, banana boat, and more.',
                'price' => 200.00,
                'duration' => '2 hours',
                'location' => 'Agadir Beach',
            ],
            [
                'title' => 'Traditional Moroccan Cooking Class',
                'description' => 'Learn to cook authentic Moroccan dishes with local chefs.',
                'price' => 180.00,
                'duration' => '3 hours',
                'location' => 'Fes',
            ],
        ];

        $imageUrls = [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
            'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        ];

        foreach ($activities as $index => $activityData) {
            $activity = Activity::create([
                'user_id' => $owners[rand(0, count($owners) - 1)]->id,
                'category_id' => $categories[rand(0, count($categories) - 1)]->id,
                'title' => $activityData['title'],
                'description' => $activityData['description'],
                'price' => $activityData['price'],
                'duration' => $activityData['duration'],
                'location' => $activityData['location'],
                'image' => json_encode($imageUrls),
            ]);
        }

        $this->command->info('Activities created with placeholder images!');
    }
}