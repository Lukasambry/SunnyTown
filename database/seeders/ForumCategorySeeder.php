<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumCategory;

class ForumCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name'        => 'Général',
                'description' => 'Discussions générales sur le jeu, annonces communautaires, présentations.',
            ],
            [
                'name'        => 'Guides & Stratégies',
                'description' => 'Tutoriels, conseils et stratégies pour progresser plus vite dans votre idle game.',
            ],
            [
                'name'        => 'Ressources',
                'description' => 'Optimisation de la collecte, échanges de tips sur les ressources du jeu.',
            ],
            [
                'name'        => 'Bâtiments & Infrastructure',
                'description' => 'Tout ce qui concerne l’achat, l’amélioration et la gestion des bâtiments.',
            ],
            [
                'name'        => 'Mécanismes de Jeu',
                'description' => 'Discussions sur les mécaniques idle, automations, scripts, optimisations.',
            ],
            [
                'name'        => 'Bugs & Support',
                'description' => 'Signaler un bug, demander de l’aide ou des précisions techniques.',
            ],
            [
                'name'        => 'Suggestions & Feedback',
                'description' => 'Proposez des améliorations, votez pour de nouvelles fonctionnalités.',
            ],
            [
                'name'        => 'Annonces & Mises à Jour',
                'description' => 'Toutes les news officielles, patch notes et événements à venir.',
            ],
            [
                'name'        => 'Événements',
                'description' => 'Discussions dédiées aux events spéciaux, concours et challenges temporaires.',
            ],
            [
                'name'        => 'Communauté & Guildes',
                'description' => 'Recrutement, organisation de guildes et entraide entre joueurs.',
            ],
        ];

        foreach ($categories as $data) {
            ForumCategory::updateOrCreate(
                ['name' => $data['name']],
                ['description' => $data['description']]
            );
        }
    }
}
