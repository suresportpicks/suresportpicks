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

function normalizeGame(game, sport, fallbackStatus) {
  const score = game.score || {};
  const home = game.home_team ?? game.homeTeam ?? game.home ?? game.teams?.home;
  const away = game.away_team ?? game.awayTeam ?? game.away ?? game.teams?.away;

  return {
    id: `${sport}-${game.id ?? game.game_id ?? `${getTeamName(home)}-${getTeamName(away)}`}`,
    sport,
    league: game.league_name || game.league?.name || game.league || game.competition?.name || game.competition || '',
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
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const [footballResponse, basketballResponse] = await Promise.all([
    axios.get(`https://sportapi.ai/api/fixtures/date/${date}`, { headers, timeout: 10000 }),
    axios.get('https://sportapi.ai/api/basketball/games/live', { headers, timeout: 10000 })
  ]);

  if (footballResponse.data?.success === false || basketballResponse.data?.success === false) {
    throw new Error('SportAPI returned an unsuccessful response');
  }

  const footballGames = getItems(footballResponse.data)
    .filter(game => ['LIVE', 'HT'].includes(String(game.status).toUpperCase()))
    .map(game => normalizeGame(game, 'Soccer', 'LIVE'));
  const basketballGames = getItems(basketballResponse.data)
    .map(game => normalizeGame(game, 'Basketball', 'LIVE'));

  return [...footballGames, ...basketballGames];
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
