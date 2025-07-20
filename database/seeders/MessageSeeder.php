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

        $sampleMessages = [
            'Excellente question ! Je pense que...',
            'J\'ai eu le même problème récemment. Voici comment je l\'ai résolu :',
            'Merci pour ce partage très intéressant !',
            'Je ne suis pas d\'accord avec cette approche. Voici pourquoi :',
            'Quelqu\'un a-t-il déjà testé cette solution ?',
            'Voici un lien vers la documentation officielle qui pourrait aider.',
            'J\'ai implémenté quelque chose de similaire dans mon projet.',
            'Cette discussion me rappelle un article que j\'ai lu récemment.',
            'Très bonne explication ! Cela va m\'aider dans mon projet.',
            'Y a-t-il des alternatives à cette méthode ?',
            'Je confirme, cette solution fonctionne parfaitement.',
            'Attention, cette approche peut poser des problèmes de sécurité.',
            'Voici un exemple de code qui illustre le concept :',
            'Je recommande vivement cette ressource pour approfondir le sujet.',
            'Quelqu\'un pourrait-il expliquer cette partie plus en détail ?'
        ];

        foreach ($threads as $thread) {
            Message::create([
                'thread_id' => $thread->id,
                'user_id' => $thread->user_id,
                'content' => $this->getThreadContent($thread->title),
                'created_at' => $thread->created_at,
                'updated_at' => $thread->created_at
            ]);

            $messageCount = rand(2, 8);
            for ($i = 0; $i < $messageCount; $i++) {
                Message::create([
                    'thread_id' => $thread->id,
                    'user_id' => $users->random()->id,
                    'content' => $sampleMessages[array_rand($sampleMessages)] . ' ' .
                        $this->generateRandomContent(),
                    'created_at' => $thread->created_at->addMinutes(rand(30, 1440 * 10)),
                    'updated_at' => $thread->created_at->addMinutes(rand(30, 1440 * 10))
                ]);
            }
        }
    }

    private function getThreadContent($title): string
    {
        $contents = [
            'Bienvenue' => 'Bonjour à tous ! Je suis ravi de lancer ce nouveau forum. N\'hésitez pas à vous présenter et à partager vos expériences dans le développement web.',
            'Règles' => 'Voici les règles importantes de notre communauté : respectez les autres membres, restez constructifs dans vos critiques, et n\'hésitez pas à partager vos connaissances.',
            'Laravel 11' => 'Laravel 11 apporte de nombreuses améliorations. Les plus notables sont l\'amélioration des performances, de nouveaux helpers, et une meilleure intégration avec les outils modernes.',
            'Vue 3 vs React' => 'Je travaille sur un nouveau projet et j\'hésite entre Vue 3 et React. Quels sont vos retours d\'expérience sur ces deux frameworks ?',
            'Docker' => 'J\'ai configuré un environnement Docker pour Laravel qui fonctionne parfaitement. Voici ma configuration et quelques conseils pour optimiser votre setup.',
        ];

        foreach ($contents as $keyword => $content) {
            if (stripos($title, $keyword) !== false) {
                return $content;
            }
        }

        return 'Je lance cette discussion pour partager nos expériences et apprendre ensemble. N\'hésitez pas à donner votre avis !';
    }

    private function generateRandomContent(): string
    {
        $phrases = [
            'Voici mon expérience sur le sujet.',
            'J\'ai trouvé une solution qui fonctionne bien.',
            'La documentation officielle est très claire à ce sujet.',
            'Il faut faire attention aux bonnes pratiques.',
            'Cela dépend vraiment du contexte du projet.',
            'Je vous recommande de tester cette approche.',
            'N\'oubliez pas de vérifier la compatibilité.',
            'Cette solution a bien fonctionné dans mon cas.'
        ];

        return $phrases[array_rand($phrases)];
    }
}
