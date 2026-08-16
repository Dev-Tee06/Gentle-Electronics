import React, { useEffect, useState } from 'react'
import { FiSave, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'

interface SettingsMap {
  [key: string]: string
}

const SETUP_SQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.store_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by authenticated"
  ON public.store_settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Settings editable by authenticated"
  ON public.store_settings FOR ALL
  USING (auth.role() = 'authenticated');`

const DEFAULT_SETTINGS: SettingsMap = {
  store_name: 'Gentle Electronics',
  store_description: 'Your destination for quality electronics, smart technology and everyday digital essentials.',
  contact_phone: '07061158745',
  contact_email: '',
  store_address: '',
  currency_symbol: '₦',
  whatsapp_number: '07061158745',
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsMap>({ ...DEFAULT_SETTINGS })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tableExists, setTableExists] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from('store_settings').select('key, value')

      if (error) {
        // Table likely doesn't exist
        if (error.message.includes('relation') || error.code === '42P01' || error.message.includes('does not exist')) {
          setTableExists(false)
        } else {
          console.error('Settings fetch error:', error)
        }
        setIsLoading(false)
        return
      }

      setTableExists(true)
      const loaded: SettingsMap = { ...DEFAULT_SETTINGS }
      if (data) {
        data.forEach((row: any) => {
          if (row.key in loaded) {
            loaded[row.key] = row.value || ''
          }
        })
      }
      setSettings(loaded)
    } catch (err) {
      console.error('Settings error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const upserts = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from('store_settings').upsert(upserts, { onConflict: 'key' })

      if (error) {
        throw error
      }

      setSaveMessage({ type: 'success', text: 'Settings saved successfully.' })
      setTimeout(() => setSaveMessage(null), 4000)
    } catch (err: any) {
      console.error('Settings save error:', err)
      setSaveMessage({ type: 'error', text: 'Failed to save settings. ' + (err.message || '') })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-charcoal mb-6">Settings</h1>
        <div className="space-y-6">
          {[1, 2].map(n => (
            <div key={n} className="bg-white p-6 rounded-lg border border-border-gray shadow-sm animate-pulse">
              <div className="bg-light-gray h-6 w-40 mb-6 rounded"></div>
              <div className="space-y-4">
                <div className="bg-light-gray h-10 rounded"></div>
                <div className="bg-light-gray h-10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!tableExists) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-charcoal mb-6">Settings</h1>
        <div className="bg-white rounded-lg border border-border-gray shadow-sm p-8">
          <div className="flex items-start mb-4">
            <FiInfo className="h-6 w-6 text-orange mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-charcoal mb-2">Settings Storage Setup Required</h2>
              <p className="text-secondary-charcoal mb-4">
                The store settings table needs to be created in your Supabase project. 
                Run the following SQL in your Supabase SQL Editor:
              </p>
            </div>
          </div>
          <pre className="bg-charcoal text-green-400 p-4 rounded-lg text-sm overflow-x-auto mb-6 whitespace-pre-wrap">
            {SETUP_SQL}
          </pre>
          <p className="text-sm text-secondary-charcoal mb-4">
            You can also find this SQL in <code className="bg-light-gray px-1.5 py-0.5 rounded text-charcoal">database/storage-setup.sql</code>.
          </p>
          <button
            onClick={fetchSettings}
            className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors"
          >
            Retry Loading Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Settings</h1>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center text-sm ${
          saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? <FiCheckCircle className="mr-2 flex-shrink-0" /> : <FiAlertCircle className="mr-2 flex-shrink-0" />}
          {saveMessage.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Store Information */}
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-6">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={e => updateSetting('store_name', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={e => updateSetting('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={e => updateSetting('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="info@gentleelectronics.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={e => updateSetting('whatsapp_number', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Store Description</label>
              <textarea
                rows={3}
                value={settings.store_description}
                onChange={e => updateSetting('store_description', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1">Store Address</label>
              <textarea
                rows={2}
                value={settings.store_address}
                onChange={e => updateSetting('store_address', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
                placeholder="Enter your store address"
              />
            </div>
          </div>
        </div>

        {/* Store Configuration */}
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-6">Store Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={e => updateSetting('currency_symbol', e.target.value)}
                className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
              />
              <p className="text-xs text-secondary-charcoal mt-1">Used when displaying prices across the store.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2.5 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors disabled:opacity-50 font-medium"
          >
            <FiSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
