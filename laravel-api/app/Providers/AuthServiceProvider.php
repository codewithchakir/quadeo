<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\Booking;
use App\Policies\ActivityPolicy;
use App\Policies\BookingPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
// use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    // public function register(): void
    // {
    //     //
    // }

    protected $policies = [
        Activity::class => ActivityPolicy::class,
        Booking::class => BookingPolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
