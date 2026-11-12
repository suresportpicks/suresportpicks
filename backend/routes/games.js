const express = require('express');
const axios = require('axios');

const router = express.Router();
const CACHE_DURATION_MS = 5 * 60 * 1000;

let cache = { expiresAt: 0, games: null };
let requestInFlight = null;

function getItems(payload) {
  const data = payload?.data ?? payload?.games ?? payload?.results;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.games)) return data.games;
  if (Array.isArray(data?.matches)) return data.matches;
  if (Array.isArray(data?.fixtures)) return data.fixtures;
  return [];
}

function getTeamName(value) {
  if (typeof value === 'string') return value;
  return value?.name || value?.team_name || value?.full_name || '';
}

function getLeagueName(game) {
  const league = game.league ?? game.competition;
  if (typeof league === 'string') return league;
  return game.league_name || league?.name || league?.slug || '';
}

function getLeaguePriority(game) {
  const league = getLeagueName(game).toUpperCase().replace(/[^A-Z0-9]+/g, ' ');
  if (/\bNBA\b/.test(league)) return 0;
  if (/\bNCAA(?:B)?\b/.test(league)) return 1;
  return -1;
}

function normalizeGame(game, sport, fallbackStatus) {
  const score = game.score || {};
  const home = game.home_team ?? game.homeTeam ?? game.home ?? game.teams?.home;
  const away = game.away_team ?? game.awayTeam ?? game.away ?? game.teams?.away;

  return {
    id: `${sport}-${game.id ?? game.game_id ?? `${getTeamName(home)}-${getTeamName(away)}`}`,
    sport,
    league: getLeagueName(game),
    homeTeam: getTeamName(home) || game.home_team_name || game.home_name || '',
    awayTeam: getTeamName(away) || game.away_team_name || game.away_name || '',
    homeScore: game.home_score ?? game.home_points ?? game.homeScore ?? score.home ?? null,
    awayScore: game.away_score ?? game.away_points ?? game.awayScore ?? score.away ?? null,
    status: game.status || fallbackStatus,
    clock: game.minute || game.clock || game.game_clock || '',
    period: game.period || game.current_period || '',
    updatedAt: game.updated_at || null
  };
}

async function fetchProviderGames() {
  const apiKey = process.env.SPORTAPI_API_KEY;
  if (!apiKey) {
    const error = new Error('SPORTAPI_API_KEY is not configured');
    error.statusCode = 503;
    throw error;
  }

  const headers = { 'X-Api-Key': apiKey };
  const response = await axios.get('https://sportapi.ai/api/basketball/games/live', {
    headers,
    timeout: 10000
  });

  if (response.data?.success === false) {
    throw new Error('SportAPI returned an unsuccessful response');
  }

  return getItems(response.data)
    .map(game => ({ game, priority: getLeaguePriority(game) }))
    .filter(({ priority }) => priority >= 0)
    .sort((a, b) => a.priority - b.priority)
    .map(({ game }) => normalizeGame(game, 'Basketball', 'LIVE'));
}

router.get('/live', async (req, res) => {
  if (!process.env.SPORTAPI_API_KEY) {
    return res.status(503).json({ message: 'Live games are not configured' });
  }

  if (cache.games && cache.expiresAt > Date.now()) {
    return res.json({ games: cache.games });
  }

  const request = requestInFlight || (requestInFlight = fetchProviderGames());
  try {
    const games = await request;
    cache = { games, expiresAt: Date.now() + CACHE_DURATION_MS };
    return res.json({ games });
  } catch (error) {
    console.error('Live games fetch error:', error.message);
    return res.status(error.statusCode || 502).json({
      message: 'Unable to load live games'
    });
  } finally {
    if (requestInFlight === request) requestInFlight = null;
  }
});

module.exports = router;
