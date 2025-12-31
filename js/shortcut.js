function toggleShortcutModal(type) {
    const modal = document.getElementById('shortcutModal');
    if(!modal || !type) return;
    switch(type) {
        case "add":
            modal.querySelector('.modal-title').textContent = "Add Shortcut";   
            modal.querySelector('#shortcut-submit-btn').textContent = "Add";
            break;
        case "edit":
            modal.querySelector('.modal-title').textContent = "Edit Shortcut";   
            modal.querySelector('#shortcut-submit-btn').textContent = "Save";
            break;
        case "delete":
            modal.querySelector('.modal-title').textContent = "Delete Shortcut";   
            modal.querySelector('#shortcut-submit-btn').textContent = "Delete";
            break;
    }
    modal.classList.toggle('hidden');
}