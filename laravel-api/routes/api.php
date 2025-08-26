<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('categories', [CategoryController::class, 'index']);

Route::post('bookings', [BookingController::class, 'store']);

Route::get('/home-data', [PublicController::class, 'homeData']);

Route::get('public/activities', [PublicController::class, 'activities']);
Route::get('public/activities/{activity}', [PublicController::class, 'showActivity']);
Route::get('owners', [PublicController::class, 'owners']);
Route::get('owners/{owner}/activities', [PublicController::class, 'ownerActivities']);

// Authenticated routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('activities', ActivityController::class);
    
    // Bookings management (view, update, delete)
    Route::get('bookings', [BookingController::class, 'index']);
    Route::get('bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);

    // Owner routes
    Route::middleware(['owner'])->prefix('owner')->group(function () {
        Route::get('/dashboard', [OwnerController::class, 'dashboard']);
    });

    // Admin routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/all-owners', [AdminController::class, 'allOwners']);
        Route::get('/pending-owners', [AdminController::class, 'pendingOwners']);
        Route::post('/approve-owner/{id}', [AdminController::class, 'approveOwner']);
        Route::post('/reject-owner/{id}', [AdminController::class, 'rejectOwner']);
        
        // Categories management
        Route::apiResource('categories', CategoryController::class)->except(['index']);
    });
});

// Debug route (optional)
// Route::get('/debug-auth', function (Request $request) {
//     $token = $request->bearerToken();
    
//     if (!$token) {
//         return response()->json(['error' => 'No token provided'], 401);
//     }
    
//     $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
    
//     if (!$tokenModel) {
//         return response()->json(['error' => 'Token not found in database'], 401);
//     }
    
//     return response()->json([
//         'token_exists' => true,
//         'token_id' => $tokenModel->id,
//         'user_id' => $tokenModel->tokenable_id
//     ]);
// });