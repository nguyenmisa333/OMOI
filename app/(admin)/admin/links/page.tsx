'use client'

import { useState, useEffect, useCallback } from 'react'

interface SocialLink {
  id: string
  title: string
  url: string
  icon: string
  sortOrder: number
  isActive: boolean
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', url: '', icon: 'link' })
  const [msg, setMsg] = useState('')

  const loadLinks = useCallback(() => {
    setLoading(true)
    fetch('/api/links', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setLinks(d.links || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadLinks() }, [loadLinks])

  function startAdd() {
    setEditId('new')
    setForm({ title: '', url: '', icon: 'link' })
  }

  function startEdit(link: SocialLink) {
    setEditId(link.id)
    setForm({ title: link.title, url: link.url, icon: link.icon })
  }

  function cancelEdit() {
    setEditId(null)
    setForm({ title: '', url: '', icon: 'link' })
  }

  async function saveLink() {
    if (!form.title || !form.url) return
    setSaving(true)
    setMsg('')
    try {
      if (editId === 'new') {
        await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...form, sortOrder: links.length }),
        })
      } else {
        // Update single link via PUT bulk
        const updated = links.map(l =>
          l.id === editId ? { ...l, title: form.title, url: form.url, icon: form.icon } : l
        )
        await fetch('/api/links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ links: updated }),
        })
      }
      cancelEdit()
      loadLinks()
      setMsg('✅ Gespeichert')
      setTimeout(() => setMsg(''), 2000)
    } catch {
      setMsg('❌ Fehler')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Link wirklich löschen?')) return
    await fetch(`/api/links?id=${id}`, { method: 'DELETE', credentials: 'include' })
    loadLinks()
  }

  async function toggleActive(link: SocialLink) {
    const updated = links.map(l =>
      l.id === link.id ? { ...l, isActive: !l.isActive } : l
    )
    await fetch('/api/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ links: updated }),
    })
    loadLinks()
  }

  async function moveLink(index: number, dir: -1 | 1) {
    const newLinks = [...links]
    const target = index + dir
    if (target < 0 || target >= newLinks.length) return
    ;[newLinks[index], newLinks[target]] = [newLinks[target], newLinks[index]]
    const reordered = newLinks.map((l, i) => ({ ...l, sortOrder: i }))
    setLinks(reordered)
    await fetch('/api/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ links: reordered }),
    })
  }

  const iconOptions = [
    'link', 'location_on', 'photo_camera', 'language', 'event_seat',
    'music_note', 'restaurant', 'local_cafe', 'storefront', 'call',
    'mail', 'star', 'favorite', 'shopping_bag', 'celebration',
  ]

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined">link</span>
            Link-Verwaltung
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Verwalte deine Linktree-Seite</p>
        </div>
        <a
          href="/links"
          target="_blank"
          className="px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Vorschau
        </a>
      </div>

      {msg && (
        <div className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          {msg}
        </div>
      )}

      {/* Add button */}
      {editId !== 'new' && (
        <button
          onClick={startAdd}
          className="w-full px-4 py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <span className="material-symbols-outlined">add</span>
          Neuer Link
        </button>
      )}

      {/* Edit form */}
      {editId && (
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Titel</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="z.B. 📍 Google Maps"
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">URL</label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {iconOptions.map(ic => (
                <button
                  key={ic}
                  onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    form.icon === ic
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{ic}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={saveLink}
              disabled={saving || !form.title || !form.url}
              className="flex-1 px-4 py-2.5 bg-primary-container text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
            >
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2.5 bg-stone-100 text-stone-600 font-medium rounded-xl hover:bg-stone-200 transition-all text-sm"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Links list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div
              key={link.id}
              className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border transition-all ${
                link.isActive ? 'border-stone-200' : 'border-stone-100 opacity-50'
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveLink(i, -1)}
                  disabled={i === 0}
                  className="text-stone-400 hover:text-stone-700 disabled:opacity-20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">expand_less</span>
                </button>
                <button
                  onClick={() => moveLink(i, 1)}
                  disabled={i === links.length - 1}
                  className="text-stone-400 hover:text-stone-700 disabled:opacity-20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </button>
              </div>

              {/* Icon */}
              <span className="material-symbols-outlined text-amber-700 text-xl">
                {link.icon}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-on-surface truncate">{link.title}</p>
                <p className="text-xs text-stone-400 truncate">{link.url}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(link)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    link.isActive
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-stone-400 hover:bg-stone-100'
                  }`}
                  title={link.isActive ? 'Deaktivieren' : 'Aktivieren'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {link.isActive ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
                <button
                  onClick={() => startEdit(link)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
