<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\Activity;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingOwners()
    {
        return User::where('role', 'owner')->where('status', 'pending')->get();
    }

    public function approveOwner($id)
    {
        $owner = User::where('role', 'owner')->findOrFail($id);

        $owner->update(['status' => 'approved']);
    
        return response()->json(['message' => 'Owner approved successfully']);
    }

    public function rejectOwner($id)
    {
        $owner = User::where('role', 'owner')->findOrFail($id);

        $owner->update(['status' => 'rejected']);
        return response()->json(['message' => 'Owner rejected successfully']);
    }

    public function dashboard()
    {
        $stats = [
            'total_owners' => User::where('role', 'owner')->count(),
            'pending_owners' => User::where('role', 'owner')->where('status', 'pending')->count(),
            'total_activities' => Activity::count(),
            'total_bookings' => Booking::count(),
            'total_revenue' => Booking::where('status', 'completed')
                ->with('activity')
                ->get()
                ->sum(function ($booking) {
                    return $booking->activity->price * $booking->guests;
                }),
        ];

        $recentOwners = User::where('role', 'owner')
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'status', 'created_at']);

        $recentActivities = Activity::with(['owner', 'category'])
            ->latest()
            ->limit(5)
            ->get();

        $recentBookings = Booking::with(['activity', 'activity.owner'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_owners' => $recentOwners,
            'recent_activities' => $recentActivities,
            'recent_bookings' => $recentBookings
        ]);
    }

    public function stats()
    {
        $monthlyBookings = Booking::selectRaw('
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as count,
                SUM(guests) as total_guests
            ')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        $categoryStats = \App\Models\Category::withCount(['activities' => function ($query) {
            $query->whereHas('owner', function ($q) {
                $q->where('status', 'approved');
            });
        }])->get();

        return response()->json([
            'monthly_bookings' => $monthlyBookings,
            'category_stats' => $categoryStats
        ]);
    }
}
