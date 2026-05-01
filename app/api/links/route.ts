import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireStaff } from '@/lib/auth'
import { generateId } from '@/lib/id'

// GET /api/links — public, get all active links sorted by order
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('isActive', true)
      .order('sortOrder', { ascending: true })

    if (error) throw error
    return NextResponse.json({ links: data || [] })
  } catch (error) {
    // Return default links if table doesn't exist yet
    return NextResponse.json({
      links: [
        { id: '1', title: '📍 Google Maps', url: 'https://maps.app.goo.gl/G3EGbxjyB9d9a5De7', icon: 'location_on', sortOrder: 0, isActive: true },
        { id: '2', title: '📸 Instagram', url: 'https://www.instagram.com/omoi.stuttgart/', icon: 'photo_camera', sortOrder: 1, isActive: true },
        { id: '3', title: '🌐 Website', url: 'https://www.o-mo-i.de', icon: 'language', sortOrder: 2, isActive: true },
        { id: '4', title: '🍽️ Tisch reservieren', url: 'https://www.omoi.help/', icon: 'event_seat', sortOrder: 3, isActive: true },
        { id: '5', title: '🎵 TikTok', url: 'https://www.tiktok.com/@omoide57', icon: 'music_note', sortOrder: 4, isActive: true },
      ],
      _default: true,
    })
  }
}

// POST /api/links — admin, create new link
export async function POST(request: NextRequest) {
  const guard = await requireStaff(); if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const { title, url, icon, sortOrder } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'title and url required' }, { status: 400 })
    }

    const { data, error } = await supabase.from('social_links').insert({
      id: generateId(),
      title,
      url,
      icon: icon || 'link',
      sortOrder: sortOrder ?? 99,
      isActive: true,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ link: data })
  } catch (error) {
    console.error('POST /api/links error:', error)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}

// PUT /api/links — admin, update links (bulk)
export async function PUT(request: NextRequest) {
  const guard = await requireStaff(); if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const { links } = body

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'links array required' }, { status: 400 })
    }

    // Update each link
    for (const link of links) {
      await supabase.from('social_links').upsert({
        id: link.id || generateId(),
        title: link.title,
        url: link.url,
        icon: link.icon || 'link',
        sortOrder: link.sortOrder ?? 99,
        isActive: link.isActive ?? true,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/links error:', error)
    return NextResponse.json({ error: 'Failed to update links' }, { status: 500 })
  }
}

// DELETE /api/links — admin, delete a link by id
export async function DELETE(request: NextRequest) {
  const guard = await requireStaff(); if (guard instanceof Response) return guard
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { error } = await supabase.from('social_links').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/links error:', error)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}
