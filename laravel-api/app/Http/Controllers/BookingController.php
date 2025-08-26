<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Activity;
use App\Notifications\NewBookingNotification;
use Illuminate\Support\Facades\Notification;

class BookingController extends Controller
{
    use AuthorizesRequests;
    
    public function index()
    {
        $bookings = Booking::with('activity.owner')
            ->when(auth()->user()->role === 'owner', function ($query) {
                return $query->whereHas('activity', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            })
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email',
            'client_phone' => 'required|string',
            'date' => 'required|date|after:today',
            'guests' => 'required|integer|min:1',
        ]);

        $booking = Booking::create($validated);

        $activity = Activity::with('owner')->find($validated['activity_id']);

        Notification::send($activity->owner, new NewBookingNotification($booking));

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking->load('activity')
        ], 201);
    }

    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);
        
        return response()->json($booking->load('activity'));
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $booking->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking
        ]);
    }

    public function destroy(Booking $booking)
    {
        $this->authorize('delete', $booking);
        
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}