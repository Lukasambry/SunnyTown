<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\ForumCategory;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $latestBlogPosts = BlogPost::whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->take(3)
            ->get(['id', 'title', 'content', 'author', 'published_at', 'created_at'])
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'excerpt' => $this->generateExcerpt($post->content, 120),
                    'author' => $post->author,
                    'published_at' => $post->published_at?->format('d M Y'),
                    'read_time' => $this->calculateReadTime($post->content)
                ];
            });

        $recentThreads = Thread::with(['user:id,name', 'forumCategory:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'title', 'user_id', 'forum_category_id', 'created_at'])
            ->map(function ($thread) {
                return [
                    'id' => $thread->id,
                    'title' => $thread->title,
                    'author' => $thread->user->name ?? 'Anonyme',
                    'category' => $thread->forumCategory->name ?? 'Général',
                    'category_id' => $thread->forum_category_id,
                    'created_at' => $thread->created_at->diffForHumans(),
                    'url' => route('forums.threads.show', [
                        'category' => $thread->forum_category_id,
                        'thread' => $thread->id
                    ])
                ];
            });

        $stats = [
            'total_players' => User::count(),
            'active_players' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'total_threads' => Thread::count(),
            'total_posts' => BlogPost::whereNotNull('published_at')->count(),
            'community_growth' => $this->calculateGrowthPercentage()
        ];

        $gameFeatures = [
            [
                'icon' => '🏗️',
                'title' => 'Construire sa ville',
                'description' => 'Créez votre ville parfaite avec des centaines de bâtiments et décorations uniques en pixel art !',
                'color' => 'orange',
                'stats' => '200+ bâtiments'
            ],
            [
                'icon' => '🌱',
                'title' => 'Gérer ses ressources',
                'description' => 'Cultivez, récoltez et échangez des ressources pour développer votre économie locale.',
                'color' => 'green',
                'stats' => '50+ ressources'
            ],
            [
                'icon' => '👥',
                'title' => 'Communauté active',
                'description' => 'Rejoignez des milliers de joueurs et partagez vos créations avec la communauté !',
                'color' => 'blue',
                'stats' => $stats['total_players'] . '+ joueurs'
            ],
            [
                'icon' => '🎯',
                'title' => 'Missions épiques',
                'description' => 'Accomplissez des quêtes variées et débloquez de nouveaux contenus exclusifs.',
                'color' => 'purple',
                'stats' => '100+ quêtes'
            ]
        ];

        $recentNews = [
            [
                'title' => 'Mise à jour Hiver 2025',
                'description' => 'Nouvelle saison avec des décorations festives et des événements spéciaux !',
                'date' => '15 Déc 2024',
                'type' => 'update',
                'featured' => true
            ],
            [
                'title' => 'Nouveau système de guildes',
                'description' => 'Créez ou rejoignez une guilde pour des défis communautaires.',
                'date' => '28 Nov 2024',
                'type' => 'feature',
                'featured' => false
            ],
            [
                'title' => 'Événement Halloween - Résultats',
                'description' => 'Félicitations aux gagnants du concours de décoration Halloween !',
                'date' => '5 Nov 2024',
                'type' => 'event',
                'featured' => false
            ]
        ];

        $playerTestimonials = [
            [
                'name' => 'Marie L.',
                'avatar' => '👩‍🌾',
                'rating' => 5,
                'comment' => 'SunnyTown est le jeu parfait pour se détendre ! J\'adore créer ma petite ville.',
                'level' => 42
            ],
            [
                'name' => 'Pierre K.',
                'avatar' => '👨‍🎨',
                'rating' => 5,
                'comment' => 'La communauté est fantastique et les mises à jour régulières gardent le jeu frais !',
                'level' => 67
            ],
            [
                'name' => 'Luna S.',
                'avatar' => '👧',
                'rating' => 5,
                'comment' => 'Mon premier jeu de gestion et je suis complètement accro ! Interface super intuitive.',
                'level' => 28
            ]
        ];

        $forumCategories = ForumCategory::withCount('threads')
            ->take(4)
            ->get(['id', 'name', 'description'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'thread_count' => $category->threads_count,
                    'url' => route('forums.categories.show', $category->id)
                ];
            });

        return Inertia::render('home/Index', [
            'pageData' => [
                'title' => 'SunnyTown - Construisez votre ville de rêve',
                'description' => 'Découvrez SunnyTown, le jeu de construction de ville en pixel art. Construisez, cultivez et connectez-vous avec une communauté de joueurs passionnés.',
                'meta' => [
                    'keywords' => 'SunnyTown, jeu de ville, pixel art, construction, simulation, communauté',
                    'og_image' => asset('images/sunnytown-home-banner.jpg'),
                ]
            ],
            'gameStats' => $stats,
            'gameFeatures' => $gameFeatures,
            'latestNews' => $recentNews,
            'blogPosts' => $latestBlogPosts,
            'forumThreads' => $recentThreads,
            'forumCategories' => $forumCategories,
            'playerTestimonials' => $playerTestimonials,
            'socialLinks' => [
                'discord' => 'https://discord.gg/sunnytown',
                'twitter' => 'https://twitter.com/sunnytowngame',
                'reddit' => 'https://reddit.com/r/sunnytown',
                'youtube' => 'https://youtube.com/c/sunnytowngame'
            ],
            'ctaButtons' => [
                'primary' => [
                    'text' => 'Jouer maintenant',
                    'url' => route('game.index'),
                    'style' => 'primary'
                ],
                'secondary' => [
                    'text' => 'Rejoindre le forum',
                    'url' => route('forums.index'),
                    'style' => 'secondary'
                ]
            ]
        ]);
    }

    private function generateExcerpt(string $content, int $length = 120): string
    {
        $plainText = strip_tags($content);
        if (strlen($plainText) <= $length) {
            return $plainText;
        }

        return substr($plainText, 0, $length) . '...';
    }

    private function calculateReadTime(string $content): string
    {
        $wordCount = str_word_count(strip_tags($content));
        $readTime = ceil($wordCount / 200);

        return $readTime . ' min de lecture';
    }

    private function calculateGrowthPercentage(): float
    {
        $thisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
        $lastMonth = User::whereBetween('created_at', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth()
        ])->count();

        if ($lastMonth === 0) {
            return $thisMonth > 0 ? 100.0 : 0.0;
        }

        return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1);
    }
}
