import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase } from '@/store/supabase';

export const Route = createFileRoute('/api/sales/update')({
  server: {
    handlers: {
      DELETE: async ({ request }) => {
        try {
          const body = (await request.json()) as { id?: number | string }

          if (!body?.id) {
            return json({ success: false, message: 'Missing id' }, { status: 400 })
          }

          // Auth
          const { data: userData, error: userErr } = await supabase.auth.getUser()
          if (userErr || !userData?.user) {
            return json({ success: false, message: 'Not authenticated' }, { status: 401 })
          }
          const user = userData.user

          const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', body.id)
            .eq('user_id', user.id)

          if (error) {
            console.error('Supabase delete error:', error)
            return json({ success: false, message: error.message }, { status: 500 })
          }

          return json({ success: true, message: 'Record deleted successfully' }, { status: 200 })
        } catch (err) {
          console.error('Unexpected error:', err)
          return json({ success: false, message: 'Something went wrong' }, { status: 500 })
        }
      },
    },
  },
})
