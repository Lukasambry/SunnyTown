import { GlobalWorkerStorage } from '../stores/GlobalWorkerStorage';

export interface WorkerStats {
    totalWorkers: number;
    assignedWorkers: number;
    unassignedWorkers: number;
    workersByType: Record<string, number>;
    workersByBuilding: Record<string, number>;
}

export class WorkerCounterService {
    private static instance: WorkerCounterService;

    public static getInstance(): WorkerCounterService {
        if (!WorkerCounterService.instance) {
            WorkerCounterService.instance = new WorkerCounterService();
        }
        return WorkerCounterService.instance;
    }

    /**
     * Obtient le nombre total d'ouvriers dans le jeu
     */
    public getTotalWorkerCount(): number {
        try {
            const workerManager = (window as any).__WORKER_MANAGER__;
            if (workerManager && workerManager.getAllWorkers) {
                return workerManager.getAllWorkers().length;
            }

            const assignments = GlobalWorkerStorage.getAllAssignments();
            const assignedWorkerIds = new Set(Object.keys(assignments.workerBuildings));

            const gameStore = (window as any).__GAME_STORE__;
            if (gameStore && gameStore.workers) {
                return gameStore.workers.length;
            }

            return assignedWorkerIds.size;
        } catch (error) {
            console.error('Error counting total workers:', error);
            return 0;
        }
    }

    /**
     * Obtient des statistiques détaillées sur les ouvriers
     */
    public getWorkerStats(): WorkerStats {
        try {
            const assignments = GlobalWorkerStorage.getAllAssignments();
            const assignedWorkerIds = new Set(Object.keys(assignments.workerBuildings));

            let totalWorkers = 0;
            const workersByType: Record<string, number> = {};
            const workersByBuilding: Record<string, number> = {};

            const workerManager = (window as any).__WORKER_MANAGER__;
            if (workerManager && workerManager.getAllWorkers) {
                const allWorkers = workerManager.getAllWorkers();
                totalWorkers = allWorkers.length;

                allWorkers.forEach((worker: any) => {
                    const config = worker.getConfig();
                    const type = config.id || config.type || 'unknown';
                    workersByType[type] = (workersByType[type] || 0) + 1;
                });
            }

            Object.entries(assignments.buildingWorkers).forEach(([buildingId, workerIds]) => {
                workersByBuilding[buildingId] = workerIds.length;
            });

            return {
                totalWorkers,
                assignedWorkers: assignedWorkerIds.size,
                unassignedWorkers: totalWorkers - assignedWorkerIds.size,
                workersByType,
                workersByBuilding
            };
        } catch (error) {
            console.error('Error getting worker stats:', error);
            return {
                totalWorkers: 0,
                assignedWorkers: 0,
                unassignedWorkers: 0,
                workersByType: {},
                workersByBuilding: {}
            };
        }
    }

    /**
     * Obtient la liste des ouvriers non assignés
     */
    public getUnassignedWorkers(): string[] {
        try {
            const workerManager = (window as any).__WORKER_MANAGER__;
            if (!workerManager || !workerManager.getAllWorkers) {
                return [];
            }

            const allWorkers = workerManager.getAllWorkers();
            const assignments = GlobalWorkerStorage.getAllAssignments();

            return allWorkers
                .filter((worker: any) => {
                    const workerId = worker.getWorkerId();
                    return !assignments.workerBuildings[workerId];
                })
                .map((worker: any) => worker.getWorkerId());
        } catch (error) {
            console.error('Error getting unassigned workers:', error);
            return [];
        }
    }

    /**
     * Obtient la liste des ouvriers assignés à un bâtiment spécifique
     */
    public getWorkersForBuilding(buildingId: string): string[] {
        return GlobalWorkerStorage.getWorkersForBuilding(buildingId);
    }

    /**
     * Vérifie si un ouvrier est assigné
     */
    public isWorkerAssigned(workerId: string): boolean {
        return GlobalWorkerStorage.isWorkerAssigned(workerId);
    }

    /**
     * Obtient le bâtiment auquel un ouvrier est assigné
     */
    public getWorkerAssignment(workerId: string): string | null {
        return GlobalWorkerStorage.getBuildingForWorker(workerId);
    }

    /**
     * Émet un événement avec les statistiques mises à jour
     */
    public emitWorkerStatsUpdate(): void {
        const stats = this.getWorkerStats();

        window.dispatchEvent(new CustomEvent('game:workerStatsUpdate', {
            detail: stats
        }));
    }

    /**
     * Setup des listeners pour les changements d'ouvriers
     */
    public setupWorkerListeners(): void {
        window.addEventListener('game:workerAssignedToBuilding', () => {
            this.emitWorkerStatsUpdate();
        });
        window.addEventListener('game:workerUnassignedFromBuilding', () => {
            this.emitWorkerStatsUpdate();
        });
        window.addEventListener('game:workerCreated', () => {
            this.emitWorkerStatsUpdate();
        });
        window.addEventListener('game:workerRemoved', () => {
            this.emitWorkerStatsUpdate();
        });
    }
}
