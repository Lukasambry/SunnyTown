<?php

namespace Database\Seeders;

use App\Models\Thread;
use App\Models\ForumCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class ThreadSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ForumCategory::all();
        $users = User::all();

        $threads = [
            [
                'title' => '🎉 Bienvenue dans SunnyTown !',
                'category_name' => 'Annonces Officielles',
                'content' => 'Bienvenue dans votre nouvelle aventure à SunnyTown ! Commencez par abattre quelques arbres, plantez vos premières cultures et regardez votre petite ville grandir. N\'hésitez pas à partager vos questions et découvertes !'
            ],
            [
                'title' => '📋 Règles de la communauté SunnyTown',
                'category_name' => 'Annonces Officielles',
                'content' => 'Pour maintenir une communauté accueillante : respectez les autres joueurs, partagez vos astuces, aidez les nouveaux arrivants et gardez l\'esprit positif de SunnyTown !'
            ],
            [
                'title' => '🆕 Mise à jour v2.1 : Nouvelles cultures saisonnières !',
                'category_name' => 'Annonces Officielles',
                'content' => 'La mise à jour v2.1 apporte des cultures saisonnières, de nouveaux bâtiments décoratifs et des événements météorologiques ! Découvrez les citrouilles d\'automne et les sapins de Noël.'
            ],

            [
                'title' => '🌱 Guide débutant : Vos premiers pas',
                'category_name' => 'Aide & Tutoriels',
                'content' => 'Nouveau à SunnyTown ? Commencez par ces étapes essentielles : collectez du bois, plantez du blé, construisez votre première scierie et n\'oubliez pas de vendre vos produits !'
            ],
            [
                'title' => '💡 10 astuces pour optimiser votre production',
                'category_name' => 'Aide & Tutoriels',
                'content' => 'Voici mes meilleures astuces pour maximiser vos profits : placez vos bâtiments stratégiquement, diversifiez vos ressources, investissez dans l\'automatisation et surveillez les prix du marché.'
            ],
            [
                'title' => '🎯 Objectifs à court et long terme',
                'category_name' => 'Aide & Tutoriels',
                'content' => 'Comment bien planifier votre développement ? Fixez-vous des objectifs réalisables : 1000 pièces d\'or, 10 bâtiments, débloquer toutes les cultures...'
            ],

            [
                'title' => '🏘️ Organisation optimale de votre ville',
                'category_name' => 'Gestion de Ville',
                'content' => 'Comment organiser efficacement l\'espace de votre ville ? Groupez les bâtiments par fonction, laissez de la place pour l\'expansion et pensez aux routes !'
            ],
            [
                'title' => '💰 Stratégies économiques avancées',
                'category_name' => 'Gestion de Ville',
                'content' => 'Partageons nos meilleures stratégies pour maximiser les profits : chaînes de production, spécialisation, investissements prioritaires...'
            ],
            [
                'title' => '⚡ Gestion de l\'énergie et de l\'eau',
                'category_name' => 'Gestion de Ville',
                'content' => 'Comment bien gérer vos ressources énergétiques ? Placement des centrales, distribution efficace, économies d\'énergie...'
            ],

            [
                'title' => '🌲 Techniques d\'abattage efficaces',
                'category_name' => 'Exploitation Forestière',
                'content' => 'Optimisez votre exploitation forestière ! Rotation des zones d\'abattage, replantation stratégique, et maximisation du rendement en bois.'
            ],
            [
                'title' => '🪵 Types de bois et leurs utilisations',
                'category_name' => 'Exploitation Forestière',
                'content' => 'Guide complet des différents types de bois dans SunnyTown : chêne robuste, pin rapide, bois exotique rare... Chaque essence a ses avantages !'
            ],
            [
                'title' => '🌳 Replantation et gestion durable',
                'category_name' => 'Exploitation Forestière',
                'content' => 'L\'exploitation durable est la clé ! Comment replanter efficacement, gérer la croissance des arbres et maintenir un équilibre écologique.'
            ],

            [
                'title' => '🌾 Cultures les plus rentables par saison',
                'category_name' => 'Agriculture & Récoltes',
                'content' => 'Analyse des profits par culture : le blé stable toute l\'année, les tomates juteuses d\'été, les citrouilles d\'automne... Quelle est votre stratégie ?'
            ],
            [
                'title' => '🚜 Automatisation des fermes',
                'category_name' => 'Agriculture & Récoltes',
                'content' => 'Comment automatiser vos fermes pour un rendement optimal ? Systèmes d\'irrigation, tracteurs automatiques, silos de stockage...'
            ],
            [
                'title' => '🌱 Nouvelles variétés de cultures',
                'category_name' => 'Agriculture & Récoltes',
                'content' => 'Avez-vous testé les nouvelles variétés hybrides ? Rendement supérieur, résistance aux maladies, mais coût de départ plus élevé...'
            ],

            [
                'title' => '⛏️ Guide complet des mines',
                'category_name' => 'Mines & Ressources',
                'content' => 'Tout savoir sur l\'exploitation minière : localisation des filons, techniques d\'extraction, équipements nécessaires et minerais rares à découvrir !'
            ],
            [
                'title' => '💎 Minerais rares : où les trouver ?',
                'category_name' => 'Mines & Ressources',
                'content' => 'Les minerais rares sont la clé de la richesse ! Partagez vos spots secrets et vos techniques pour détecter l\'or, les diamants et les pierres précieuses.'
            ],
            [
                'title' => '🔧 Amélioration des outils de minage',
                'category_name' => 'Mines & Ressources',
                'content' => 'Investir dans de meilleurs outils change tout ! Comparaison des pioches, foreuses automatiques et systèmes de transport des minerais.'
            ],

            [
                'title' => '📈 Analyse des prix du marché',
                'category_name' => 'Commerce & Économie',
                'content' => 'Les prix fluctuent constamment ! Quand vendre vos ressources ? Comment anticiper les tendances ? Partagez vos observations du marché.'
            ],
            [
                'title' => '🏪 Chaînes de magasins vs boutiques spécialisées',
                'category_name' => 'Commerce & Économie',
                'content' => 'Quelle stratégie commerciale adoptez-vous ? Plusieurs petites boutiques ou quelques grands magasins ? Avantages et inconvénients...'
            ],
            [
                'title' => '💸 Investissements les plus rentables',
                'category_name' => 'Commerce & Économie',
                'content' => 'Où investir en priorité ? Bâtiments de production, amélioration des transports, recherche technologique... Vos retours d\'expérience ?'
            ],

            [
                'title' => '🏗️ Planification urbaine efficace',
                'category_name' => 'Construction & Architecture',
                'content' => 'Comment planifier l\'expansion de votre ville ? Zonage résidentiel, industriel, commercial... Évitez les erreurs de débutant !'
            ],
            [
                'title' => '🎨 Bâtiments décoratifs : utiles ou pas ?',
                'category_name' => 'Construction & Architecture',
                'content' => 'Les bâtiments décoratifs valent-ils l\'investissement ? Bonus de bonheur, attractivité touristique, mais coût élevé... Votre avis ?'
            ],
            [
                'title' => '🛣️ Système de transport optimal',
                'category_name' => 'Construction & Architecture',
                'content' => 'Routes, chemins de fer, convoyeurs... Comment optimiser le transport de vos ressources ? Design efficace vs esthétique.'
            ],

            [
                'title' => '📸 Ma ville après 100 heures de jeu !',
                'category_name' => 'Screenshots & Créations',
                'content' => 'Voici ma fierté ! Une ville de 50 000 habitants avec tous les bâtiments débloqués. Que pensez-vous de l\'aménagement ?'
            ],
            [
                'title' => '🌟 Concours : Plus belle ville de SunnyTown',
                'category_name' => 'Screenshots & Créations',
                'content' => 'Participez au concours mensuel ! Postez une capture de votre plus belle réalisation. Prix : pack de ressources premium !'
            ],

            [
                'title' => '🎪 Événement : Festival d\'automne',
                'category_name' => 'Événements Communautaires',
                'content' => 'Le festival d\'automne commence ! Récoltes bonus de citrouilles, décorations spéciales et défis communautaires. Qui participera ?'
            ],
            [
                'title' => '🏆 Classement des maires les plus riches',
                'category_name' => 'Événements Communautaires',
                'content' => 'Compétition amicale : qui a la ville la plus prospère ? Partagez vos scores et vos stratégies pour atteindre le sommet !'
            ],

            [
                'title' => '💭 Idée : Mode multijoueur coopératif',
                'category_name' => 'Suggestions & Idées',
                'content' => 'Et si on pouvait construire des villes ensemble ? Commerce inter-villes, projets collaboratifs, entraide entre maires... Qu\'en pensez-vous ?'
            ],
            [
                'title' => '🔮 Nouvelles fonctionnalités souhaitées',
                'category_name' => 'Suggestions & Idées',
                'content' => 'Quelles fonctionnalités aimeriez-vous voir dans les prochaines mises à jour ? Nouvelles ressources, bâtiments, mécaniques de jeu...'
            ],

            [
                'title' => '☕ Discussion libre : votre routine de jeu',
                'category_name' => 'Discussion Générale',
                'content' => 'Comment organisez-vous vos sessions de jeu ? Le matin avec le café, le soir pour décompresser ? SunnyTown s\'adapte à tous les rythmes !'
            ],
            [
                'title' => '🎮 Autres jeux similaires que vous recommandez',
                'category_name' => 'Discussion Générale',
                'content' => 'Fans de jeux de gestion et de construction, quels autres titres recommandez-vous ? Comparaisons avec SunnyTown bienvenues !'
            ]
        ];

        foreach ($threads as $threadData) {
            $category = $categories->where('name', $threadData['category_name'])->first();
            if ($category) {
                Thread::create([
                    'title' => $threadData['title'],
                    'forum_category_id' => $category->id,
                    'user_id' => $users->random()->id,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 30))
                ]);
            }
        }
    }
}
