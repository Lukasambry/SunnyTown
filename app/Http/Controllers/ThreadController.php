<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use App\Models\Thread;
use App\Models\Message;
use App\Models\MessageImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ThreadController extends Controller
{
    public function show(ForumCategory $category, Thread $thread)
    {
        $thread->load(['messages.user', 'user', 'forumCategory']);
        return Inertia::render('threads/Show', [
        'category' => $category,
        'thread' => $thread,
    ]);
    }

    public function create(ForumCategory $category)
    {
        return Inertia::render('threads/Create', [
            'category' => $category,
        ]);
    }


    public function store(Request $request, ForumCategory $category)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,gif|max:2048',
        ]);

        $thread = $category->threads()->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'user_id'             => auth()->id(),
            'slug' => Str::slug($data['title']) . '-' . uniqid(),
        ]);

        $message = $thread->messages()->create([
            'user_id' => auth()->id(),
            'content' => $data['content'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('message_images', 'public');
                $message->images()->create([
                    'path' => $path,
                ]);
            }
        }

        return redirect()->route('forums.threads.show', [
            'category' => $category->id,
            'thread' => $thread->id,
        ]);
    }
}
