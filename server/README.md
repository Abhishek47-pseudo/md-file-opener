# md-viewer Server

This backend stores the user's recent markdown files in Redis and exposes a tiny API for the frontend.

## Requirements

- Node.js 14+
- Redis server running locally or available via `REDIS_URL`

## Install

```bash
cd server
npm install
```

## Run

```bash
npm start
```

By default the API runs on `http://localhost:4000`.

## API Endpoints

- `GET /recent`
  - Returns the last 10 recent files
- `POST /recent`
  - Accepts JSON body `{ name: string, time: string }`
  - Stores the file entry in Redis

## Environment

You can override the Redis connection URL using `REDIS_URL`:

```bash
export REDIS_URL=redis://localhost:6379
npm start
```

On Windows PowerShell:

```powershell
$env:REDIS_URL = 'redis://localhost:6379'
npm start
```
