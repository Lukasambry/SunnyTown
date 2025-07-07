<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageImage;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        try {
            $validated = $request->validate([
                'thread_id' => 'required|exists:threads,id',
                'content' => 'required|string|min:3',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $thread = Thread::findOrFail($validated['thread_id']);

            $message = new Message();
            $message->thread_id = $thread->id;
            $message->user_id = auth()->id();
            $message->content = $validated['content'];
            $message->save();

            if (!$message->thread_id) {
                throw new \Exception('Thread ID not saved');
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('message_images', 'public');
                    MessageImage::create([
                        'message_id' => $message->id,
                        'path' => $path,
                    ]);
                }
            }

            return redirect()->route('forums.threads.show', [
                'category' => $thread->forumCategory->id,
                'thread' => $thread->id
            ])->with('success', 'Message posté avec succès');

        } catch (\Exception $e) {
            dd('Message creation failed: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la création du message');
        }
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
