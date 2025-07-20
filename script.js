let currentCell = null;
let editMode = true;

const saveScheduleBtn = document.getElementById('saveScheduleBtn');
const toggleBtn = document.getElementById('toggleModeBtn');


document.addEventListener('DOMContentLoaded', function() {
    let username = null;

    const usernameModal = document.getElementById('usernameModal');
    const usernameInput = document.getElementById('usernameInput');
    const usernameSubmitBtn = document.getElementById('usernameSubmitBtn');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');

    usernameModal.style.display = 'flex';

    usernameSubmitBtn.onclick = function() {
        const input = usernameInput.value.trim();
        if (input) {
            username = input;
            usernameModal.style.display = 'none';
            loadSchedule(username);
        }
    };

    saveScheduleBtn.addEventListener('click', function() {
        if (!username) {
            alert('No username set. Please reload and enter your username.');
            return;
        }
        saveSchedule(username);
        alert('Schedule saved for user: ' + username);
    });
});

function saveSchedule(username) {
    const table = document.querySelector('.table-container table');
    const rows = table.tBodies[0].rows;
    const schedule = [];

    for (let i = 0; i < rows.length; i++) {
        const rowData = [];
        for (let j = 1; j < rows[i].cells.length; j++) {
            rowData.push(rows[i].cells[j].textContent);
        }
        schedule.push(rowData);
    }

    fetch('https://syp-scheduler.onrender.com/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, schedule })
    });
}

// Load schedule from server
function loadSchedule(username) {
    fetch(`https://syp-scheduler.onrender.com/api/schedule?username=${username}`);        .then(res => res.json())
        .then(data => {
            const table = document.querySelector('.table-container table');
            const rows = table.tBodies[0].rows;
            const schedule = data.schedule;
            for (let i = 0; i < rows.length; i++) {
                for (let j = 1; j < rows[i].cells.length; j++) {
                    rows[i].cells[j].textContent = schedule[i] && schedule[i][j - 1] ? schedule[i][j - 1] : '';
                }
            }
        });
}

toggleBtn.onclick = function() {
    editMode = !editMode;
    this.textContent = editMode ? 'Switch to View Mode' : 'Switch to Edit Mode';
    this.classList.toggle('edit-mode', editMode);
    this.classList.toggle('view-mode', !editMode);
    saveScheduleBtn.style.display = editMode ? 'block' : 'none';
};


function cellClicked(cell) {
    if (!editMode) return;
    currentCell = cell;
    document.getElementById('detailsModal').style.display = 'block';
    document.getElementById('cellInput').value = cell.textContent;
}

document.getElementById('saveBtn').onclick = function() {
    if (currentCell) {
        currentCell.textContent = document.getElementById('cellInput').value;
        currentCell.style.backgroundColor = '#fde68a';
    }
    document.getElementById('detailsModal').style.display = 'none';
};

document.getElementById('closeModal').onclick = function() {
    document.getElementById('detailsModal').style.display = 'none';
};

document.getElementById('clearBtn').onclick = function() {
    if (currentCell) {
        currentCell.textContent = '';
        currentCell.style.backgroundColor = '';
    }
    document.getElementById('detailsModal').style.display = 'none';
};