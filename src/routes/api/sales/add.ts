import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { supabaseAdmin } from '@/store/lib/supabaseServer'; 

export const Route = createFileRoute('/api/sales/add')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json() as {
            product?: string
            quantity?: number
            price?: number
            user_id?: string
          }

          const { product, quantity, price, user_id } = body

          if (!product || !quantity || !price || !user_id) {
            return json(
              { success: false, message: 'Missing required fields' },
              { status: 400 }
            )
          }

          const total = Number(quantity) * Number(price)

          const { data, error } = await supabaseAdmin 
            .from('sale')
            .insert([{ 
              user_id,
              product, 
              quantity, 
              price, 
              total 
            }])
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