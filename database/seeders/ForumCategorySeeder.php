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
                'name' => 'Annonces Officielles',
                'description' => 'Nouvelles du jeu, mises à jour et événements spéciaux'
            ],
            [
                'name' => 'Aide & Tutoriels',
                'description' => 'Guides pour débuter, astuces et stratégies de jeu'
            ],
            [
                'name' => 'Gestion de Ville',
                'description' => 'Conseils pour optimiser votre ville et vos ressources'
            ],
            [
                'name' => 'Exploitation Forestière',
                'description' => 'Tout sur l\'abattage, la gestion des forêts et le bois'
            ],
            [
                'name' => 'Agriculture & Récoltes',
                'description' => 'Cultures, fermes et optimisation agricole'
            ],
            [
                'name' => 'Mines & Ressources',
                'description' => 'Exploitation minière, minerais rares et techniques d\'extraction'
            ],
            [
                'name' => 'Commerce & Économie',
                'description' => 'Stratégies commerciales, prix du marché et profits'
            ],
            [
                'name' => 'Construction & Architecture',
                'description' => 'Planification urbaine, bâtiments et aménagements'
            ],
            [
                'name' => 'Screenshots & Créations',
                'description' => 'Partagez vos plus belles villes et créations'
            ],
            [
                'name' => 'Événements Communautaires',
                'description' => 'Concours, défis et événements entre joueurs'
            ],
            [
                'name' => 'Suggestions & Idées',
                'description' => 'Proposez vos idées pour améliorer SunnyTown'
            ],
            [
                'name' => 'Discussion Générale',
                'description' => 'Discussions libres sur SunnyTown et autres sujets'
            ]
        ];

        foreach ($categories as $category) {
            ForumCategory::create($category);
        }
    }
}
