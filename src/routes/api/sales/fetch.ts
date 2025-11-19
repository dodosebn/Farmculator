import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase } from '@/store/supabase';

export const Route = createFileRoute('/api/sales/fetch')({
  server: {
    handlers: {
      PATCH: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            id?: number | string
            updates?: {
              product?: string
              quantity?: number
              price?: number
              [key: string]: any
            }
          }

          const { id, updates } = body

          if (!id || !updates) {
            return json(
              { success: false, message: 'Missing fields' },
              { status: 400 }
            )
          }

          // Auth
          const { data: userData, error: userErr } = await supabase.auth.getUser()
          if (userErr || !userData?.user) {
            return json({ success: false, message: 'Not authenticated' }, { status: 401 })
          }
          const user = userData.user

          // Auto-calc total if both provided
          if (typeof updates.quantity === 'number' && typeof updates.price === 'number') {
            updates.total = Number(updates.quantity) * Number(updates.price)
          }

          const { data, error } = await supabase
            .from('sales')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) {
            console.error('Supabase update error:', error)
            return json(
              { success: false, message: error.message },
              { status: 500 }
            )
          }

          return json(
            { success: true, sale: data },
            { status: 200 }
          )
        } catch (err) {
          console.error('Unexpected error:', err)
          return json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
          )
        }
      },
    },
  },
})
