<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ActivityController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $activities = Activity::with(['category', 'owner'])
            ->when(auth()->user()->role === 'owner', function ($query) {
                return $query->where('user_id', auth()->id());
            })
            ->latest()
            ->get();

        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string',
            'location' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('activities', 'public');
                $imagePaths[] = $path;
            }
        }

        $activity = Activity::create([
            'user_id' => auth()->id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration' => $validated['duration'],
            'location' => $validated['location'],
            'image' => $imagePaths ? json_encode($imagePaths) : null,
        ]);

        return response()->json([
            'message' => 'Activity created successfully',
            'activity' => $activity->load('category')
        ], 201);
    }

    public function show(Activity $activity)
    {
        $this->authorize('view', $activity);

        return response()->json($activity->load(['category', 'owner', 'bookings']));
    }

    public function update(Request $request, Activity $activity)
    {
        $this->authorize('update', $activity);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string',
            'location' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = json_decode($activity->image, true) ?? [];
        if ($request->hasFile('images')) {
            foreach ($imagePaths as $oldImage) {
                Storage::disk('public')->delete($oldImage);
            }

            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('activities', 'public');
                $imagePaths[] = $path;
            }
        }

        $activity->update([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration' => $validated['duration'],
            'location' => $validated['location'],
            'image' => $imagePaths ? json_encode($imagePaths) : null,
        ]);

        return response()->json([
            'message' => 'Activity updated successfully',
            'activity' => $activity->load('category')
        ]);
    }

    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);

        if ($activity->image) {
            $images = json_decode($activity->image, true);
            if (is_array($images)) {
                foreach ($images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }
        }

        $activity->delete();
        return response()->json(['message' => 'Activity deleted successfully']);
    }
}