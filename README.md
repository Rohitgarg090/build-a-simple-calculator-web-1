# Calculator Web App

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- A [Supabase](https://supabase.com) account and project

## Project Structure

/
├── frontend/          # Next.js app
├── backend/           # Node.js + Express API
├── package.json       # Root workspace config
└── .env.example       # Environment variable template

## Setup

### 1. Clone & Install

git clone <your-repo-url>
cd calculator-app
npm install

### 2. Configure Environment Variables

cp .env.example .env
# Fill in your Supabase URL, anon key, and other values

### 3. Set Up Supabase

Run the following SQL in your Supabase SQL editor:

CREATE TABLE calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expression TEXT NOT NULL,
  result NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### 4. Run the Backend

cd backend
npm install
npm run dev
# Runs on http://localhost:4000

### 5. Run the Frontend

cd frontend
npm install
npm run dev
# Runs on http://localhost:3000

## Available Scripts (Root)

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend and backend concurrently |
| `npm run dev:frontend` | Start only the Next.js app |
| `npm run dev:backend` | Start only the Express API |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/calculate` | Evaluate an expression and save to DB |
| `GET` | `/api/history` | Retrieve all past calculations |
| `DELETE` | `/api/history/:id` | Delete a specific calculation |

## Environment Variables

See `.env.example` for all required variables.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)