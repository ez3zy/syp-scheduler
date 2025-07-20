const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'schedules.json');

app.use(express.json());

function readSchedules() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeSchedules(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/schedule', (req, res) => {
    const { username, schedule } = req.body;
    if (!username || !schedule) return res.status(400).json({ error: 'Missing data' });
    const schedules = readSchedules();
    schedules[username] = schedule;
    writeSchedules(schedules);
    res.json({ success: true });
});

app.get('/api/schedule', (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Missing username' });
    const schedules = readSchedules();
    res.json({ schedule: schedules[username] || [] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});