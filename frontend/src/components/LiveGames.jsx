import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, CalendarClock, RefreshCw, Trophy } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const REFRESH_INTERVAL_MS = 60 * 1000
const FILTERS = [
  { id: 'ALL', label: 'All leagues' },
  { id: 'NBA', label: 'NBA' },
  { id: 'WNBA', label: 'WNBA' },
  { id: 'NCAA', label: 'NCAA' },
  { id: 'NBL', label: 'NBL' },
  { id: 'NFL', label: 'NFL' },
  { id: 'MLB', label: 'MLB' },
  { id: 'NHL', label: 'NHL' },
  { id: 'MLS', label: 'MLS' }
]

const getTeamMark = (name) => {
  const words = name.split(/\s+/).filter(Boolean)
  return words.length > 1
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : (words[0] || '?').slice(0, 2).toUpperCase()
}

const LiveGames = () => {
  const { API_BASE } = useAuth()
  const [games, setGames] = useState({ liveGames: [], upcomingGames: [] })
  const [activeView, setActiveView] = useState('upcoming')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadGames = useCallback(async (signal) => {
    setRefreshing(true)
    try {
      const response = await fetch(`${API_BASE}/games`, { signal })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load game schedules')
      setGames({
        liveGames: data.liveGames || [],
        upcomingGames: data.upcomingGames || []
      })
      setLastUpdated(new Date())
      setError('')
    } catch (loadError) {
      if (loadError.name === 'AbortError') return
      setError(loadError.message)
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [API_BASE])

  useEffect(() => {
    const controller = new AbortController()
    loadGames(controller.signal)
    const intervalId = window.setInterval(() => loadGames(controller.signal), REFRESH_INTERVAL_MS)
    return () => {
      window.clearInterval(intervalId)
      controller.abort()
    }
  }, [loadGames])

  const visibleGames = useMemo(
    () => {
      const gamesForView = activeView === 'live' ? games.liveGames : games.upcomingGames
      return activeFilter === 'ALL'
        ? gamesForView
        : gamesForView.filter(game => game.leagueId === activeFilter)
    },
    [activeFilter, activeView, games]
  )

  return (
    <section className="relative isolate overflow-hidden bg-[#080d18] py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.12),transparent_58%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-400">
              <span className="h-px w-7 bg-gold-500/70" />
              The live board
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Live &amp; <span className="text-gold-400">upcoming.</span>
              </h2>
              {games.liveGames.length > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-red-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                  </span>
                  Live now
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Follow live scores and upcoming games across every league.
              {lastUpdated && (
                <span className="ml-2 text-slate-500">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-1" aria-label="Filter games by league">
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-gold-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => loadGames()}
              disabled={refreshing}
              aria-label="Refresh live scores"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5 text-slate-300 transition hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (games.liveGames.length > 0 || games.upcomingGames.length > 0) && (
          <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-200">
            <span>Game schedules couldn’t be updated. Showing the latest available games.</span>
            <button type="button" onClick={() => loadGames()} className="font-semibold underline underline-offset-4">
              Try again
            </button>
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Choose live or upcoming games">
          {[
            { id: 'upcoming', label: 'Upcoming', count: games.upcomingGames.length, icon: CalendarClock },
            { id: 'live', label: 'Live now', count: games.liveGames.length, icon: Activity }
          ].map(view => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
                aria-pressed={activeView === view.id}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  activeView === view.id
                    ? 'border-gold-400/30 bg-gold-400/[0.08] text-gold-200'
                    : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {view.label}
                <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] tabular-nums">{view.count}</span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map(item => (
              <div key={item} className="h-52 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.03]" />
            ))}
          </div>
        ) : visibleGames.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleGames.map(game => (
              <article
                key={game.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#151d2b] via-[#111825] to-[#0d1420] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-[0_18px_48px_rgba(0,0,0,0.32)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-60" />
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-400/15 bg-gold-400/[0.08] text-gold-300">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold tracking-wide text-white">{game.sport}</p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{game.league || 'Regular season'}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    activeView === 'live' ? 'bg-red-400/[0.08] text-red-300' : 'bg-gold-400/[0.08] text-gold-200'
                  }`}>
                    {activeView === 'live' ? <Activity className="h-3 w-3" /> : <CalendarClock className="h-3 w-3" />}
                    {activeView === 'live' ? (game.status || 'Live') : 'Scheduled'}
                  </span>
                </div>

                <div className="space-y-3">
                  {[{ name: game.awayTeam, score: game.awayScore }, { name: game.homeTeam, score: game.homeScore }].map((team, teamIndex) => (
                    <div key={`${game.id}-${teamIndex}`} className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tracking-wide ${
                        teamIndex === 0
                          ? 'border border-white/10 bg-white/[0.06] text-slate-200'
                          : 'border border-gold-400/20 bg-gold-400/[0.08] text-gold-200'
                      }`}>
                        {getTeamMark(team.name || 'Team')}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-200 sm:text-base">
                        {team.name || (teamIndex === 0 ? 'Away team' : 'Home team')}
                      </span>
                      <span className="min-w-8 text-right text-2xl font-bold tabular-nums tracking-tight text-white">
                        {team.score ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[11px]">
                  <span className="font-medium uppercase tracking-[0.14em] text-slate-500">
                    {activeView === 'live' ? 'Game in progress' : 'Starts'}
                  </span>
                  <span className="font-semibold tabular-nums text-gold-300">
                    {activeView === 'live'
                      ? (game.period ? `Period ${game.period}` : game.clock || 'Live')
                      : (game.startTime
                          ? new Date(game.startTime).toLocaleString([], {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })
                          : 'Time TBA')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : error ? (
          <div role="status" className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-9 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold text-white">Live scores are taking a breather</p>
              <p className="mt-1 text-xs text-slate-500">We couldn’t reach the scoreboards. Try again in a moment.</p>
            </div>
            <button type="button" onClick={() => loadGames()} className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-gold-400/40 hover:text-gold-300 sm:mt-0">
              Retry scores
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#121a27] via-[#101725] to-[#121a27] px-6 py-8 sm:px-8">
            <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 text-gold-400/[0.07] sm:block">
              <Trophy className="h-24 w-24" />
            </div>
            <div className="relative flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-400/15 bg-gold-400/[0.07] text-gold-300">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-white">
                  {activeView === 'upcoming'
                    ? (activeFilter === 'ALL' ? 'No upcoming games scheduled' : `No upcoming ${activeFilter} games scheduled`)
                    : (activeFilter === 'ALL' ? 'No games on the board right now' : `No live ${activeFilter} games right now`)}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {activeView === 'upcoming'
                    ? 'Check back soon as new games are added to the schedule.'
                    : 'When the next game tips off or kicks off, you’ll find it here.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default LiveGames
