import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabaseAdmin } from '@/store/lib/supabaseServer'
export const Route = createFileRoute('/api/sales/fetch')({
  server: { 
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const user_id = url.searchParams.get('user_id')

          if (!user_id) {
            return json(
              { success: false, message: 'user_id is required' },
              { status: 400 }
            )
          }

          const { data, error } = await supabaseAdmin 
            .from('sale')
            .select('*')
            .eq('user_id', user_id)  
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Supabase fetch error:', error)
            return json(
              { success: false, message: error.message },
              { status: 500 }
            )
          }

          return json(
            { success: true, sales: data || [] },
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