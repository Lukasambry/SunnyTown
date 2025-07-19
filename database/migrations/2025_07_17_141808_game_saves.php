<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_saves', function (Blueprint $table) {
            $table->id();
            $table->string('player_id')->index(); // ID unique du joueur (UUID ou autre)
            $table->string('save_name')->default('default'); // Nom de la sauvegarde
            $table->integer('player_level')->default(1);
            $table->integer('player_gold')->default(0);
            $table->integer('player_experience_current')->default(0);
            $table->integer('player_experience_next_level')->default(100);
            $table->integer('player_health_current')->default(100);
            $table->integer('player_health_max')->default(100);
            $table->string('player_avatar')->nullable();

            // Ressources (stockage JSON)
            $table->json('resources')->nullable();

            // Bâtiments (stockage JSON)
            $table->json('buildings')->nullable();

            // Workers (stockage JSON)
            $table->json('workers')->nullable();

            // Autres données de jeu
            $table->json('game_data')->nullable(); // Pour des données supplémentaires

            // Métadonnées
            $table->timestamp('last_played_at')->nullable();
            $table->integer('play_time_seconds')->default(0);
            $table->string('game_version')->default('1.0.0');

            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['player_id', 'save_name']);
            $table->index('last_played_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_saves');
    }
};
