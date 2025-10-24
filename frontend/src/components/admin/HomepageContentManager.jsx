import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Save, Plus, Trash2, Edit, Eye, EyeOff, ArrowUp, ArrowDown,
  Image, Link, Type, FileText, Star, Award, Shield, Clock,
  BarChart3, Zap, Users, TrendingUp, CheckCircle, AlertCircle
} from 'lucide-react'
import axios from 'axios'

const HomepageContentManager = () => {
  const { token } = useAuth()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/homepage/content')
      setContent(response.data)
    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      await axios.put('/api/homepage/content', content, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: 'Content updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field, value) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }))
  }

  const addSection = () => {
    const newSection = {
      title: 'New Section',
      subtitle: 'Section subtitle',
      content: 'Section content goes here...',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      enabled: true,
      order: content.sections.length
    }
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const updateSection = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeSection = (index) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const moveSection = (index, direction) => {
    const newSections = [...content.sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newSections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
      setContent(prev => ({ ...prev, sections: newSections }))
    }
  }

  const addFeature = () => {
    const newFeature = {
      icon: 'Star',
      title: 'New Feature',
      description: 'Feature description',
      enabled: true
    }
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        items: [...(prev.features.items || []), newFeature]
      }
    }))
  }

  const updateFeature = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.map((feature, i) => 
          i === index ? { ...feature, [field]: value } : feature
        )
      }
    }))
  }

  const removeFeature = (index) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index)
      }
    }))
  }

  const iconOptions = [
    'Star', 'Award', 'Shield', 'Clock', 'BarChart3', 'Zap', 
    'Users', 'TrendingUp', 'CheckCircle', 'AlertCircle'
  ]

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>
  }

  if (!content) {
    return <div className="text-center py-8 text-red-600">Failed to load content</div>
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Type },
    { id: 'sections', label: 'Custom Sections', icon: FileText },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'about', label: 'About', icon: Users },
    { id: 'seo', label: 'SEO Settings', icon: BarChart3 }
  ]

  return (
    <div className="space-y-6">
      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveContent}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Hero Section</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.hero?.title || ''}
                  onChange={(e) => updateHero('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={content.hero?.subtitle || ''}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={content.hero?.description || ''}
                  onChange={(e) => updateHero('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={content.hero?.ctaText || ''}
                  onChange={(e) => updateHero('ctaText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  value={content.hero?.ctaLink || ''}
                  onChange={(e) => updateHero('ctaLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Custom Sections</h4>
              <button
                onClick={addSection}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Section
              </button>
            </div>
            
            {content.sections?.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-medium">Section {index + 1}</h5>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === content.sections.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateSection(index, 'enabled', !section.enabled)}
                      className={`p-1 ${section.enabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeSection(index)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={section.buttonText}
                      onChange={(e) => updateSection(index, 'buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={section.buttonLink}
                      onChange={(e) => updateSection(index, 'buttonLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Features Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={content.features?.title || ''}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      features: { ...prev.features, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={content.features?.subtitle || ''}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      features: { ...prev.features, subtitle: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h5 className="font-medium">Feature Items</h5>
              <button
                onClick={addFeature}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </button>
            </div>

            {content.features?.items?.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h6 className="font-medium">Feature {index + 1}</h6>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateFeature(index, 'enabled', !feature.enabled)}
                      className={`p-1 ${feature.enabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {feature.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">About Section</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.about?.title || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    about: { ...prev.about, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={content.about?.content || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    about: { ...prev.about, content: e.target.value }
                  }))}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={content.about?.imageUrl || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    about: { ...prev.about, imageUrl: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">SEO Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.seo?.title || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    seo: { ...prev.seo, title: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={content.seo?.description || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    seo: { ...prev.seo, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={content.seo?.keywords || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    seo: { ...prev.seo, keywords: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomepageContentManager