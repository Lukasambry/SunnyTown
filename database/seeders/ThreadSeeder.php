<?php

namespace Database\Seeders;

use App\Models\Thread;
use App\Models\ForumCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ThreadSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ForumCategory::all();
        $users = User::all();

        $threads = [
            [
                'title' => 'Bienvenue sur notre forum !',
                'category_name' => 'Général',
                'content' => 'Bienvenue à tous sur notre nouveau forum de discussion. N\'hésitez pas à vous présenter et à partager vos expériences !'
            ],
            [
                'title' => 'Règles du forum',
                'category_name' => 'Général',
                'content' => 'Voici les règles à respecter sur notre forum pour maintenir un environnement respectueux et constructif.'
            ],

            [
                'title' => 'Meilleures pratiques en développement web 2025',
                'category_name' => 'Développement Web',
                'content' => 'Quelles sont selon vous les meilleures pratiques à adopter en développement web en 2025 ?'
            ],
            [
                'title' => 'Comparaison des frameworks CSS modernes',
                'category_name' => 'Développement Web',
                'content' => 'Tailwind vs Bootstrap vs Bulma : quel framework CSS choisir pour son projet ?'
            ],

            [
                'title' => 'Laravel 11 : les nouveautés',
                'category_name' => 'Laravel',
                'content' => 'Découvrons ensemble les nouvelles fonctionnalités de Laravel 11 et comment les utiliser dans nos projets.'
            ],
            [
                'title' => 'Optimisation des performances avec Eloquent',
                'category_name' => 'Laravel',
                'content' => 'Comment optimiser les requêtes Eloquent pour améliorer les performances de votre application Laravel ?'
            ],
            [
                'title' => 'Middleware personnalisé : bonnes pratiques',
                'category_name' => 'Laravel',
                'content' => 'Partageons nos expériences sur la création de middleware personnalisé dans Laravel.'
            ],

            [
                'title' => 'Vue 3 vs React : avantages et inconvénients',
                'category_name' => 'JavaScript',
                'content' => 'Débat : Vue 3 ou React pour un nouveau projet ? Quels sont vos arguments ?'
            ],
            [
                'title' => 'Gestion d\'état avec Pinia',
                'category_name' => 'JavaScript',
                'content' => 'Comment bien structurer la gestion d\'état dans une application Vue.js avec Pinia ?'
            ],

            [
                'title' => 'Optimisation des requêtes MySQL',
                'category_name' => 'Bases de données',
                'content' => 'Techniques d\'optimisation pour améliorer les performances de vos requêtes MySQL.'
            ],
            [
                'title' => 'Migration de MySQL vers PostgreSQL',
                'category_name' => 'Bases de données',
                'content' => 'Retour d\'expérience sur une migration de MySQL vers PostgreSQL.'
            ],

            [
                'title' => 'Docker pour les développeurs Laravel',
                'category_name' => 'DevOps',
                'content' => 'Configuration Docker optimale pour le développement d\'applications Laravel.'
            ],
            [
                'title' => 'CI/CD avec GitHub Actions',
                'category_name' => 'DevOps',
                'content' => 'Mise en place d\'un pipeline CI/CD efficace avec GitHub Actions.'
            ],

            [
                'title' => 'Tendances design 2025',
                'category_name' => 'Design & UX',
                'content' => 'Quelles sont les tendances en matière de design web à surveiller en 2025 ?'
            ],

            [
                'title' => 'Problème d\'installation de Laravel',
                'category_name' => 'Aide & Support',
                'content' => 'J\'ai des difficultés à installer Laravel sur mon environnement local. Quelqu\'un peut-il m\'aider ?'
            ]
        ];

        foreach ($threads as $threadData) {
            $category = $categories->where('name', $threadData['category_name'])->first();
            $user = $users->random();

            if ($category) {
                Thread::create([
                    'title' => $threadData['title'],
                    'forum_category_id' => $category->id,
                    'user_id' => $user->id,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(0, 5))
                ]);
            }
        }
    }
}
