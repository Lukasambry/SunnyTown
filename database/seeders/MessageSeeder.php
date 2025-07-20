<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $threads = Thread::all();
        $users = User::all();

        $gameMessages = [
            // Messages d'aide et conseils
            'Excellente stratégie ! J\'ai testé cette approche dans ma ville et ça fonctionne parfaitement.',
            'Merci pour ce conseil, ma production de bois a doublé !',
            'J\'ai eu le même problème au début. Voici comment je l\'ai résolu :',
            'Super guide ! Exactement ce dont j\'avais besoin pour démarrer.',
            'Cette technique m\'a permis d\'économiser des milliers de pièces d\'or.',

            // Messages sur les ressources
            'Les minerais rares se trouvent souvent près des montagnes au nord de la carte.',
            'N\'oubliez pas de diversifier vos cultures selon les saisons !',
            'La demande en bois de chêne explose en ce moment, c\'est le bon moment pour vendre.',
            'J\'ai trouvé un filon de diamants près de la cascade, incroyable !',
            'Les tomates bio se vendent 3 fois plus cher que les normales.',

            // Messages sur la construction
            'Votre ville est magnifique ! J\'adore l\'aménagement du centre commercial.',
            'Comment avez-vous organisé vos zones industrielles ? C\'est très efficace.',
            'Je recommande de laisser plus d\'espace pour l\'expansion future.',
            'Les fontaines décorative apportent un vrai plus au bonheur des habitants.',
            'Votre réseau de transport est impressionnant !',

            // Messages sur l'économie
            'Les prix du marché sont très volatils cette semaine, attention aux ventes.',
            'Investir dans l\'automatisation est rentable à long terme.',
            'J\'ai atteint 1 million de pièces d\'or grâce à cette stratégie !',
            'Le commerce de produits transformés rapporte beaucoup plus.',
            'N\'hésitez pas à emprunter pour investir dans de nouveaux équipements.',

            // Messages communautaires
            'Quelqu\'un veut former une alliance commerciale ?',
            'Bravo pour ta victoire au concours du mois !',
            'Hâte de voir les nouvelles fonctionnalités de la prochaine mise à jour.',
            'La communauté SunnyTown est vraiment formidable !',
            'Qui participe à l\'événement spécial Halloween ?',

            // Messages techniques et astuces
            'Cette astuce va révolutionner votre gestion des stocks !',
            'Attention aux bugs de placement près des rivières.',
            'Utilisez les raccourcis clavier pour aller plus vite.',
            'Le mode pause est très pratique pour planifier.',
            'Sauvegardez régulièrement, on ne sait jamais !',

            // Messages d'encouragement
            'Ne vous découragez pas, ça prend du temps au début.',
            'Votre progression est impressionnante pour un débutant !',
            'Continue comme ça, ta ville va devenir légendaire !',
            'Chaque erreur est une leçon pour s\'améliorer.',
            'Patience, les grosses infrastructures prennent du temps.',

            // Messages sur les événements
            'L\'événement automne est mon préféré, les décorations sont superbes.',
            'J\'ai collecté 500 citrouilles spéciales cette semaine !',
            'Les bonus d\'événement sont parfaits pour booster l\'économie.',
            'Qui veut s\'associer pour le défi communautaire ?',
            'Les récompenses de cet événement valent vraiment le coup.',

            // Messages de retour d'expérience
            'Après 200 heures de jeu, voici ce que j\'ai appris :',
            'Ma plus grosse erreur a été de négliger l\'agriculture.',
            'Le secret c\'est de bien équilibrer toutes les ressources.',
            'J\'aurais dû investir dans les mines plus tôt.',
            'La patience est la clé de la réussite dans SunnyTown.'
        ];

        foreach ($threads as $thread) {
            // Message initial du thread
            Message::create([
                'thread_id' => $thread->id,
                'user_id' => $thread->user_id,
                'content' => $this->getThreadContent($thread->title),
                'created_at' => $thread->created_at,
                'updated_at' => $thread->created_at
            ]);

            // Messages de réponse
            $messageCount = rand(3, 12);
            for ($i = 0; $i < $messageCount; $i++) {
                Message::create([
                    'thread_id' => $thread->id,
                    'user_id' => $users->random()->id,
                    'content' => $gameMessages[array_rand($gameMessages)] . ' ' .
                        $this->generateContextualContent($thread->title),
                    'created_at' => $thread->created_at->addMinutes(rand(30, 1440 * 15)),
                    'updated_at' => $thread->created_at->addMinutes(rand(30, 1440 * 15))
                ]);
            }
        }
    }

    private function getThreadContent($title): string
    {
        $contents = [
            'Bienvenue' => 'Bienvenue à tous dans l\'univers de SunnyTown ! Que vous soyez un bûcheron expérimenté ou un fermier débutant, cette communauté est là pour vous aider à prospérer.',
            'Règles' => 'Pour maintenir l\'esprit convivial de SunnyTown : partagez vos astuces, aidez les nouveaux joueurs, respectez les autres maires et amusez-vous ! Ensemble nous bâtirons la plus belle communauté.',
            'Guide débutant' => 'Nouveau maire à SunnyTown ? Commencez petit : ramassez du bois, plantez du blé, construisez votre première scierie et regardez votre ville grandir. La clé est de diversifier progressivement.',
            'Mise à jour' => 'Cette nouvelle mise à jour apporte tant de contenu ! Les cultures saisonnières changent complètement la stratégie agricole. Et ces nouveaux bâtiments décoratifs sont magnifiques !',
            'Optimisation' => 'Après des centaines d\'heures de jeu, voici mes techniques pour maximiser l\'efficacité : placement stratégique, rotation des cultures, investissement dans l\'automatisation...',
            'Ville' => 'L\'organisation spatiale est cruciale dans SunnyTown. Voici comment j\'ai structuré ma ville de 30 000 habitants pour optimiser les flux de ressources et le bonheur des citoyens.',
            'Forestière' => 'L\'exploitation forestière durable est un art ! Il faut équilibrer productivité et régénération. Mes techniques : zones de rotation, replantation planifiée, diversité des essences.',
            'Agriculture' => 'L\'agriculture dans SunnyTown est fascinante ! Chaque culture a ses spécificités : période de croissance, rendement, prix. Voici mon analyse complète des cultures les plus rentables.',
            'Mines' => 'Les mines sont la clé de la richesse ! Localisation des filons, techniques d\'extraction, gestion des équipements... Voici tout ce que vous devez savoir pour devenir riche.',
            'Commerce' => 'Le marché de SunnyTown est dynamique ! Les prix fluctuent selon l\'offre et la demande. Analysez les tendances pour vendre au meilleur moment.',
            'Construction' => 'Planifier sa ville est un défi passionnant ! Équilibre entre efficacité et esthétique, anticipation de la croissance, gestion des infrastructures...',
            'Screenshot' => 'Voici ma fierté : ma ville après des mois de développement ! Chaque bâtiment a sa place, chaque route a son utilité. Qu\'en pensez-vous ?',
            'Événement' => 'L\'événement de cette saison promet d\'être exceptionnel ! Nouvelles récompenses, défis inédits, décorations temporaires... Qui participera avec moi ?',
            'Suggestion' => 'J\'aimerais proposer cette nouvelle fonctionnalité qui enrichirait l\'expérience de jeu. Voici pourquoi je pense que ce serait bénéfique pour tous les joueurs.',
            'Discussion' => 'SunnyTown fait partie de ma routine quotidienne ! Une session relaxante le matin, une vérification le midi, et planification le soir. Comment organisez-vous vos sessions ?'
        ];

        foreach ($contents as $keyword => $content) {
            if (stripos($title, $keyword) !== false) {
                return $content;
            }
        }

        return 'Lançons cette discussion autour de SunnyTown ! Partageons nos expériences, astuces et découvertes pour faire prospérer nos villes ensemble.';
    }

    private function generateContextualContent($title): string
    {
        $contexts = [
            'forestière' => 'Ma forêt produit maintenant 500 unités de bois par heure !',
            'agriculture' => 'Les nouvelles graines hybrides sont vraiment rentables.',
            'mine' => 'J\'ai découvert un filon d\'or dans la zone sud de ma carte.',
            'commerce' => 'Les bénéfices ont explosé depuis que j\'ai optimisé mes routes commerciales.',
            'construction' => 'L\'expansion vers le lac a été ma meilleure décision.',
            'ville' => 'Mes habitants sont maintenant 95% satisfaits !',
            'économie' => 'Investir dans la recherche technologique change tout.',
            'événement' => 'J\'ai déjà collecté toutes les récompenses spéciales !',
            'screenshot' => 'Les effets de lumière au coucher du soleil sont magiques.',
            'guide' => 'Cette astuce m\'aurait fait économiser des heures au début.',
            'débutant' => 'N\'hésitez pas si vous avez d\'autres questions !',
            'suggestion' => 'Cette idée pourrait révolutionner le gameplay.',
            'discussion' => 'SunnyTown est parfait pour décompresser après le travail.',
            'default' => 'Cette communauté est vraiment formidable pour partager nos expériences !'
        ];

        foreach ($contexts as $keyword => $content) {
            if (stripos($title, $keyword) !== false) {
                return $content;
            }
        }

        return $contexts['default'];
    }
}
