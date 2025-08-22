<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking)
    {
        return $user->role === 'admin' || $booking->activity->user_id === $user->id;
    }

    public function update(User $user, Booking $booking)
    {
        return $booking->activity->user_id === $user->id;
    }

    public function delete(User $user, Booking $booking)
    {
        return $booking->activity->user_id === $user->id;
    }
}