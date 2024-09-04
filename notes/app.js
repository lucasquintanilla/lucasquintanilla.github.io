const notes = [
    { text: 'This is a sample note...', pinned: false },
    { text: 'Pin important notes!', pinned: true },
];

const noteList = document.querySelector('.notes');
const pinnedList = document.querySelector('.pinned-notes');

function renderNotes() {
    noteList.innerHTML = '';
    pinnedList.innerHTML = '<h2>Pinned</h2>';

    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note-card');
        noteElement.innerHTML = `
            <p>${note.text}</p>
            <span class="material-icons pin-icon">${note.pinned ? 'push_pin' : 'push_pin'}</span>
        `;

        noteElement.querySelector('.pin-icon').addEventListener('click', () => {
            togglePin(index);
        });

        if (note.pinned) {
            pinnedList.appendChild(noteElement);
        } else {
            noteList.appendChild(noteElement);
        }
    });
}

function togglePin(index) {
    notes[index].pinned = !notes[index].pinned;
    renderNotes();
}

document.querySelector('.fab').addEventListener('click', () => {
    const newNote = prompt('Enter your new note:');
    if (newNote) {
        notes.push({ text: newNote, pinned: false });
        renderNotes();
    }
});

renderNotes();
