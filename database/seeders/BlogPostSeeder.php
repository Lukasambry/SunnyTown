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
                'title' => '🌱 Guide du Parfait Débutant à SunnyTown',
                'content' => 'Bienvenue dans l\'univers enchanteur de SunnyTown ! Ce guide vous accompagnera dans vos premiers pas vers la prospérité. Commencez par collecter du bois en abattant les arbres autour de votre zone de départ. Le bois est la ressource de base qui vous permettra de construire vos premiers bâtiments essentiels : la scierie et la ferme.

Plantez ensuite du blé, culture la plus accessible et rentable pour débuter. Pendant que vos récoltes poussent, explorez votre environnement pour découvrir des ressources cachées comme les minerais ou les baies sauvages.

N\'oubliez pas de vendre régulièrement vos produits au marché pour générer des revenus. Avec vos premiers profits, investissez dans l\'amélioration de vos outils et la construction de nouveaux bâtiments. La patience et la stratégie sont les clés du succès à SunnyTown !',
                'author' => 'Maire de SunnyTown',
                'published_at' => now()->subDays(5)
            ],
            [
                'title' => '🌲 Maîtriser l\'Art de l\'Exploitation Forestière',
                'content' => 'L\'exploitation forestière est l\'épine dorsale de l\'économie de SunnyTown. Pour maximiser vos profits tout en préservant l\'environnement, adoptez une approche stratégique et durable.

Commencez par identifier les différents types d\'arbres : les pins à croissance rapide pour une production constante, les chênes robustes pour un bois de qualité supérieure, et les arbres exotiques rares pour des profits exceptionnels.

Organisez votre exploitation en zones rotatives : abattez une zone pendant que l\'autre se régénère. Cette technique garantit une production continue sans épuiser vos ressources. Investissez dans des outils de qualité - une tronçonneuse automatique peut tripler votre rendement !

La replantation est cruciale : chaque arbre abattu doit être remplacé. Utilisez des graines d\'essences variées pour créer une forêt diversifiée et résistante. N\'oubliez pas que certains arbres poussent mieux dans des conditions spécifiques - les sapins préfèrent l\'altitude, les palmiers aiment l\'humidité.

Enfin, surveillez les cours du marché. Le bois de construction se vend mieux en période d\'expansion urbaine, tandis que le bois de chauffage est très demandé en hiver.',
                'author' => 'Pierre Bûcheron',
                'published_at' => now()->subDays(12)
            ],
            [
                'title' => '🌾 Révolution Agricole : Les Nouvelles Cultures Saisonnières',
                'content' => 'La dernière mise à jour de SunnyTown introduit un système révolutionnaire de cultures saisonnières qui transforme complètement la stratégie agricole. Découvrez comment tirer parti de ces nouveautés pour maximiser vos rendements.

Le printemps apporte les légumes primeurs : radis à croissance ultra-rapide, épinards nutritifs et asperges de luxe. Ces cultures bénéficient d\'un bonus de croissance de 30% pendant cette saison et se vendent à prix d\'or sur les marchés urbains.

L\'été est la saison des fruits juteux : tomates cerises, pastèques rafraîchissantes et melons sucrés. Ces cultures nécessitent plus d\'eau mais offrent des marges bénéficiaires exceptionnelles. Investissez dans des systèmes d\'irrigation automatiques pour optimiser leur production.

L\'automne révèle sa magie avec les citrouilles géantes, parfaites pour les festivals, les courges décoratives et les pommes croquantes. Ces produits se conservent longtemps, permettant de constituer des stocks pour les périodes creuses.

L\'hiver, souvent négligé, offre des opportunités uniques avec les légumes racines résistants au froid, les champignons de serre et les arbres de Noël saisonniers. Ces cultures spéciales se vendent à des prix premium pendant les fêtes.

La clé du succès réside dans la planification : anticipez les saisons, préparez vos terrains à l\'avance et diversifiez vos cultures pour maintenir des revenus constants toute l\'année.',
                'author' => 'Marie Fermière',
                'published_at' => now()->subDays(18)
            ],
            [
                'title' => '⛏️ Les Secrets des Mines Profondes',
                'content' => 'L\'exploitation minière dans SunnyTown recèle de mystères et de richesses insoupçonnées. Plongez dans les profondeurs de la terre pour découvrir des trésors qui transformeront votre économie.

Les mines de surface offrent un accès facile aux minerais courants : fer, cuivre et charbon. Ces ressources forment la base de votre industrie, nécessaires pour fabriquer outils, machines et infrastructures. Commencez toujours par sécuriser ces approvisionnements avant de vous aventurer plus profond.

Les mines intermédiaires révèlent leurs secrets aux explorateurs patients : argent brillant, cristaux énergétiques et pierres semi-précieuses. Ces minerais rares alimentent les technologies avancées et se négocient à des prix élevés. Attention aux éboulements - investissez dans des étais de soutènement !

Les mines profondes, accessibles uniquement avec un équipement spécialisé, cachent les trésors ultimes : diamants étincelants, métaux précieux et minerais magiques. Ces ressources légendaires débloquent les constructions les plus prestigieuses et génèrent des fortunes colossales.

Techniques d\'exploration avancées : utilisez des détecteurs géologiques pour localiser les filons, créez des réseaux de tunnels efficaces pour optimiser l\'extraction, et n\'oubliez jamais l\'équipement de sécurité - les accidents coûtent cher !

Le secret des mineurs experts : certaines zones géologiques recèlent des "poches de richesse" - des concentrations exceptionnelles de minerais rares. Étudiez la topographie, analysez les formations rocheuses et soyez récompensé par la découverte du filon de votre vie !',
                'author' => 'Lucas Mineur',
                'published_at' => now()->subDays(25)
            ],
            [
                'title' => '🏗️ Architecture et Urbanisme : Construire la Ville de Demain',
                'content' => 'Planifier et construire une ville prospère dans SunnyTown demande vision, créativité et stratégie. Découvrez les principes fondamentaux de l\'urbanisme pour créer une métropole harmonieuse et efficace.

La planification urbaine commence par le zonage : délimitez clairement vos zones résidentielles, commerciales et industrielles. Les résidents apprécient la tranquillité, éloignez donc les usines bruyantes des quartiers d\'habitation. Créez des zones tampons avec des parcs et espaces verts.

L\'infrastructure de transport est cruciale : concevez un réseau routier logique avec des artères principales et des rues secondaires. Les embouteillages nuisent à l\'économie ! Pensez aux transports en commun pour les grandes villes : tramways, métros et bus réduisent la circulation automobile.

Les services publics garantissent la qualité de vie : écoles pour éduquer la future génération, hôpitaux pour maintenir la santé publique, pompiers pour la sécurité, et commissariats pour l\'ordre. Ces bâtiments coûtent cher mais augmentent drastiquement le bonheur des citoyens.

L\'esthétique compte ! Les bâtiments décoratifs, fontaines, monuments et jardins embellissent votre ville et attirent les touristes. Une ville belle génère plus de revenus qu\'une ville purement fonctionnelle.

Anticipez la croissance : laissez de l\'espace pour l\'expansion, prévoyez l\'augmentation des besoins en énergie et en eau, et gardez de la flexibilité dans vos plans. La ville parfaite évolue avec le temps et les besoins de ses habitants.',
                'author' => 'Sophie Architecte',
                'published_at' => now()->subDays(32)
            ],
            [
                'title' => '💰 Économie Avancée : Stratégies de Magnat',
                'content' => 'Passer du statut de petit fermier à celui de magnat de SunnyTown nécessite une compréhension profonde des mécanismes économiques. Voici les stratégies avancées des joueurs les plus prospères.

La diversification est la règle d\'or : ne misez jamais tout sur une seule ressource. Équilibrez agriculture, foresterie, mines et industrie. Cette approche vous protège des fluctuations du marché et garantit des revenus constants même en cas de crise sectorielle.

Maîtrisez les chaînes de production : transformez vos matières premières plutôt que de les vendre brutes. Le blé devient farine puis pain, générant 400% de plus-value. Le minerai de fer se transforme en outils, puis en machines complexes. Plus votre chaîne est longue, plus vos profits explosent.

L\'analyse de marché sépare les amateurs des professionnels : étudiez les cycles économiques, identifiez les tendances saisonnières, anticipez les pénuries. Stockez quand les prix sont bas, vendez quand ils flambent. Un bon trader peut doubler ses profits sans produire davantage.

L\'automatisation révolutionne la productivité : investissez massivement dans les machines, robots et systèmes automatiques. Le coût initial est élevé, mais le retour sur investissement dépasse souvent 1000%. Une usine automatisée produit 24h/24 sans salaires ni fatigue.

La recherche et développement ouvre des opportunités uniques : débloquez de nouvelles technologies, améliorez vos processus, découvrez des ressources exclusives. Les innovations vous donnent un avantage concurrentiel décisif sur les autres joueurs.

Enfin, la patience et la vision long terme distinguent les vrais magnats : réinvestissez vos profits, planifiez sur plusieurs années, construisez un empire durable plutôt que de chercher des gains rapides.',
                'author' => 'Thomas Marchand',
                'published_at' => now()->subDays(38)
            ],
            [
                'title' => '🌍 Développement Durable : L\'Avenir de SunnyTown',
                'content' => 'Dans un monde en constante évolution, SunnyTown embrasse les principes du développement durable. Découvrez comment prospérer tout en préservant l\'environnement pour les générations futures.

L\'économie circulaire transforme les déchets en ressources : vos scieries produisent de la sciure, parfaite pour le compost ou le chauffage. Les eaux usées traitées irriguent vos cultures. Les déchets alimentaires nourrissent vos animaux. Cette approche réduit les coûts et protège l\'environnement.

Les énergies renouvelables révolutionnent votre production : panneaux solaires sur les toits, éoliennes sur les collines, barrages hydroélectriques sur les rivières. L\'investissement initial est conséquent, mais l\'énergie gratuite et illimitée transforme votre économie. Plus de factures énergétiques !

La biodiversité enrichit votre territoire : préservez les habitats naturels, créez des corridors écologiques, maintenez des zones sauvages. La faune locale pollinise vos cultures, contrôle les nuisibles naturellement et attire l\'écotourisme. La nature est votre meilleure alliée !

L\'agriculture biologique répond à une demande croissante : cultivez sans pesticides, utilisez des engrais naturels, pratiquez la rotation des cultures. Les produits bio se vendent 200% plus cher et fidélisent une clientèle premium soucieuse de sa santé.

La construction écologique définit les standards de demain : matériaux recyclés, isolation thermique, toits végétalisés, récupération d\'eau de pluie. Ces bâtiments consomment moins d\'énergie et offrent un cadre de vie exceptionnel à vos habitants.

L\'éducation environnementale sensibilise votre population : organisez des événements verts, créez des centres de sensibilisation, récompensez les comportements éco-responsables. Une communauté éduquée devient actrice du changement et soutient vos initiatives durables.',
                'author' => 'Emma Écologiste',
                'published_at' => now()->subDays(45)
            ],
            [
                'title' => '🎮 Événements Spéciaux : Maximiser Vos Gains',
                'content' => 'Les événements spéciaux de SunnyTown offrent des opportunités exceptionnelles de progression. Maîtrisez ces mécaniques temporaires pour propulser votre ville vers de nouveaux sommets de prospérité.

Les événements saisonniers transforment le gameplay : Festival du Printemps avec bonus de croissance agricole, Fête d\'Été augmentant le tourisme, Récolte d\'Automne multipliant les profits des cultures, Marché d\'Hiver boostant le commerce. Préparez-vous à l\'avance pour maximiser ces aubaines !

Les défis communautaires unis sentent la communauté : objectifs collectifs débloquant des récompenses pour tous, compétitions amicales entre joueurs, projets collaboratifs nécessitant la participation de milliers de maires. L\'union fait la force et enrichit tout le monde !

Les événements météorologiques apportent piment et opportunités : tempêtes détruisant certaines cultures mais révélant des minerais précieux, sécheresses ralentissant l\'agriculture mais favorisant l\'extraction minière, inondations fertiles doublant les rendements suivants. Adaptez votre stratégie !

Les apparitions spéciales créent l\'excitation : marchands mystérieux vendant des objets rares, voyageurs offrant des quêtes uniques, inventeurs proposant des technologies exclusives. Ces rencontres aléatoires peuvent changer le cours de votre développement !

Stratégies d\'optimisation : stockez des ressources avant les événements, gardez de la liquidité pour saisir les opportunités, coordonnez-vous avec d\'autres joueurs pour les défis collectifs, et surtout, restez connecté pendant les événements - les meilleures récompenses vont aux plus actifs !

Le calendrier événementiel suit des cycles prévisibles : analysez les patterns historiques, anticipez les événements récurrents, préparez vos stocks en conséquence. Les joueurs organisés dominent les classements événementiels !',
                'author' => 'Max Industriel',
                'published_at' => now()->subDays(52)
            ],
            [
                'title' => '🎨 Customisation et Décoration : Exprimer sa Créativité',
                'content' => 'SunnyTown n\'est pas seulement un jeu de gestion, c\'est aussi une toile artistique où exprimer votre créativité. Découvrez l\'art de la décoration urbaine et créez des villes uniques qui vous ressemblent.

La palette décorative s\'enrichit constamment : monuments historiques recréant l\'architecture classique, sculptures modernes apportant une touche contemporaine, jardins thématiques transportant dans différents univers, fontaines musicales animant vos places publiques. Chaque élément raconte une histoire !

L\'harmonie chromatique transforme l\'ambiance : coordonnez les couleurs de vos bâtiments, créez des quartiers thématiques avec leurs propres palettes, utilisez l\'éclairage pour sublimer vos créations nocturnes. Une ville colorée inspire bonheur et fierté !

Les thèmes saisonniers renouvellent continuellement l\'expérience : décorations de Noël transformant votre cité en village féerique, ornements d\'Halloween créant une atmosphère mystérieuse, parures printanières célébrant le renouveau, décorations estivales évoquant les vacances. Votre ville évolue au rythme des saisons !

L\'aménagement paysager révèle votre personnalité : parcs romantiques avec bancs et rosiers, jardins zen favorisant la méditation, espaces de jeux dynamiques pour les enfants, promenades sportives encourageant l\'activité physique. Chaque espace raconte qui vous êtes !

Les concours de décoration stimulent la créativité communautaire : thèmes mensuels challengeant votre imagination, prix récompensant les créations les plus originales, galeries permettant d\'admirer les œuvres des autres joueurs. L\'émulation artistique enrichit toute la communauté !

Conseils de pro : photographiez vos créations sous différents angles et éclairages, documentez l\'évolution de vos projets, partagez vos techniques avec la communauté, et surtout, amusez-vous ! La beauté naît de la passion, pas de la perfection.',
                'author' => 'Clara Décoratrice',
                'published_at' => now()->subDays(58)
            ]
        ];

        foreach ($posts as $post) {
            BlogPost::create($post);
        }
    }
}
