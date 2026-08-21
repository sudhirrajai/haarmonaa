<?php

namespace App\Mail;

use App\Models\Customer;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerBlockedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $storeName;

    public string $storeEmail;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Customer $customer,
        public ?string $reason = null
    ) {
        $this->storeName = Setting::get('store_name', 'Haarmonaa Fine Jewelry');
        $this->storeEmail = Setting::get('store_email', 'support@haarmonaa.in');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Important Account Notice — {$this->storeName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: '
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px; color: #1f2937;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0;">'.htmlspecialchars($this->storeName).'</h1>
                        <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">Account Status Notification</p>
                    </div>

                    <p style="font-size: 14px; line-height: 1.6;">Dear '.htmlspecialchars($this->customer->name).',</p>

                    <p style="font-size: 14px; line-height: 1.6;">We are writing to inform you that your account on <strong>'.htmlspecialchars($this->storeName).'</strong> has been temporarily suspended / blocked.</p>

                    '.($this->reason ? '
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 18px 0; border-radius: 4px;">
                        <strong style="color: #991b1b; font-size: 13px; display: block; margin-bottom: 4px;">Reason for Suspension:</strong>
                        <p style="color: #7f1d1d; font-size: 13px; margin: 0; line-height: 1.5;">'.nl2br(htmlspecialchars($this->reason)).'</p>
                    </div>
                    ' : '').'

                    <p style="font-size: 14px; line-height: 1.6;">If you believe this action was taken in error, or if you would like to resolve this issue, please contact our concierge team at <a href="mailto:'.htmlspecialchars($this->storeEmail).'" style="color: #b91c1c; font-weight: bold;">'.htmlspecialchars($this->storeEmail).'</a>.</p>

                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />

                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">&copy; '.date('Y').' '.htmlspecialchars($this->storeName).'. All rights reserved.</p>
                </div>
            '
        );
    }
}
