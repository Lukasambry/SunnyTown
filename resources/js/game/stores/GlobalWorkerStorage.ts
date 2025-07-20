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
        }
    }

    public static assignWorkerToBuilding(workerId: string, buildingId: string, maxWorkers: number): boolean {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;

        if (!workerId || !buildingId) {
            console.error('Invalid workerId or buildingId');
            return false;
        }

        if (storage.workerBuildings[workerId]) {
            const currentBuildingId = storage.workerBuildings[workerId];
            console.warn(`Worker already assigned to building: ${currentBuildingId}`);
            return false;
        }

        const currentWorkers = storage.buildingWorkers[buildingId] || [];
        if (currentWorkers.length >= maxWorkers) {
            console.error(`Building at capacity: ${currentWorkers.length}/${maxWorkers}`);
            return false;
        }

        try {
            const newWorkerList = [...currentWorkers, workerId];
            storage.buildingWorkers[buildingId] = newWorkerList;

            storage.workerBuildings[workerId] = buildingId;

            return true;

        } catch (error) {
            console.error('Error during global assignment:', error);
            return false;
        }
    }

    public static unassignWorkerFromBuilding(workerId: string): boolean {
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
            const currentWorkers = storage.buildingWorkers[buildingId] || [];
            const newWorkerList = currentWorkers.filter(id => id !== workerId);
            storage.buildingWorkers[buildingId] = newWorkerList;

            delete storage.workerBuildings[workerId];

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
        return [...workers];
    }

    public static getWorkerCount(buildingId: string): number {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const count = (storage.buildingWorkers[buildingId] || []).length;
        return count;
    }

    public static getBuildingForWorker(workerId: string): string | null {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const buildingId = storage.workerBuildings[workerId] || null;
        return buildingId;
    }

    public static isWorkerAssigned(workerId: string): boolean {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const assigned = !!storage.workerBuildings[workerId];
        return assigned;
    }

    public static clearBuildingWorkers(buildingId: string): void {
        this.ensureStorage();
        const storage = window.__WORKER_BUILDING_STORAGE__!;
        const workers = storage.buildingWorkers[buildingId] || [];

        workers.forEach(workerId => {
            delete storage.workerBuildings[workerId];
        });

        storage.buildingWorkers[buildingId] = [];
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
