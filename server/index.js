const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PORT = process.env.PORT || 4000;
const KEY = 'recentFiles';

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await client.connect();

  app.get('/recent', async (req, res) => {
    try {
      const items = await client.lRange(KEY, 0, 9);
      const parsed = items.map((i) => {
        try { return JSON.parse(i); } catch (e) { return i; }
      });
      res.json(parsed);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'failed' });
    }
  });

  app.post('/recent', async (req, res) => {
    try {
      const file = req.body;
      if (!file || !file.name) return res.status(400).json({ error: 'invalid' });
      await client.lPush(KEY, JSON.stringify(file));
      await client.lTrim(KEY, 0, 9);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'failed' });
    }
  });

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
})();
