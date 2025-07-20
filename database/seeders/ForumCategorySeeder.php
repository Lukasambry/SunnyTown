<?php

namespace Database\Seeders;

use App\Models\ForumCategory;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Général',
                'description' => 'Discussions générales sur tous les sujets'
            ],
            [
                'name' => 'Développement Web',
                'description' => 'Discussions sur le développement web, frameworks, langages'
            ],
            [
                'name' => 'Laravel',
                'description' => 'Tout ce qui concerne le framework Laravel'
            ],
            [
                'name' => 'JavaScript',
                'description' => 'Discussions sur JavaScript, Vue.js, React, Node.js'
            ],
            [
                'name' => 'Bases de données',
                'description' => 'MySQL, PostgreSQL, MongoDB et autres SGBD'
            ],
            [
                'name' => 'DevOps',
                'description' => 'Déploiement, Docker, CI/CD, serveurs'
            ],
            [
                'name' => 'Design & UX',
                'description' => 'Interface utilisateur, expérience utilisateur, design'
            ],
            [
                'name' => 'Aide & Support',
                'description' => 'Demandes d\'aide et support technique'
            ]
        ];

        foreach ($categories as $category) {
            ForumCategory::create($category);
        }
    }
}
