<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Booking - ' . $this->booking->activity->title)
            ->line('You have a new booking for: ' . $this->booking->activity->title)
            ->line('Date: ' . $this->booking->date)
            ->line('Client: ' . $this->booking->client_name)
            ->line('Guests: ' . $this->booking->guests)
            ->line('Total: DH' . number_format($this->booking->activity->price * $this->booking->guests, 2))
            ->action('View Booking', url('/bookings/' . $this->booking->id))
            ->line('Thank you');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
