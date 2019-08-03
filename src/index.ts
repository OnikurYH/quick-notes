import './style/index.css';
import './style/theme/document.css';

import 'regenerator-runtime/runtime';

import { Database } from './database';

let notesContent: HTMLTextAreaElement;
let message: HTMLDivElement;
let saveTimeoutId = -1;
let database: Database;

function save() {
    const putRequest = database
        .getObjectStore('notes')
        .put(
            {
                id: 1,
                contents: notesContent.value,
            },
        );

    function onSuccess() {
        putRequest.removeEventListener('success', onSuccess);
        message.innerText = `Saved in ${(new Date()).toLocaleString()}`;
        message.classList.remove('nav__message--notice');
        setTimeout(() => message.classList.add('nav__message--notice'), 100);
    }
    
    putRequest.addEventListener('success', onSuccess);
}

function startSaveTimeout() {
    window.clearTimeout(saveTimeoutId);
    saveTimeoutId = window.setTimeout(save, 1000);
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

    message = document.querySelector<HTMLDivElement>('.js-message')!;
    notesContent = document.querySelector<HTMLTextAreaElement>('.js-notes-content')!;
    notesContent.addEventListener('keyup', startSaveTimeout);

    document.querySelector<HTMLButtonElement>('.js-save')!.addEventListener('click', save);
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
