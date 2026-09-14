import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { generateOrderNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status')

    const supabase = getServiceSupabase()
    let query = supabase
      .from('orders')
      .select('*, users(first_name, last_name, email)')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServiceSupabase()

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...body,
        order_number: orderNumber,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create deposit ledger entry
    const { error: depositError } = await supabase
      .from('deposit_ledger')
      .insert({
        order_id: order.id,
        user_id: body.user_id,
        amount: body.insurance_deposit,
        status: 'pending',
      })

    if (depositError) throw depositError

    // Update tool availability
    for (const item of body.items) {
      const { error: toolError } = await supabase.rpc('decrement_tool_quantity', {
        tool_id: item.tool_id,
        quantity: item.quantity,
      })

      if (toolError) {
        console.error('Failed to update tool quantity:', toolError)
      }
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
