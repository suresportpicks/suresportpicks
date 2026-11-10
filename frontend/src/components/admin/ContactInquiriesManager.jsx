import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Mail, Phone, Calendar, Clock, User, MessageSquare, 
  CheckCircle, XCircle, AlertCircle, Eye, Send, 
  Filter, Search, RefreshCw, FileText, Star,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const ContactInquiriesManager = () => {
  const { token } = useAuth()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [sending, setSending] = useState(false)
  const [expandedInquiry, setExpandedInquiry] = useState(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${API_BASE}/homepage/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInquiries(response.data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId, status) => {
    try {
      await axios.put(`/api/homepage/inquiries/${inquiryId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId ? { ...inquiry, status } : inquiry
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const sendResponse = async (inquiryId) => {
    if (!responseText.trim()) return
    
    setSending(true)
    try {
      await axios.post(`/api/homepage/inquiries/${inquiryId}/respond`, 
        { response: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId 
          ? { 
              ...inquiry, 
              adminResponse: responseText,
              respondedAt: new Date(),
              status: 'responded'
            } 
          : inquiry
      ))
      
      setResponseText('')
      setSelectedInquiry(null)
    } catch (error) {
      console.error('Error sending response:', error)
    } finally {
      setSending(false)
    }
  }

  const addNote = async (inquiryId) => {
    if (!noteText.trim()) return
    
    try {
      await axios.post(`/api/homepage/inquiries/${inquiryId}/note`, 
        { note: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId 
          ? { 
              ...inquiry, 
              internalNotes: [...(inquiry.internalNotes || []), {
                note: noteText,
                addedAt: new Date(),
                addedBy: 'Admin' // You might want to get actual admin name
              }]
            } 
          : inquiry
      ))
      
      setNoteText('')
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'plan_request': return <Star className="w-4 h-4" />
      case 'general': return <MessageSquare className="w-4 h-4" />
      case 'support': return <AlertCircle className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesFilter = filter === 'all' || inquiry.status === filter || inquiry.type === filter
    const matchesSearch = searchTerm === '' || 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Contact Inquiries & Plan Requests</h4>
        <button
          onClick={fetchInquiries}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
            <option value="plan_request">Plan Requests</option>
            <option value="general">General Inquiries</option>
            <option value="support">Support</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {inquiries.filter(i => i.status === 'new').length}
          </div>
          <div className="text-sm text-blue-600">New</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {inquiries.filter(i => i.status === 'in_progress').length}
          </div>
          <div className="text-sm text-yellow-600">In Progress</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {inquiries.filter(i => i.status === 'responded').length}
          </div>
          <div className="text-sm text-green-600">Responded</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {inquiries.filter(i => i.type === 'plan_request').length}
          </div>
          <div className="text-sm text-purple-600">Plan Requests</div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inquiries found matching your criteria.
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div key={inquiry._id} className="border border-gray-200 rounded-lg">
              {/* Inquiry Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(inquiry.type)}
                    <div>
                      <h5 className="font-medium">{inquiry.subject}</h5>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{inquiry.name}</span>
                        <Mail className="w-3 h-3" />
                        <span>{inquiry.email}</span>
                        {inquiry.phone && (
                          <>
                            <Phone className="w-3 h-3" />
                            <span>{inquiry.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setExpandedInquiry(
                        expandedInquiry === inquiry._id ? null : inquiry._id
                      )}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {expandedInquiry === inquiry._id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedInquiry === inquiry._id && (
                <div className="p-4 space-y-4">
                  {/* Message */}
                  <div>
                    <h6 className="font-medium mb-2">Message:</h6>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{inquiry.message}</p>
                  </div>

                  {/* Plan Request Details */}
                  {inquiry.type === 'plan_request' && inquiry.planDetails && (
                    <div>
                      <h6 className="font-medium mb-2">Plan Request Details:</h6>
                      <div className="bg-blue-50 p-3 rounded space-y-2">
                        {inquiry.planDetails.planType && (
                          <div><strong>Plan Type:</strong> {inquiry.planDetails.planType}</div>
                        )}
                        {inquiry.planDetails.budget && (
                          <div><strong>Budget:</strong> {inquiry.planDetails.budget}</div>
                        )}
                        {inquiry.planDetails.duration && (
                          <div><strong>Duration:</strong> {inquiry.planDetails.duration}</div>
                        )}
                        {inquiry.planDetails.requirements && (
                          <div><strong>Requirements:</strong> {inquiry.planDetails.requirements}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div>
                    <h6 className="font-medium mb-2">Update Status:</h6>
                    <div className="flex space-x-2">
                      {['new', 'in_progress', 'responded', 'closed'].map(status => (
                        <button
                          key={status}
                          onClick={() => updateInquiryStatus(inquiry._id, status)}
                          className={`px-3 py-1 rounded text-sm ${
                            inquiry.status === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {status.replace('_', ' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Response Section */}
                  {inquiry.adminResponse ? (
                    <div>
                      <h6 className="font-medium mb-2">Admin Response:</h6>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-gray-700">{inquiry.adminResponse}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Sent on {new Date(inquiry.respondedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h6 className="font-medium mb-2">Send Response:</h6>
                      <div className="space-y-2">
                        <textarea
                          value={selectedInquiry === inquiry._id ? responseText : ''}
                          onChange={(e) => {
                            setResponseText(e.target.value)
                            setSelectedInquiry(inquiry._id)
                          }}
                          placeholder="Type your response here..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => sendResponse(inquiry._id)}
                          disabled={sending || !responseText.trim() || selectedInquiry !== inquiry._id}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {sending ? 'Sending...' : 'Send Response'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Internal Notes */}
                  <div>
                    <h6 className="font-medium mb-2">Internal Notes:</h6>
                    {inquiry.internalNotes && inquiry.internalNotes.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {inquiry.internalNotes.map((note, index) => (
                          <div key={index} className="bg-yellow-50 p-2 rounded text-sm">
                            <p>{note.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              By {note.addedBy} on {new Date(note.addedAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add internal note..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addNote(inquiry._id)}
                        disabled={!noteText.trim()}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ContactInquiriesManager