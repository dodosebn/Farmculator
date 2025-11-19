import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabase } from '@/store/supabase';

export const Route = createFileRoute('/api/sales/add')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            product?: string
            quantity?: number
            price?: number
          }

          const { product, quantity, price } = body

          if (!product || typeof quantity !== 'number' || typeof price !== 'number') {
            return json(
              { success: false, message: 'Missing or invalid fields' },
              { status: 400 }
            )
          }

          // Get logged-in user
          const { data: userData, error: userErr } = await supabase.auth.getUser()
          if (userErr || !userData?.user) {
            return json({ success: false, message: 'Not authenticated' }, { status: 401 })
          }
          const user = userData.user

          const total = Number(quantity) * Number(price)

          const { data, error } = await supabase
            .from('sales')
            .insert([{ product, quantity, price, total, user_id: user.id }])
            .select()
            .single()

          if (error) {
            console.error('Supabase insert error:', error)
            return json(
              { success: false, message: error.message },
              { status: 500 }
            )
          }

          return json(
            { success: true, sale: data },
            { status: 201 }
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
