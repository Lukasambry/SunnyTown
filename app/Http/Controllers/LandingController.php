<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Affiche la landing page de SunnyTown
     */
    public function index(): Response
    {
        return Inertia::render('Landing/SunnyTownLanding', [
            'meta' => [
                'title' => 'SunnyTown - Construisez votre ville de rêve',
                'description' => 'Découvrez SunnyTown, le jeu de construction de ville en pixel art le plus ensoleillé ! Construisez, cultivez et connectez-vous avec des milliers de joueurs.',
                'keywords' => 'SunnyTown, jeu de ville, pixel art, construction, simulation, farming',
                'og_image' => asset('images/sunnytown-og-image.jpg'),
            ],
            'stats' => [
                'active_players' => '100,000+',
                'cities_created' => '1,000,000+',
                'daily_updates' => true
            ],
            'features' => [
                [
                    'icon' => '🏗️',
                    'title' => 'Construisez',
                    'description' => 'Créez votre ville parfaite avec des centaines de bâtiments et décorations uniques !',
                    'color' => 'dirt'
                ],
                [
                    'icon' => '🌱',
                    'title' => 'Cultivez',
                    'description' => 'Gérez vos fermes, récoltez des ressources et développez votre économie locale !',
                    'color' => 'stone'
                ],
                [
                    'icon' => '👥',
                    'title' => 'Connectez',
                    'description' => 'Rejoignez des milliers de joueurs et partagez vos créations avec la communauté !',
                    'color' => 'gold'
                ]
            ],
            'gameplay_features' => [
                [
                    'icon' => '⭐',
                    'title' => 'Monde Procédural',
                    'description' => 'Explorez des îles générées aléatoirement avec des ressources uniques',
                    'color' => 'gold'
                ],
                [
                    'icon' => '🎯',
                    'title' => 'Missions Épiques',
                    'description' => 'Accomplissez des quêtes variées et débloquez de nouveaux contenus',
                    'color' => 'green'
                ],
                [
                    'icon' => '🏆',
                    'title' => 'Compétitions',
                    'description' => 'Participez à des événements saisonniers et grimpez dans les classements',
                    'color' => 'purple'
                ]
            ],
            'social_links' => [
                'discord' => 'https://discord.gg/sunnytown',
                'twitter' => 'https://twitter.com/sunnytowngame',
                'reddit' => 'https://reddit.com/r/sunnytown',
                'youtube' => 'https://youtube.com/c/sunnytowngame'
            ]
        ]);
    }
    
}