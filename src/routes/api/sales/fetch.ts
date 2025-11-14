import { supabase } from '@/store/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute(('/api/sales/fetch') as any)({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Supabase fetch error:', error)
            return json(
              { success: false, message: error.message },
              { status: 500 }
            )
          }

          return json(
            { success: true, sales: data },
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