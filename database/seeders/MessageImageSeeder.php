<?php

namespace Database\Seeders;

use App\Models\MessageImage;
use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageImageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = Message::inRandomOrder()->take(10)->get();

        $sampleImagePaths = [
            'message_images/sample1.jpg',
            'message_images/sample2.png',
            'message_images/code_snippet.png',
            'message_images/diagram.jpg',
            'message_images/screenshot.png',
            'message_images/architecture.jpg',
            'message_images/mockup.png',
            'message_images/database_schema.png'
        ];

        foreach ($messages as $message) {
            if (rand(1, 100) <= 30) {
                MessageImage::create([
                    'message_id' => $message->id,
                    'path' => $sampleImagePaths[array_rand($sampleImagePaths)]
                ]);
            }
        }
    }
}
