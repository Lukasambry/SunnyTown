<?php

namespace Database\Seeders;

use App\Models\MessageImage;
use App\Models\Message;
use Illuminate\Database\Seeder;

class MessageImageSeeder extends Seeder
{
    public function run(): void
    {
        $messages = Message::inRandomOrder()->take(15)->get();

        $sunnytownImagePaths = [
            'screenshots/ma_ville_niveau_50.jpg',
            'screenshots/centre_ville_sunnytown.png',
            'screenshots/zone_industrielle_optimisee.jpg',
            'screenshots/quartier_residentiel_luxe.png',
            'screenshots/port_commercial_geant.jpg',

            'production/foret_automatisee.jpg',
            'production/mine_diamant_rare.png',
            'production/ferme_cultures_variees.jpg',
            'production/usine_transformation_bois.png',
            'production/entrepots_stockage_massif.jpg',

            'buildings/monument_golden_tree.jpg',
            'buildings/gare_centrale_moderne.png',
            'buildings/marche_central_anime.jpg',
            'buildings/parc_attractions_familial.png',
            'buildings/observatoire_astronomique.jpg',

            'events/festival_automne_citrouilles.jpg',
            'events/marche_noel_decorations.png',
            'events/competition_plus_belle_ville.jpg',
            'events/fete_recolte_communautaire.png',
            'events/concours_architecture_moderne.jpg',

            'guides/layout_optimisation_transport.png',
            'guides/schema_chaine_production.jpg',
            'guides/carte_gisements_minerais.png',
            'guides/planning_cultures_saisonnieres.jpg',
            'guides/blueprint_quartier_efficace.png',

            'achievements/ville_1_million_habitants.jpg',
            'achievements/profit_mensuel_record.png',
            'achievements/collection_complete_buildings.jpg',
            'achievements/foret_100_hectares.png',
            'achievements/mine_niveau_maximum.jpg',

            'creations/jardin_zen_japonais.jpg',
            'creations/replique_tour_eiffel.png',
            'creations/labyrinthe_haies_geant.jpg',
            'creations/mosaique_fleurs_colorees.png',
            'creations/cascade_artificielle_majestueuse.jpg'
        ];

        foreach ($messages as $message) {
            if (rand(1, 100) <= 35) {
                $imageCount = rand(1, 2);

                for ($i = 0; $i < $imageCount; $i++) {
                    MessageImage::create([
                        'message_id' => $message->id,
                        'path' => $sunnytownImagePaths[array_rand($sunnytownImagePaths)]
                    ]);
                }
            }
        }
    }
}
