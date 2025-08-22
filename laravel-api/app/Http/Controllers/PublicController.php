<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function activities(Request $request)
    {
        $query = Activity::with(['category', 'owner'])
            ->whereHas('owner', function ($q) {
                $q->where('status', 'approved');
            });

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $activities = $query->latest()->paginate(12);

        return response()->json([
            'data' => $activities->items(),
            'meta' => [
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'per_page' => $activities->perPage(),
                'total' => $activities->total(),
            ]
        ]);
    }

    public function showActivity(Activity $activity)
    {
        if ($activity->owner->status !== 'approved') {
            return response()->json(['message' => 'Activity not found'], 404);
        }

        return response()->json($activity->load(['category', 'owner']));
    }

    public function owners()
    {
        $owners = User::where('role', 'owner')
            ->where('status', 'approved')
            ->withCount('activities')
            ->latest()
            ->get(['id', 'name', 'email', 'phone', 'created_at']);

        return response()->json($owners);
    }

    public function ownerActivities($ownerId)
    {
        $owner = User::where('id', $ownerId)
            ->where('role', 'owner')
            ->where('status', 'approved')
            ->firstOrFail();

        $activities = Activity::where('user_id', $ownerId)
            ->with('category')
            ->latest()
            ->get();

        return response()->json([
            'owner' => $owner->only(['id', 'name', 'email', 'phone']),
            'activities' => $activities
        ]);
    }

    public function homeData()
    {
        $categories = Category::withCount(['activities' => function ($query) {
            $query->whereHas('owner', function ($q) {
                $q->where('status', 'approved');
            });
        }])->latest()->get();

        $featuredActivities = Activity::with(['category', 'owner'])
            ->whereHas('owner', function ($q) {
                $q->where('status', 'approved');
            })
            ->inRandomOrder()
            ->limit(8)
            ->get();

        $stats = [
            'total_activities' => Activity::whereHas('owner', function ($q) {
                $q->where('status', 'approved');
            })->count(),
            'total_owners' => User::where('role', 'owner')
                ->where('status', 'approved')
                ->count(),
            'total_categories' => Category::count(),
        ];

        return response()->json([
            'categories' => $categories,
            'featured_activities' => $featuredActivities,
            'stats' => $stats
        ]);
    }
}