<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class GameSave extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'save_name',
        'player_level',
        'player_gold',
        'player_experience_current',
        'player_experience_next_level',
        'player_health_current',
        'player_health_max',
        'player_avatar',
        'resources',
        'buildings',
        'workers',
        'game_data',
        'last_played_at',
        'play_time_seconds',
        'game_version',
    ];

    protected $casts = [
        'resources' => 'array',
        'buildings' => 'array',
        'workers' => 'array',
        'game_data' => 'array',
        'last_played_at' => 'datetime',
    ];

    /**
     * Scope pour récupérer la sauvegarde la plus récente d'un joueur
     */
    public function scopeLatestForPlayer($query, string $playerId)
    {
        return $query->where('player_id', $playerId)
            ->orderBy('last_played_at', 'desc');
    }

    /**
     * Scope pour récupérer une sauvegarde spécifique d'un joueur
     */
    public function scopeForPlayer($query, string $playerId, string $saveName = 'default')
    {
        return $query->where('player_id', $playerId)
            ->where('save_name', $saveName);
    }

    /**
     * Formater les données du joueur pour le frontend
     */
    public function getPlayerDataAttribute(): array
    {
        return [
            'level' => $this->player_level,
            'gold' => $this->player_gold,
            'experience' => [
                'current' => $this->player_experience_current,
                'nextLevel' => $this->player_experience_next_level,
            ],
            'health' => [
                'current' => $this->player_health_current,
                'max' => $this->player_health_max,
            ],
            'avatar' => $this->player_avatar,
        ];
    }

    /**
     * Formater toutes les données de sauvegarde pour le frontend
     */
    public function getGameStateAttribute(): array
    {
        return [
            'player' => $this->player_data,
            'resources' => $this->resources ?? [],
            'buildings' => $this->buildings ?? [],
            'workers' => $this->workers ?? [],
            'gameData' => $this->game_data ?? [],
            'metadata' => [
                'lastPlayedAt' => $this->last_played_at?->toISOString(),
                'playTimeSeconds' => $this->play_time_seconds,
                'gameVersion' => $this->game_version,
                'saveName' => $this->save_name,
            ],
        ];
    }

    /**
     * Mettre à jour le temps de jeu
     */
    public function updatePlayTime(int $additionalSeconds): void
    {
        $this->increment('play_time_seconds', $additionalSeconds);
        $this->update(['last_played_at' => now()]);
    }

    /**
     * Créer ou mettre à jour une sauvegarde
     */
    public static function createOrUpdateSave(string $playerId, array $gameState, string $saveName = 'default'): self
    {
        $save = self::forPlayer($playerId, $saveName)->first();

        if (!$save) {
            $save = new self(['player_id' => $playerId, 'save_name' => $saveName]);
        }

        // Mise à jour des données du joueur
        if (isset($gameState['player'])) {
            $playerData = $gameState['player'];
            $save->player_level = $playerData['level'] ?? 1;
            $save->player_gold = $playerData['gold'] ?? 0;
            $save->player_experience_current = $playerData['experience']['current'] ?? 0;
            $save->player_experience_next_level = $playerData['experience']['nextLevel'] ?? 100;
            $save->player_health_current = $playerData['health']['current'] ?? 100;
            $save->player_health_max = $playerData['health']['max'] ?? 100;
            $save->player_avatar = $playerData['avatar'] ?? null;
        }

        // Mise à jour des autres données
        $save->resources = $gameState['resources'] ?? [];
        $save->buildings = $gameState['buildings'] ?? [];
        $save->workers = $gameState['workers'] ?? [];
        $save->game_data = $gameState['gameData'] ?? [];

        // Métadonnées
        $save->last_played_at = now();
        $save->game_version = $gameState['metadata']['gameVersion'] ?? '1.0.0';

        // Mise à jour du temps de jeu si fourni
        if (isset($gameState['metadata']['additionalPlayTime'])) {
            $save->play_time_seconds += $gameState['metadata']['additionalPlayTime'];
        }

        $save->save();

        return $save;
    }
}
