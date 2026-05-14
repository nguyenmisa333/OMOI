import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/menu — Public endpoint, returns full menu for homepage
export async function GET() {
  try {
    const { data: categories, error: catErr } = await supabase
      .from('menu_categories')
      .select('id, slug, label, note, sort_order, active')
      .eq('active', true)
      .order('sort_order')

    if (catErr) throw catErr

    const { data: items, error: itemErr } = await supabase
      .from('menu_items')
      .select('id, category_id, name, description, price, allergens, tags, sort_order, active')
      .eq('active', true)
      .order('sort_order')

    if (itemErr) throw itemErr

    // Group items by category
    const menu = (categories || []).map(cat => ({
      id: cat.slug,
      label: cat.label,
      note: cat.note,
      items: (items || [])
        .filter(i => i.category_id === cat.id)
        .map(i => ({
          name: i.name,
          desc: i.description || undefined,
          price: i.price,
          allergens: i.allergens || undefined,
        })),
    }))

    return NextResponse.json({ menu }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    })
  } catch (error) {
    console.error('GET /api/menu error:', error)
    return NextResponse.json({ menu: null, _fallback: true })
  }
}
