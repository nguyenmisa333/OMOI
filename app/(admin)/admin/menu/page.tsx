'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  slug: string
  label: string
  note: string | null
  sortOrder: number
  active: boolean
}

interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string | null
  price: string
  allergens: string | null
  tags: string[]
  sortOrder: number
  active: boolean
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<MenuItem>>({})
  const [showAddItem, setShowAddItem] = useState<string | null>(null) // categoryId
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', allergens: '' })
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ slug: '', label: '', note: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/menu/admin', { credentials: 'include' })
      const data = await res.json()
      setCategories(data.categories || [])
      setItems(data.items || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // ─── CRUD Helpers ──────────────────────────
  async function api(method: string, body?: object, params?: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/menu/admin${params || ''}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) {
        const e = await res.json()
        alert(e.error || 'Fehler')
        return false
      }
      await load()
      return true
    } catch {
      alert('Netzwerk-Fehler')
      return false
    } finally { setSaving(false) }
  }

  async function saveItem(id: string) {
    const ok = await api('PUT', { type: 'item', id, ...editValues })
    if (ok) setEditingItem(null)
  }

  async function addItem(categoryId: string) {
    const ok = await api('POST', { type: 'item', categoryId, ...newItem })
    if (ok) { setShowAddItem(null); setNewItem({ name: '', price: '', description: '', allergens: '' }) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Diesen Artikel wirklich löschen?')) return
    await api('DELETE', undefined, `?type=item&id=${id}`)
  }

  async function toggleItemActive(item: MenuItem) {
    await api('PUT', { type: 'item', id: item.id, active: !item.active })
  }

  async function addCategory() {
    if (!newCategory.slug || !newCategory.label) return alert('Slug und Label erforderlich')
    const ok = await api('POST', { type: 'category', ...newCategory })
    if (ok) { setShowAddCategory(false); setNewCategory({ slug: '', label: '', note: '' }) }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Kategorie und alle zugehörigen Artikel löschen?')) return
    await api('DELETE', undefined, `?type=category&id=${id}`)
  }

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 bg-stone-200 rounded w-48" />
        {[1,2,3].map(i => <div key={i} className="h-24 bg-stone-100 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Speisekarte</h1>
          <p className="text-sm text-stone-400">Kategorien & Artikel verwalten</p>
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Kategorie
        </button>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
          <p className="text-sm font-bold text-amber-800">Neue Kategorie</p>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Slug (z.B. drinks)" value={newCategory.slug} onChange={e => setNewCategory(p => ({ ...p, slug: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Label (z.B. Getränke)" value={newCategory.label} onChange={e => setNewCategory(p => ({ ...p, label: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input placeholder="Notiz (optional)" value={newCategory.note} onChange={e => setNewCategory(p => ({ ...p, note: e.target.value }))}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} disabled={saving} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold disabled:opacity-50">Erstellen</button>
            <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-stone-100 rounded-lg text-sm">Abbrechen</button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-6">
        {categories.map(cat => {
          const catItems = items.filter(i => i.categoryId === cat.id)
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              {/* Category Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-stone-50 border-b border-stone-200">
                <div>
                  <h2 className="font-bold text-stone-900">{cat.label}</h2>
                  {cat.note && <p className="text-xs text-stone-400 italic mt-0.5">{cat.note}</p>}
                  <span className="text-[10px] text-stone-300 font-mono">{cat.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowAddItem(showAddItem === cat.id ? null : cat.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>Artikel
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              {/* Add Item Form */}
              {showAddItem === cat.id && (
                <div className="px-5 py-3 bg-emerald-50/50 border-b border-stone-200 flex gap-2 items-end flex-wrap">
                  <input placeholder="Name" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                    className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[140px]" />
                  <input placeholder="Preis" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                    className="px-3 py-2 border rounded-lg text-sm w-24" />
                  <input placeholder="Beschreibung" value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                    className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[140px]" />
                  <input placeholder="Allergene" value={newItem.allergens} onChange={e => setNewItem(p => ({ ...p, allergens: e.target.value }))}
                    className="px-3 py-2 border rounded-lg text-sm w-24" />
                  <button onClick={() => addItem(cat.id)} disabled={saving || !newItem.name || !newItem.price}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 whitespace-nowrap">
                    Hinzufügen
                  </button>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {catItems.length === 0 && (
                  <p className="px-5 py-4 text-sm text-stone-300 italic">Keine Artikel</p>
                )}
                {catItems.map(item => (
                  <div key={item.id} className={`px-5 py-3 flex items-center gap-3 group ${!item.active ? 'opacity-40' : ''}`}>
                    {editingItem === item.id ? (
                      /* Edit Mode */
                      <div className="flex-1 flex gap-2 items-center flex-wrap">
                        <input value={editValues.name || ''} onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))}
                          className="px-2 py-1.5 border rounded text-sm flex-1 min-w-[120px] font-medium" />
                        <input value={editValues.price || ''} onChange={e => setEditValues(p => ({ ...p, price: e.target.value }))}
                          className="px-2 py-1.5 border rounded text-sm w-20 text-right font-bold" />
                        <input value={editValues.description || ''} onChange={e => setEditValues(p => ({ ...p, description: e.target.value }))}
                          placeholder="Beschreibung" className="px-2 py-1.5 border rounded text-sm flex-1 min-w-[100px] text-stone-400" />
                        <input value={editValues.allergens || ''} onChange={e => setEditValues(p => ({ ...p, allergens: e.target.value }))}
                          placeholder="Allergene" className="px-2 py-1.5 border rounded text-sm w-20 text-stone-400" />
                        <div className="flex gap-1">
                          <button onClick={() => saveItem(item.id)} disabled={saving}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">check</span>
                          </button>
                          <button onClick={() => setEditingItem(null)}
                            className="p-1.5 text-stone-400 hover:bg-stone-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-stone-900 truncate">{item.name}</span>
                            {item.allergens && <span className="text-[10px] text-stone-400">({item.allergens})</span>}
                          </div>
                          {item.description && <p className="text-xs text-stone-400 truncate">{item.description}</p>}
                        </div>
                        <span className="text-sm font-bold text-amber-700 whitespace-nowrap">{item.price} €</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingItem(item.id); setEditValues({ name: item.name, price: item.price, description: item.description || '', allergens: item.allergens || '' }) }}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button onClick={() => toggleItemActive(item)}
                            className={`p-1.5 rounded-lg ${item.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-stone-300 hover:bg-stone-50'}`}>
                            <span className="material-symbols-outlined text-lg">{item.active ? 'visibility' : 'visibility_off'}</span>
                          </button>
                          <button onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <span className="material-symbols-outlined text-5xl mb-4 block">restaurant_menu</span>
          <p className="font-medium">Keine Kategorien vorhanden</p>
          <p className="text-sm mt-1">Erstelle zuerst die Datenbank-Tabellen mit der Migration.</p>
        </div>
      )}
    </div>
  )
}
