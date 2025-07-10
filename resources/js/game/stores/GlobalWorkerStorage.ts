declare global {
    interface Window {
        __WORKER_BUILDING_STORAGE__?: {
            buildingWorkers: Record<string, string[]>;
            workerBuildings: Record<string, string>;
            initialized: boolean;
        };
    }
}

export class GlobalWorkerStorage {
    private static ensureStorage(): void {
        if (!window.__WORKER_BUILDING_STORAGE__) {
            window.__WORKER_BUILDING_STORAGE__ = {
                buildingWorkers: {},
                workerBuildings: {},
                initialized: true
            };
            console.log('GlobalWorkerStorage: Initialized global storage');
        }
    }

    public static assignWorkerToBuilding(workerId: string, buildingId: string, maxWorkers: number): boolean {
        console.log(`\n=== GLOBAL ASSIGNMENT ===`);
        console.log(`WorkerId: "${workerId}"`);
        console.log(`BuildingId: "${buildingId}"`);
        console.log(`Max workers: ${maxWorkers}`);

        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;

        if (!workerId || !buildingId) {
            console.error('Invalid workerId or buildingId');
            return false;
        }

        // Vérifier si le worker est déjà assigné
        if (storage.workerBuildings[workerId]) {
            const currentBuildingId = storage.workerBuildings[workerId];
            console.warn(`Worker already assigned to building: ${currentBuildingId}`);
            return false;
        }

        // Vérifier la capacité du bâtiment
        const currentWorkers = storage.buildingWorkers[buildingId] || [];
        if (currentWorkers.length >= maxWorkers) {
            console.error(`Building at capacity: ${currentWorkers.length}/${maxWorkers}`);
            return false;
        }

        try {
            // Assigner le worker au bâtiment
            const newWorkerList = [...currentWorkers, workerId];
            storage.buildingWorkers[buildingId] = newWorkerList;

            // Assigner le bâtiment au worker
            storage.workerBuildings[workerId] = buildingId;

            console.log(`Assignment successful! Building now has ${newWorkerList.length} workers`);
            console.log(`Worker list: [${newWorkerList.join(', ')}]`);

            // Vérification immédiate
            const verifyCount = this.getWorkerCount(buildingId);
            console.log(`Verification: getWorkerCount returns ${verifyCount}`);

            return true;

        } catch (error) {
            console.error('Error during global assignment:', error);
            return false;
        }
    }

    public static unassignWorkerFromBuilding(workerId: string): boolean {
        console.log(`\n=== GLOBAL UNASSIGNMENT ===`);
        console.log(`WorkerId: "${workerId}"`);

        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;

        if (!workerId) {
            console.error('Invalid workerId');
            return false;
        }

        const buildingId = storage.workerBuildings[workerId];
        if (!buildingId) {
            console.warn('Worker is not assigned to any building');
            return false;
        }

        try {
            // Retirer le worker du bâtiment
            const currentWorkers = storage.buildingWorkers[buildingId] || [];
            const newWorkerList = currentWorkers.filter(id => id !== workerId);
            storage.buildingWorkers[buildingId] = newWorkerList;

            // Retirer l'assignation du worker
            delete storage.workerBuildings[workerId];

            console.log(`Unassignment successful! Building now has ${newWorkerList.length} workers`);
            console.log(`Worker list: [${newWorkerList.join(', ')}]`);

            return true;

        } catch (error) {
            console.error('Error during global unassignment:', error);
            return false;
        }
    }

    public static getWorkersForBuilding(buildingId: string): string[] {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const workers = storage.buildingWorkers[buildingId] || [];
        console.log(`getWorkersForBuilding("${buildingId}"): [${workers.join(', ')}]`);
        return [...workers]; // Clone pour éviter les mutations
    }

    public static getWorkerCount(buildingId: string): number {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const count = (storage.buildingWorkers[buildingId] || []).length;
        console.log(`getWorkerCount("${buildingId}"): ${count}`);
        return count;
    }

    public static getBuildingForWorker(workerId: string): string | null {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const buildingId = storage.workerBuildings[workerId] || null;
        console.log(`getBuildingForWorker("${workerId}"): "${buildingId}"`);
        return buildingId;
    }

    public static isWorkerAssigned(workerId: string): boolean {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const assigned = !!storage.workerBuildings[workerId];
        console.log(`isWorkerAssigned("${workerId}"): ${assigned}`);
        return assigned;
    }

    public static clearBuildingWorkers(buildingId: string): void {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const workers = storage.buildingWorkers[buildingId] || [];

        // Retirer tous les workers de ce bâtiment
        workers.forEach(workerId => {
            delete storage.workerBuildings[workerId];
        });

        // Vider la liste des workers du bâtiment
        storage.buildingWorkers[buildingId] = [];

        console.log(`Cleared all workers from building: ${buildingId}`);
    }

    public static debugStorage(): void {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;

        console.log('\n=== GLOBAL STORAGE DEBUG ===');
        console.log('Raw storage object:', storage);
        console.log('Building -> Workers:');
        Object.entries(storage.buildingWorkers).forEach(([buildingId, workers]) => {
            console.log(`  ${buildingId}: [${workers.join(', ')}]`);
        });

        console.log('Worker -> Building:');
        Object.entries(storage.workerBuildings).forEach(([workerId, buildingId]) => {
            console.log(`  ${workerId}: ${buildingId}`);
        });
        console.log('=== END GLOBAL STORAGE DEBUG ===\n');
    }

    public static getAllAssignments(): { buildingWorkers: Record<string, string[]>, workerBuildings: Record<string, string> } {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        return {
            buildingWorkers: { ...storage.buildingWorkers },
            workerBuildings: { ...storage.workerBuildings }
        };
    }
}
