const express = require('express');
const axios = require('axios');

const router = express.Router();
const CACHE_DURATION_MS = 60 * 1000;
const SCOREBOARD_URLS = [
  {
    sport: 'NBA',
    url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard'
  },
  {
    sport: 'NFL',
    url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
  }
];

let cache = { expiresAt: 0, games: null };
let requestInFlight = null;

function normalizeGame(event, sport) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find(team => team.homeAway === 'home');
  const away = competitors.find(team => team.homeAway === 'away');
  const status = competition?.status || event.status;
  const statusType = status?.type || {};

  return {
    id: `${sport}-${event.id}`,
    sport,
    league: sport,
    homeTeam: home?.team?.displayName || home?.team?.name || '',
    awayTeam: away?.team?.displayName || away?.team?.name || '',
    homeScore: home?.score ?? null,
    awayScore: away?.score ?? null,
    status: statusType.shortDetail || statusType.detail || statusType.name || 'LIVE',
    clock: status?.displayClock || '',
    period: status?.period || null
  };
}

async function fetchProviderGames() {
  const results = await Promise.allSettled(
    SCOREBOARD_URLS.map(async ({ sport, url }) => {
      const response = await axios.get(url, { timeout: 10000 });
      if (!Array.isArray(response.data?.events)) {
        throw new Error(`${sport} scoreboard returned an invalid response`);
      }

      return response.data.events
        .filter(event => {
          const state = event.competitions?.[0]?.status?.type?.state || event.status?.type?.state;
          return state === 'in';
        })
        .map(event => normalizeGame(event, sport));
    })
  );

  const failedSports = results
    .map((result, index) => result.status === 'rejected' ? SCOREBOARD_URLS[index].sport : null)
    .filter(Boolean);
  if (failedSports.length === results.length) {
    throw new Error(`Scoreboards unavailable for ${failedSports.join(' and ')}`);
  }
  if (failedSports.length) {
    console.error(`Live games unavailable for: ${failedSports.join(', ')}`);
  }

  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);
}

router.get('/live', async (req, res) => {
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
    return res.status(502).json({ message: 'Unable to load live games' });
  } finally {
    if (requestInFlight === request) requestInFlight = null;
  }
});

module.exports = router;
