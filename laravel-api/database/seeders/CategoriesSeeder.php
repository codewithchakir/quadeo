<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Quad Biking'],
            ['name' => 'Camel Riding'],
            ['name' => 'Horse Riding'],
            ['name' => 'Buggy Tours'],
            ['name' => 'Hot Air Balloon'],
            ['name' => 'Paragliding'],
            ['name' => 'Water Sports'],
            ['name' => 'Desert Safari'],
            ['name' => 'Hiking'],
            ['name' => 'Cultural Tours'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('10 categories created successfully!');
    }
}
