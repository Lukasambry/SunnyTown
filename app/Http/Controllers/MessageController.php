<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageImage;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'thread_id' => 'required|exists:threads,id',
            'content'   => 'required|string',
        ]);

        $message = Message::create([
            'thread_id' => $data['thread_id'],
            'user_id'   => auth()->id(),
            'content'   => $data['content'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('message_images', 'public');

                MessageImage::create([
                    'message_id' => $message->id,
                    'path'       => $path,
                ]);
            }
        }

        return redirect()->route('threads.show', $data['thread_id']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
