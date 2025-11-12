import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase } from '@/store/supabase';
export const Route = createFileRoute('/api/sales/delete')({
  server: {
    handlers: {
      DELETE: async ({ request }) => {
        try {
          const body = await request.json() as { id?: string }

          if (!body?.id) {
            return json({ success: false, message: 'Missing id' }, { status: 400 })
          }

          const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', body.id)

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
