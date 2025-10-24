import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Referral = () => {
  const { user, token } = useContext(AuthContext)
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    referralHistory: []
  })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/referral-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      }
    } catch (err) {
      console.error('Error fetching referral data:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralData.referralCode}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform) => {
    const referralLink = `${window.location.origin}/register?ref=${referralData.referralCode}`
    const message = "Join me on SureSportPicks and get exclusive betting tips! Use my referral link:"
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading referral data...</p>
        </div>
      </div>
    )
  }

  const referralLink = `${window.location.origin}/register?ref=${referralData.referralCode}`

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Referral Program</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${referralData.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${referralData.pendingEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Referral Code</p>
                <p className="text-lg font-bold text-gray-900">{referralData.referralCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Share Your Referral Link */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Referral Link</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Referral Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Share on Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                
                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </button>
                
                <button
                  onClick={() => shareOnSocial('telegram')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How It Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share your referral link with friends</li>
                <li>• They sign up and make their first deposit</li>
                <li>• You earn 20% of their first month's subscription</li>
                <li>• Plus 5% of their lifetime deposits as bonus</li>
                <li>• Earnings are paid monthly to your account</li>
              </ul>
            </div>
          </div>

          {/* Referral History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Referral History</h2>
            
            {referralData.referralHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No referrals yet</p>
                <p className="text-sm text-gray-400 mt-1">Start sharing your link to earn rewards!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {referralData.referralHistory.map((referral) => (
                  <div key={referral._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{referral.referredUser.email}</p>
                        <p className="text-sm text-gray-500">Joined {formatDate(referral.createdAt)}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Earnings:</span>
                      <span className="font-medium text-green-600">${referral.earnings.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-3">Referral Program Terms</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Referral bonuses are paid monthly on the 1st of each month</p>
            <p>• Minimum payout threshold is $25</p>
            <p>• Referred users must be active for 30 days to qualify for bonus</p>
            <p>• Self-referrals and fraudulent activity will result in account suspension</p>
            <p>• SureSportPicks reserves the right to modify the referral program at any time</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referral