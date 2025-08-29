<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '+212600000000',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'approved',
        ]);

        $this->command->info('Admin user created successfully!');
    }
}
