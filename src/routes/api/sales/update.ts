import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase } from '@/store/supabase';
export const Route = createFileRoute('/api/sales/update')({
  server: {
    handlers: {
      PATCH: async ({ request }) => {
        try {
          const body = await request.json() as {
            id?: string
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

          // Auto-calculate total if both quantity and price are provided
          if (updates.quantity && updates.price) {
            updates.total = Number(updates.quantity) * Number(updates.price)
          }

          const { data, error } = await supabase
            .from('sales')
            .update(updates)
            .eq('id', id)
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