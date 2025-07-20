<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Introduction à Laravel 11',
                'content' => 'Laravel 11 apporte de nombreuses nouveautés et améliorations. Dans cet article, nous explorerons les fonctionnalités les plus importantes et comment les utiliser dans vos projets. Laravel continue d\'évoluer pour offrir une expérience de développement toujours plus agréable et productive.',
                'author' => 'Admin User',
                'published_at' => now()->subDays(5)
            ],
            [
                'title' => 'Optimisation des performances avec Eloquent',
                'content' => 'L\'ORM Eloquent de Laravel est puissant mais peut devenir un goulot d\'étranglement si mal utilisé. Découvrez les techniques d\'optimisation : eager loading, requêtes raw, indexation, cache de requêtes, et bien plus encore pour améliorer drastiquement les performances de vos applications.',
                'author' => 'John Doe',
                'published_at' => now()->subDays(10)
            ],
            [
                'title' => 'Vue.js 3 et la Composition API',
                'content' => 'La Composition API de Vue.js 3 révolutionne la façon d\'écrire des composants Vue. Elle offre une meilleure réutilisabilité du code, une meilleure organisation logique et un support TypeScript amélioré. Apprenez à migrer vos composants existants et à tirer parti de cette nouvelle approche.',
                'author' => 'Jane Smith',
                'published_at' => now()->subDays(15)
            ],
            [
                'title' => 'Sécurité web : les bonnes pratiques en 2025',
                'content' => 'La sécurité web évolue constamment. En 2025, il est crucial de maîtriser les dernières techniques de protection : CSP, HTTPS partout, authentification forte, protection CSRF, validation rigoureuse, et bien d\'autres aspects essentiels pour sécuriser vos applications web.',
                'author' => 'Alice Johnson',
                'published_at' => now()->subDays(20)
            ],
            [
                'title' => 'Docker pour le développement Laravel',
                'content' => 'Docker simplifie grandement l\'environnement de développement Laravel. Découvrez comment configurer un stack complet avec PHP, MySQL, Redis et Nginx, comment gérer les volumes pour le développement, et les meilleures pratiques pour optimiser vos conteneurs.',
                'author' => 'Bob Wilson',
                'published_at' => now()->subDays(25)
            ],
            [
                'title' => 'API REST avec Laravel Sanctum',
                'content' => 'Laravel Sanctum offre une solution simple et élégante pour l\'authentification d\'API. Apprenez à créer des API sécurisées, gérer les tokens, implémenter l\'authentification SPA, et protéger vos endpoints avec les bonnes pratiques de sécurité.',
                'author' => 'Admin User',
                'published_at' => now()->subDays(30)
            ],
            [
                'title' => 'Tests automatisés avec PHPUnit et Pest',
                'content' => 'Les tests automatisés sont essentiels pour maintenir la qualité du code. Découvrez PHPUnit et Pest, deux outils complémentaires pour Laravel. Apprenez à écrire des tests efficaces, mocker les dépendances, et intégrer les tests dans votre workflow de développement.',
                'author' => 'John Doe',
                'published_at' => now()->subDays(35)
            ],
            [
                'title' => 'Déploiement moderne avec GitHub Actions',
                'content' => 'L\'intégration continue et le déploiement continu sont devenus indispensables. GitHub Actions permet d\'automatiser vos workflows de déploiement. Découvrez comment configurer un pipeline robuste pour vos applications Laravel, de la validation du code au déploiement en production.',
                'author' => 'Jane Smith',
                'published_at' => now()->subDays(40)
            ],
            [
                'title' => 'Microservices avec Laravel',
                'content' => 'L\'architecture microservices gagne en popularité. Laravel peut parfaitement s\'adapter à cette approche. Explorez les patterns, la communication entre services, la gestion des données distribuées, et les défis spécifiques de cette architecture avec l\'écosystème Laravel.',
                'author' => 'Alice Johnson',
                'published_at' => now()->subDays(45)
            ],
            [
                'title' => 'État de l\'art du frontend en 2025',
                'content' => 'Le paysage frontend évolue rapidement. En 2025, quelles sont les technologies incontournables ? React, Vue, Svelte, les meta-frameworks, les outils de build, la gestion d\'état... Faisons le point sur l\'écosystème frontend moderne et les tendances à suivre.',
                'author' => 'Bob Wilson',
                'published_at' => now()->subDays(50)
            ]
        ];

        foreach ($posts as $post) {
            BlogPost::create($post);
        }

        $drafts = [
            [
                'title' => 'GraphQL vs REST : le débat continue',
                'content' => 'Brouillon d\'article comparant GraphQL et REST API...',
                'author' => 'Admin User',
                'published_at' => null
            ],
            [
                'title' => 'Machine Learning avec PHP',
                'content' => 'Exploration des possibilités de ML en PHP...',
                'author' => 'John Doe',
                'published_at' => null
            ]
        ];

        foreach ($drafts as $draft) {
            BlogPost::create($draft);
        }
    }
}
