import { supabase } from '@/store/supabase'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/sales/delete')({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Ensure there's a logged-in user
          const { data: userData, error: userErr } = await supabase.auth.getUser()
          if (userErr || !userData?.user) {
            return json({ success: false, message: 'Not authenticated' }, { status: 401 })
          }
          const user = userData.user

          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .eq('user_id', user.id)
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
