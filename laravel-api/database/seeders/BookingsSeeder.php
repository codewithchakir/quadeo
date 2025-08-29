<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Activity;
use Carbon\Carbon;

class BookingsSeeder extends Seeder
{
    public function run(): void
    {
        $activities = Activity::all();
        $statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

        $clients = [
            ['name' => 'John Smith', 'email' => 'john@example.com', 'phone' => '+212700000001'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah@example.com', 'phone' => '+212700000002'],
            ['name' => 'Mike Wilson', 'email' => 'mike@example.com', 'phone' => '+212700000003'],
            ['name' => 'Emma Brown', 'email' => 'emma@example.com', 'phone' => '+212700000004'],
            ['name' => 'David Lee', 'email' => 'david@example.com', 'phone' => '+212700000005'],
        ];

        foreach (range(1, 20) as $index) {
            $activity = $activities->random();
            $client = $clients[array_rand($clients)];
            $days = rand(1, 30);
            
            Booking::create([
                'activity_id' => $activity->id,
                'client_name' => $client['name'],
                'client_email' => $client['email'],
                'client_phone' => $client['phone'],
                'date' => Carbon::now()->addDays($days)->format('Y-m-d'),
                'guests' => rand(1, 8),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }

        $this->command->info('20 demo bookings created successfully!');
    }
}