<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageImage;
use App\Models\Thread;
use Illuminate\Http\Request;

class ThreadController extends Controller
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
            'title'               => 'required|string|max:255',
            'forum_category_id'   => 'required|exists:forum_categories,id',
            'content'             => 'required|string',
        ]);

        $thread = Thread::create([
            'title'             => $data['title'],
            'forum_category_id' => $data['forum_category_id'],
            'user_id'           => auth()->id(),
        ]);

        $message = Message::create([
            'thread_id' => $thread->id,
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

         return redirect()->route('threads.show', $thread);
    }

    /**
     * Display the specified resource.
     */
    public function show(Thread $thread)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Thread $thread)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        //
    }
}
