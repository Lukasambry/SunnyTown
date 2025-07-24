<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('blog/Index', [
            'blogPosts' => $posts,
        ]);
    }

    public function create()
    {

        if (!auth()->user() || !auth()->user()->hasRole('admin')) {
            return redirect()->route('blog.index')->with('error', 'Unauthorized access');
        }

        return Inertia::render('blog/Create');
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:140',
            'content' => 'required|string',
            'author' => 'required|string|max:100',
            'published_at' => 'nullable|date',
        ]);

        BlogPost::create($validated);

        return redirect()->route('blog.index');
    }
}
