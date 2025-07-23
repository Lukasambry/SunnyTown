<?php

namespace App\Http\Controllers;

use App\Models\GameSave;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GameSaveController extends Controller
{
    /**
     * Sauvegarder la progression du jeu
     */
    public function save(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'player_id' => 'required|string|max:255',
                'save_name' => 'sometimes|string|max:100',
                'game_state' => 'required|array',
                'game_state.player' => 'required|array',
                'game_state.player.level' => 'required|integer|min:1',
                'game_state.player.gold' => 'required|integer|min:0',
                'game_state.player.experience' => 'required|array',
                'game_state.player.experience.current' => 'required|integer|min:0',
                'game_state.player.experience.nextLevel' => 'required|integer|min:1',
                'game_state.player.health' => 'required|array',
                'game_state.player.health.current' => 'required|integer|min:0',
                'game_state.player.health.max' => 'required|integer|min:1',
                'game_state.resources' => 'sometimes|array',
                'game_state.buildings' => 'sometimes|array',
                'game_state.workers' => 'sometimes|array',
                'game_state.gameData' => 'sometimes|array',
                'game_state.metadata' => 'sometimes|array',
            ]);

            $playerId = $validated['player_id'];
            $saveName = $validated['save_name'] ?? 'default';
            $gameState = $validated['game_state'];

            $save = GameSave::createOrUpdateSave($playerId, $gameState, $saveName);

            return response()->json([
                'success' => true,
                'message' => 'Progression sauvegardée avec succès',
                'data' => [
                    'save_id' => $save->id,
                    'last_saved_at' => $save->updated_at->toISOString(),
                ],
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données de sauvegarde invalides',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la sauvegarde du jeu', [
                'player_id' => $request->get('player_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde',
            ], 500);
        }
    }

    /**
     * Charger la progression du jeu
     */
    public function load(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'player_id' => 'required|string|max:255',
                'save_name' => 'sometimes|string|max:100',
            ]);

            $playerId = $validated['player_id'];
            $saveName = $validated['save_name'] ?? 'default';

            $save = GameSave::forPlayer($playerId, $saveName)->first();

            if (!$save) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune sauvegarde trouvée',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Progression chargée avec succès',
                'data' => [
                    'game_state' => $save->game_state,
                    'save_id' => $save->id,
                ],
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Paramètres invalides',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Erreur lors du chargement du jeu', [
                'player_id' => $request->get('player_id'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement',
            ], 500);
        }
    }

    /**
     * Charger la dernière sauvegarde pour l'initialisation
     */
    public function loadLatest(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'player_id' => 'required|string|max:255',
            ]);

            $save = GameSave::where('player_id', $validated['player_id'])
                ->orderBy('last_played_at', 'desc')
                ->first();

            if (!$save) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune sauvegarde trouvée',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Dernière sauvegarde chargée',
                'data' => [
                    'game_state' => $save->game_state,
                    'save_id' => $save->id,
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur chargement dernière sauvegarde', [
                'player_id' => $request->get('player_id'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement',
            ], 500);
        }
    }

    /**
     * Lister les sauvegardes d'un joueur
     */
    public function list(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'player_id' => 'required|string|max:255',
            ]);

            $saves = GameSave::where('player_id', $validated['player_id'])
                ->orderBy('last_played_at', 'desc')
                ->get()
                ->map(function ($save) {
                    return [
                        'id' => $save->id,
                        'save_name' => $save->save_name,
                        'player_level' => $save->player_level,
                        'last_played_at' => $save->last_played_at?->toISOString(),
                        'play_time_seconds' => $save->play_time_seconds,
                        'game_version' => $save->game_version,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $saves,
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des sauvegardes', [
                'player_id' => $request->get('player_id'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des sauvegardes',
            ], 500);
        }
    }

    /**
     * Supprimer une sauvegarde
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'player_id' => 'required|string|max:255',
                'save_name' => 'required|string|max:100',
            ]);

            $save = GameSave::forPlayer($validated['player_id'], $validated['save_name'])->first();

            if (!$save) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sauvegarde non trouvée',
                ], 404);
            }

            $save->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sauvegarde supprimée avec succès',
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression de la sauvegarde', [
                'player_id' => $request->get('player_id'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
            ], 500);
        }
    }

    /**
     * Générer un ID de joueur unique
     */
    public function generatePlayerId(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'player_id' => (string) Str::uuid(),
            ],
        ]);
    }
}
