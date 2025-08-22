<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Booking;

class OwnerController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();

        $stats = [
            'total_activities' => Activity::where('user_id', $user->id)->count(),
            'total_bookings' => Booking::whereHas('activity', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count(),
            'pending_bookings' => Booking::whereHas('activity', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->where('status', 'pending')->count(),
            'revenue' => Booking::whereHas('activity', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->where('status', 'completed')
            ->with('activity')
            ->get()
            ->sum(function ($booking) {
                return $booking->activity->price * $booking->guests;
            }),
        ];

        $recentBookings = Booking::whereHas('activity', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('activity')
            ->latest()
            ->limit(5)
            ->get();

        $activities = Activity::where('user_id', $user->id)
            ->withCount('bookings')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
            'recent_activities' => $activities
        ]);
    }
}