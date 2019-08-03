import './style/index.css';
import './style/theme/document.css';

import 'regenerator-runtime/runtime';

import { Database } from './database';

let notesContent: HTMLTextAreaElement;
let saveTimeoutId = -1;
let database: Database;

function startSaveTimeout() {
    window.clearTimeout(saveTimeoutId);
    saveTimeoutId = window.setTimeout(
        () => {
            database
                .getObjectStore('notes')
                .put(
                    {
                        id: 1,
                        contents: notesContent.value,
                    },
                );
        },
        1000,
    );
}

function loadContents() {
    const request = database
        .getObjectStore('notes')
        .get(1);
    request.addEventListener('success', () => {
        if (request.result) {
            notesContent.value = request.result.contents;
        }
    });
}

function initAutoSave() {
    loadContents();

    notesContent = document.querySelector<HTMLTextAreaElement>('.js-notes-content')!;
    notesContent.addEventListener('keyup', () => {
        startSaveTimeout();
    });
}

async function main() {
    if (!window.indexedDB) {
        console.log("Your browser doesn't support IndexedDB. The content will not be saved.");
        return;
    }

    database = new Database();
    await database.open();
    initAutoSave();
}

main()
    .catch(console.error);