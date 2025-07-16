import { saveGameManager } from './SaveGameManager';

export class SaveIntegrationService {
    private static instance: SaveIntegrationService;

    public static getInstance(): SaveIntegrationService {
        if (!SaveIntegrationService.instance) {
            SaveIntegrationService.instance = new SaveIntegrationService();
        }
        return SaveIntegrationService.instance;
    }

    public manualSave(): void {
        saveGameManager.saveGame();
    }

    public exportSave(): void {
        const saveData = saveGameManager.exportSave();
        if (saveData) {
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `sunnytown_save_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Export réussi',
                    message: 'Sauvegarde exportée avec succès !',
                    duration: 3000
                }
            }));
        }
    }

    public importSave(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const content = e.target?.result as string;
                        saveGameManager.importSave(content);
                    } catch (error) {
                        window.dispatchEvent(new CustomEvent('game:notification', {
                            detail: {
                                type: 'error',
                                title: 'Erreur d\'import',
                                message: `Erreur: ${error.message}`,
                                duration: 12000
                            }
                        }));
                    }
                };
                reader.readAsText(file);
            }
        };

        input.click();
    }

    public loadGameData(): void {
        const data = saveGameManager.loadGame();
        if (data) {
            saveGameManager.applyLoadedData(data);
        }
    }

    public resetGame(): void {
        localStorage.removeItem('sunnytown_savegame');
        window.location.reload();
    }

    public initialize(): void {
    }
}

export const saveIntegrationService = SaveIntegrationService.getInstance();
