# 🚀 Activity Booking Platform API - Complete Documentation

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Authentication](#-authentication-endpoints)
3. [Public Endpoints](#-public-endpoints)
4. [Owner Endpoints](#-owner-endpoints)
5. [Admin Endpoints](#-admin-endpoints)
6. [Data Models](#-data-models)
7. [Error Handling](#-error-handling)
8. [Setup & Deployment](#-setup--deployment)

---

## 🌟 Overview

A comprehensive REST API for an activity booking platform that connects activity providers (owners) with clients. Built with **Laravel 11** and **Sanctum authentication**.

### 🎯 Key Features

-   **Role-based access control** (Admin, Owner, Client)
-   **Admin approval system** for new activity providers
-   **Token-based authentication** with Laravel Sanctum
-   **Image upload support** for activities
-   **Real-time dashboard analytics**
-   **Public browsing** for clients
-   **Booking management system**

### 👥 User Roles

| Role       | Access Level        | Description                                               |
| ---------- | ------------------- | --------------------------------------------------------- |
| **Admin**  | Full system access  | Manages categories, approves owners, views all data       |
| **Owner**  | Restricted access   | Manages their own activities and bookings                 |
| **Client** | Read-only + booking | Browses activities and makes bookings (no account needed) |

---

## 🔐 Authentication Endpoints

### 1. Register as Owner

```http
POST /api/register
Content-Type: application/json
```

**Request:**

```json
{
    "name": "Adventure Company",
    "email": "adventure@example.com",
    "phone": "+1234567890",
    "password": "securepassword123",
    "password_confirmation": "securepassword123"
}
```

**Response (201 Created):**

```json
{
    "message": "Registration successful, Waiting for approval.",
    "user": {
        "id": 5,
        "name": "Adventure Company",
        "email": "adventure@example.com",
        "phone": "+1234567890",
        "role": "owner",
        "status": "pending",
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z"
    }
}
```

### 2. Login

```http
POST /api/login
Content-Type: application/json
```

**Request:**

```json
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

**Response (200 OK):**

```json
{
    "token": "1|XcZ9yL8kPqR2sT5vW7xYzAbCdEfGhIjKl",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "phone": "+1234567890",
        "role": "admin",
        "status": "approved",
        "created_at": "2024-01-15T09:00:00.000000Z",
        "updated_at": "2024-01-15T09:00:00.000000Z"
    }
}
```

**Error Response (403 Forbidden - Pending Owner):**

```json
{
    "message": "Account pending approval"
}
```

### 3. Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
    "message": "Logged out successfully"
}
```

### 4. Get Current User

```http
GET /api/user
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
    "id": 2,
    "name": "John Doe",
    "email": "owner@example.com",
    "phone": "+1234567890",
    "role": "owner",
    "status": "approved",
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
}
```

---

## 🌐 Public Endpoints (No Authentication Required)

### 1. Get Homepage Data

```http
GET /api/home-data
```

**Response (200 OK):**

```json
{
    "categories": [
        {
            "id": 1,
            "name": "Quad Biking",
            "activities_count": 8,
            "created_at": "2024-01-15T09:15:00.000000Z",
            "updated_at": "2024-01-15T09:15:00.000000Z"
        }
    ],
    "featured_activities": [
        {
            "id": 1,
            "title": "Desert Quad Adventure",
            "price": 150.0,
            "duration": "2 hours",
            "location": "Dubai Desert",
            "image": ["activities/quad1.jpg", "activities/quad2.jpg"],
            "category": {
                "id": 1,
                "name": "Quad Biking"
            },
            "owner": {
                "id": 2,
                "name": "Desert Adventures Co."
            }
        }
    ],
    "stats": {
        "total_activities": 25,
        "total_owners": 12,
        "total_categories": 6
    }
}
```

### 2. Browse Activities with Filters

```http
GET /api/public/activities
GET /api/public/activities?category_id=1&location=Dubai&min_price=50&max_price=200
```

**Response (200 OK):**

```json
{
    "data": [
        {
            "id": 1,
            "title": "Desert Quad Adventure",
            "description": "Experience the thrill of quad biking in the desert",
            "price": 150.0,
            "duration": "2 hours",
            "location": "Dubai Desert",
            "image": ["activities/quad1.jpg"],
            "category": {
                "id": 1,
                "name": "Quad Biking"
            },
            "owner": {
                "id": 2,
                "name": "Desert Adventures Co.",
                "email": "contact@desertadventures.com"
            },
            "created_at": "2024-01-15T10:00:00.000000Z"
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 3,
        "per_page": 12,
        "total": 25
    }
}
```

### 3. Get Single Activity

```http
GET /api/public/activities/1
```

**Response (200 OK):**

```json
{
    "id": 1,
    "title": "Desert Quad Adventure",
    "description": "Experience the thrill of quad biking in the desert...",
    "price": 150.0,
    "duration": "2 hours",
    "location": "Dubai Desert",
    "image": ["activities/quad1.jpg", "activities/quad2.jpg"],
    "category": {
        "id": 1,
        "name": "Quad Biking",
        "created_at": "2024-01-15T09:15:00.000000Z"
    },
    "owner": {
        "id": 2,
        "name": "Desert Adventures Co.",
        "email": "contact@desertadventures.com",
        "phone": "+1234567890"
    },
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
}
```

### 4. List Approved Owners

```http
GET /api/owners
```

**Response (200 OK):**

```json
[
    {
        "id": 2,
        "name": "Desert Adventures Co.",
        "email": "contact@desertadventures.com",
        "phone": "+1234567890",
        "activities_count": 5,
        "created_at": "2024-01-15T10:00:00.000000Z"
    }
]
```

### 5. Get Owner's Activities

```http
GET /api/owners/2/activities
```

**Response (200 OK):**

```json
{
    "owner": {
        "id": 2,
        "name": "Desert Adventures Co.",
        "email": "contact@desertadventures.com",
        "phone": "+1234567890"
    },
    "activities": [
        {
            "id": 1,
            "title": "Desert Quad Adventure",
            "price": 150.0,
            "duration": "2 hours",
            "location": "Dubai Desert",
            "category": {
                "id": 1,
                "name": "Quad Biking"
            },
            "created_at": "2024-01-15T10:00:00.000000Z"
        }
    ]
}
```

### 6. Create Booking (Client)

```http
POST /api/bookings
Content-Type: application/json
```

**Request:**

```json
{
    "activity_id": 1,
    "client_name": "Sarah Johnson",
    "client_email": "sarah@example.com",
    "client_phone": "+1555123456",
    "date": "2024-01-20",
    "guests": 2
}
```

**Response (201 Created):**

```json
{
    "message": "Booking created successfully",
    "booking": {
        "id": 10,
        "activity_id": 1,
        "client_name": "Sarah Johnson",
        "client_email": "sarah@example.com",
        "client_phone": "+1555123456",
        "date": "2024-01-20",
        "guests": 2,
        "status": "pending",
        "created_at": "2024-01-15T11:00:00.000000Z",
        "updated_at": "2024-01-15T11:00:00.000000Z",
        "activity": {
            "id": 1,
            "title": "Desert Quad Adventure",
            "price": 150.0
        }
    }
}
```

### 7. Get Categories

```http
GET /api/categories
```

**Response (200 OK):**

```json
[
    {
        "id": 1,
        "name": "Quad Biking",
        "activities_count": 8,
        "created_at": "2024-01-15T09:15:00.000000Z",
        "updated_at": "2024-01-15T09:15:00.000000Z"
    }
]
```

---

## 👨‍💼 Owner Endpoints (Requires Owner Token)

### 1. Owner Dashboard

```http
GET /api/owner/dashboard
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
{
    "stats": {
        "total_activities": 5,
        "total_bookings": 23,
        "pending_bookings": 3,
        "revenue": 3450.0
    },
    "recent_bookings": [
        {
            "id": 10,
            "client_name": "Sarah Johnson",
            "client_email": "sarah@example.com",
            "date": "2024-01-20",
            "guests": 2,
            "status": "confirmed",
            "activity": {
                "id": 1,
                "title": "Desert Quad Adventure",
                "price": 150.0
            },
            "created_at": "2024-01-15T11:00:00.000000Z"
        }
    ],
    "recent_activities": [
        {
            "id": 1,
            "title": "Desert Quad Adventure",
            "price": 150.0,
            "bookings_count": 15,
            "created_at": "2024-01-15T10:00:00.000000Z"
        }
    ]
}
```

### 2. Manage Activities

#### List Owner's Activities

```http
GET /api/activities
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
[
    {
        "id": 1,
        "title": "Desert Quad Adventure",
        "description": "Experience the thrill of quad biking...",
        "price": 150.0,
        "duration": "2 hours",
        "location": "Dubai Desert",
        "image": ["activities/quad1.jpg"],
        "category": {
            "id": 1,
            "name": "Quad Biking"
        },
        "owner": {
            "id": 2,
            "name": "Desert Adventures Co."
        },
        "created_at": "2024-01-15T10:00:00.000000Z",
        "updated_at": "2024-01-15T10:00:00.000000Z"
    }
]
```

#### Create Activity

```http
POST /api/activities
Authorization: Bearer {owner_token}
Content-Type: multipart/form-data
```

**Request (Form Data):**

```
category_id: 1
title: Sunset Camel Ride
description: Enjoy a peaceful camel ride during sunset
price: 75.00
duration: 1 hour
location: Desert Camp, Dubai
images[]: [file1, file2] (optional)
```

**Response (201 Created):**

```json
{
    "message": "Activity created successfully",
    "activity": {
        "id": 3,
        "user_id": 2,
        "category_id": 2,
        "title": "Sunset Camel Ride",
        "description": "Enjoy a peaceful camel ride during sunset",
        "price": 75.0,
        "duration": "1 hour",
        "location": "Desert Camp, Dubai",
        "image": ["activities/camel1.jpg"],
        "created_at": "2024-01-15T12:00:00.000000Z",
        "updated_at": "2024-01-15T12:00:00.000000Z",
        "category": {
            "id": 2,
            "name": "Camel Riding"
        }
    }
}
```

#### Get Activity Details

```http
GET /api/activities/1
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
{
    "id": 1,
    "title": "Desert Quad Adventure",
    "description": "Experience the thrill of quad biking...",
    "price": 150.0,
    "duration": "2 hours",
    "location": "Dubai Desert",
    "image": ["activities/quad1.jpg", "activities/quad2.jpg"],
    "category": {
        "id": 1,
        "name": "Quad Biking"
    },
    "owner": {
        "id": 2,
        "name": "Desert Adventures Co."
    },
    "bookings": [
        {
            "id": 1,
            "client_name": "John Smith",
            "date": "2024-01-18",
            "guests": 2,
            "status": "confirmed"
        }
    ],
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
}
```

#### Update Activity

```http
PUT /api/activities/1
Authorization: Bearer {owner_token}
Content-Type: application/json
```

**Request:**

```json
{
    "category_id": 1,
    "title": "Desert Quad Adventure Pro",
    "description": "Premium desert quad biking experience",
    "price": 180.0,
    "duration": "2.5 hours",
    "location": "Premium Desert Camp, Dubai"
}
```

**Response (200 OK):**

```json
{
    "message": "Activity updated successfully",
    "activity": {
        "id": 1,
        "title": "Desert Quad Adventure Pro",
        "price": 180.0,
        "duration": "2.5 hours",
        "location": "Premium Desert Camp, Dubai",
        "category": {
            "id": 1,
            "name": "Quad Biking"
        }
    }
}
```

#### Delete Activity

```http
DELETE /api/activities/1
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
{
    "message": "Activity deleted successfully"
}
```

### 3. Manage Bookings

#### List Bookings

```http
GET /api/bookings
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
[
    {
        "id": 10,
        "activity_id": 1,
        "client_name": "Sarah Johnson",
        "client_email": "sarah@example.com",
        "client_phone": "+1555123456",
        "date": "2024-01-20",
        "guests": 2,
        "status": "pending",
        "created_at": "2024-01-15T11:00:00.000000Z",
        "updated_at": "2024-01-15T11:00:00.000000Z",
        "activity": {
            "id": 1,
            "title": "Desert Quad Adventure",
            "price": 150.0
        }
    }
]
```

#### Get Booking Details

```http
GET /api/bookings/10
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
{
    "id": 10,
    "activity_id": 1,
    "client_name": "Sarah Johnson",
    "client_email": "sarah@example.com",
    "client_phone": "+1555123456",
    "date": "2024-01-20",
    "guests": 2,
    "status": "pending",
    "created_at": "2024-01-15T11:00:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z",
    "activity": {
        "id": 1,
        "title": "Desert Quad Adventure",
        "price": 150.0,
        "duration": "2 hours",
        "location": "Dubai Desert"
    }
}
```

#### Update Booking Status

```http
PATCH /api/bookings/10/status
Authorization: Bearer {owner_token}
Content-Type: application/json
```

**Request:**

```json
{
    "status": "confirmed"
}
```

**Response (200 OK):**

```json
{
    "message": "Booking status updated successfully",
    "booking": {
        "id": 10,
        "status": "confirmed",
        "updated_at": "2024-01-15T11:30:00.000000Z"
    }
}
```

#### Delete Booking

```http
DELETE /api/bookings/10
Authorization: Bearer {owner_token}
```

**Response (200 OK):**

```json
{
    "message": "Booking deleted successfully"
}
```

---

## 👑 Admin Endpoints (Requires Admin Token)

### 1. Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
    "stats": {
        "total_owners": 15,
        "pending_owners": 3,
        "total_activities": 42,
        "total_bookings": 156,
        "total_revenue": 23450.0
    },
    "recent_owners": [
        {
            "id": 5,
            "name": "Adventure Company",
            "email": "adventure@example.com",
            "status": "pending",
            "created_at": "2024-01-15T10:30:00.000000Z"
        }
    ],
    "recent_activities": [
        {
            "id": 25,
            "title": "Sunset Camel Ride",
            "price": 75.0,
            "location": "Desert Camp",
            "owner": {
                "id": 2,
                "name": "Desert Adventures Co."
            },
            "category": {
                "id": 2,
                "name": "Camel Riding"
            },
            "created_at": "2024-01-15T12:00:00.000000Z"
        }
    ],
    "recent_bookings": [
        {
            "id": 156,
            "client_name": "Sarah Johnson",
            "date": "2024-01-20",
            "guests": 2,
            "status": "confirmed",
            "activity": {
                "id": 1,
                "title": "Desert Quad Adventure",
                "owner": {
                    "id": 2,
                    "name": "Desert Adventures Co."
                }
            },
            "created_at": "2024-01-15T11:00:00.000000Z"
        }
    ]
}
```

### 2. Analytics

```http
GET /api/admin/stats
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
    "monthly_bookings": [
        {
            "year": 2024,
            "month": 1,
            "count": 45,
            "total_guests": 92
        }
    ],
    "category_stats": [
        {
            "id": 1,
            "name": "Quad Biking",
            "activities_count": 18
        },
        {
            "id": 2,
            "name": "Camel Riding",
            "activities_count": 12
        }
    ]
}
```

### 3. Manage Pending Owners

#### Get Pending Owners

```http
GET /api/admin/pending-owners
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
[
    {
        "id": 5,
        "name": "Adventure Company",
        "email": "adventure@example.com",
        "phone": "+1234567890",
        "created_at": "2024-01-15T10:30:00.000000Z"
    }
]
```

#### Approve Owner

```http
POST /api/admin/approve-owner/5
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
    "message": "Owner approved successfully"
}
```

#### Reject Owner

```http
POST /api/admin/reject-owner/5
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
    "message": "Owner rejected successfully"
}
```

### 4. Manage Categories

#### Create Category

```http
POST /api/admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
    "name": "Water Sports"
}
```

**Response (201 Created):**

```json
{
    "message": "Category created successfully",
    "category": {
        "id": 6,
        "name": "Water Sports",
        "created_at": "2024-01-15T13:00:00.000000Z",
        "updated_at": "2024-01-15T13:00:00.000000Z"
    }
}
```

#### Update Category

```http
PUT /api/admin/categories/6
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
    "name": "Water Activities"
}
```

**Response (200 OK):**

```json
{
    "message": "Category updated successfully",
    "category": {
        "id": 6,
        "name": "Water Activities",
        "updated_at": "2024-01-15T13:15:00.000000Z"
    }
}
```

#### Delete Category

```http
DELETE /api/admin/categories/6
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
    "message": "Category deleted successfully"
}
```

**Error Response (422 Unprocessable Entity):**

```json
{
    "message": "Cannot delete category with associated activities"
}
```

---

## 🗂️ Data Models

### User Model

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "$2y$12$...",
    "role": "owner",
    "status": "approved",
    "remember_token": null,
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
}
```

### Activity Model

```json
{
    "id": 1,
    "user_id": 2,
    "category_id": 1,
    "title": "Desert Quad Adventure",
    "description": "Experience the thrill of quad biking...",
    "price": 150.0,
    "duration": "2 hours",
    "location": "Dubai Desert",
    "image": "[\"activities/quad1.jpg\", \"activities/quad2.jpg\"]",
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z"
}
```

### Booking Model

```json
{
    "id": 1,
    "activity_id": 1,
    "client_name": "Sarah Johnson",
    "client_email": "sarah@example.com",
    "client_phone": "+1555123456",
    "date": "2024-01-20",
    "guests": 2,
    "status": "confirmed",
    "created_at": "2024-01-15T11:00:00.000000Z",
    "updated_at": "2024-01-15T11:30:00.000000Z"
}
```

### Category Model

```json
{
    "id": 1,
    "name": "Quad Biking",
    "created_at": "2024-01-15T09:15:00.000000Z",
    "updated_at": "2024-01-15T09:15:00.000000Z"
}
```

---

## ❌ Error Handling

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

### Unauthenticated (401)

```json
{
    "message": "Unauthenticated."
}
```

### Forbidden (403)

```json
{
    "message": "Admin access required"
}
```

### Not Found (404)

```json
{
    "message": "Activity not found"
}
```

### Authorization Error (403)

```json
{
    "message": "This action is unauthorized."
}
```

---

## 🛠️ Setup & Deployment

### 1. Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Database Setup

```bash
php artisan migrate
php artisan db:seed
```

### 3. Sanctum Setup

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 4. Storage Setup

```bash
php artisan storage:link
```

### 5. Create Admin User

```bash
php artisan tinker
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin',
    'status' => 'approved',
    'phone' => '+1234567890'
]);
```

### 6. Environment Variables

```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=activity_platform
DB_USERNAME=root
DB_PASSWORD=

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,::1
```

### 7. Testing

```bash
php artisan serve
# Test endpoints with Postman or curl
```

---

## 📊 Rate Limiting

-   **Public endpoints**: 60 requests/minute
-   **Authenticated endpoints**: 120 requests/minute
-   **Admin endpoints**: 240 requests/minute

---

## 🔄 Webhook Events

The API emits events for:

-   `OwnerRegistered` - New owner registration
-   `OwnerApproved` - Owner approved by admin
-   `BookingCreated` - New booking made
-   `BookingStatusUpdated` - Booking status changed
-   `ActivityCreated` - New activity added

---

This comprehensive API provides a complete solution for managing an activity booking platform with robust authentication, authorization, and business logic for all user roles. The modular structure ensures scalability and maintainability.
