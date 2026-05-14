import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireStaff } from '@/lib/auth'

// GET /api/menu/admin — Get all categories + items (including inactive) for admin
export async function GET() {
  const guard = await requireStaff('MANAGER'); if (guard instanceof Response) return guard

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order')

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order')

  return NextResponse.json({ categories: categories || [], items: items || [] })
}

// POST /api/menu/admin — Create category or item
export async function POST(req: NextRequest) {
  const guard = await requireStaff('MANAGER'); if (guard instanceof Response) return guard
  const body = await req.json()

  if (body.type === 'category') {
    const { slug, label, note } = body
    const { data: last } = await supabase
      .from('menu_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()
    const nextSort = (last?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ slug, label, note, sort_order: nextSort })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ category: data })
  }

  if (body.type === 'item') {
    const { categoryId, name, description, price, allergens, tags } = body
    const { data: last } = await supabase
      .from('menu_items')
      .select('sort_order')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()
    const nextSort = (last?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from('menu_items')
      .insert({ category_id: categoryId, name, description, price, allergens, tags, sort_order: nextSort })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ item: data })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// PUT /api/menu/admin — Update category or item
export async function PUT(req: NextRequest) {
  const guard = await requireStaff('MANAGER'); if (guard instanceof Response) return guard
  const body = await req.json()

  if (body.type === 'category') {
    const { id, ...updates } = body
    delete updates.type
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ category: data })
  }

  if (body.type === 'item') {
    const { id, ...updates } = body
    delete updates.type
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ item: data })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// DELETE /api/menu/admin — Delete category or item
export async function DELETE(req: NextRequest) {
  const guard = await requireStaff('MANAGER'); if (guard instanceof Response) return guard
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) return NextResponse.json({ error: 'type and id required' }, { status: 400 })

  const table = type === 'category' ? 'menu_categories' : 'menu_items'
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
