import React, { useCallback, useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

const LiveGames = () => {
  const { API_BASE } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadGames = useCallback(async (signal) => {
    try {
      const response = await fetch(`${API_BASE}/games/live`, { signal })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to load live games')
      setGames(data.games || [])
      setError('')
    } catch (loadError) {
      if (loadError.name === 'AbortError') return
      setError(loadError.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
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

  return (
    <section className="py-8 sm:py-10 bg-navy-900/70 border-y border-gold-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-red-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">NBA &amp; NCAA Live Games</h2>
            {games.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={loadGames}
            disabled={loading}
            aria-label="Refresh live games"
            className="p-2 rounded-lg text-gray-300 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error ? (
          <p role="status" className="text-sm text-amber-300">{error}. Please try again later.</p>
        ) : loading ? (
          <p className="text-sm text-gray-400">Checking for live games…</p>
        ) : games.length === 0 ? (
          <p className="text-sm text-gray-400">No live games right now. Check back during game time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {games.map(game => (
              <article
                key={game.id}
                className="rounded-xl border border-gold-500/20 bg-navy-950/80 p-4"
              >
                <div className="flex justify-between gap-3 text-xs text-gray-400 mb-3">
                  <span>{game.sport}{game.league ? ` · ${game.league}` : ''}</span>
                  <span className="text-red-400 font-semibold">{game.clock || game.period || game.status}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-white font-semibold">
                    <span className="truncate">{game.homeTeam || 'Home'}</span>
                    <span>{game.homeScore ?? '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-white font-semibold">
                    <span className="truncate">{game.awayTeam || 'Away'}</span>
                    <span>{game.awayScore ?? '—'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LiveGames
