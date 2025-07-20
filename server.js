// .idea/server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'schedules.json');

app.use(cors({
    origin: 'https://ez3zy.github.io'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Schedule backend is running.');
});

async function readSchedules() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

async function writeSchedules(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/schedule', async (req, res) => {
    const { username, schedule } = req.body;
    if (!username || !schedule) {
        return res.status(400).json({ error: 'Missing data' });
    }
    const schedules = await readSchedules();
    schedules[username] = schedule;
    await writeSchedules(schedules);
    res.json({ success: true });
});

app.get('/api/schedule', async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: 'Missing username' });
    }
    const schedules = await readSchedules();
    res.json({ schedule: schedules[username] || [] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});