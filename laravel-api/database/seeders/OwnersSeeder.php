<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class OwnersSeeder extends Seeder
{
    public function run(): void
    {
        $owners = [
            [
                'name' => 'Desert Adventures',
                'email' => 'desert@example.com',
                'phone' => '+212611111111',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'approved',
            ],
            [
                'name' => 'Mountain Explorers',
                'email' => 'mountain@example.com',
                'phone' => '+212622222222',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'approved',
            ],
            [
                'name' => 'Ocean Activities',
                'email' => 'ocean@example.com',
                'phone' => '+212633333333',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'approved',
            ],
            [
                'name' => 'Sky Adventures',
                'email' => 'sky@example.com',
                'phone' => '+212644444444',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'approved',
            ],
            [
                'name' => 'Cultural Experiences',
                'email' => 'cultural@example.com',
                'phone' => '+212655555555',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'approved',
            ],
            // Pending owners
            [
                'name' => 'Pending Adventures 1',
                'email' => 'pending1@example.com',
                'phone' => '+212666666666',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'pending',
            ],
            [
                'name' => 'Pending Adventures 2',
                'email' => 'pending2@example.com',
                'phone' => '+212677777777',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'pending',
            ],
            [
                'name' => 'Pending Adventures 3',
                'email' => 'pending3@example.com',
                'phone' => '+212688888888',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'status' => 'pending',
            ],
        ];

        foreach ($owners as $owner) {
            User::create($owner);
        }

        $this->command->info('8 owner accounts created (5 approved, 3 pending)!');
    }
}