export class Database {
    private db!: IDBDatabase;

    public async open() {
        const dbRequest = window.indexedDB.open('QuickNotes', 1);

        return new Promise((resolve, reject) => {
            dbRequest.addEventListener('error', () => reject(dbRequest.error));
            dbRequest.addEventListener('success', () => {
                this.db = dbRequest.result;
                resolve();
            });
            dbRequest.addEventListener('upgradeneeded', () => {
                dbRequest.result.createObjectStore('notes', { keyPath: 'id' });
            });
        });
    }

    public getObjectStore(name: string) {
        return this.db
            .transaction([name], 'readwrite')
            .objectStore(name);
    }
}