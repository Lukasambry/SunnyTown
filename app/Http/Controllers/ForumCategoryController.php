<?php

namespace App\Http\Controllers;

use App\Models\ForumCategory;
use Inertia\Inertia;

class ForumCategoryController extends Controller
{
    public function index()
    {
        $categories = ForumCategory::with([
            'threads' => function($q) {
                $q->latest()->take(10);
            },
            'threads.user'
        ])->get();


        return Inertia::render('forum/Index', [
            'categories' => $categories
        ]);
    }

    public function show(ForumCategory $category)
    {
        $threads = $category
            ->threads()
            ->with('user')
            ->latest()
            ->get();

        return Inertia::render('forum/Show', [
            'category' => $category,
            'threads'  => $threads
        ]);
    }
}
