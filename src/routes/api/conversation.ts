import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { supabaseAdmin } from "@/store/lib/supabaseServer";

export const Route = createFileRoute("/api/conversations" as any)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { user_id, title } = body;
          if (!user_id) {
            return json({ error: "user_id required" }, { status: 400 });
          }

          const { data, error } = await supabaseAdmin
            .from("conversations")
            .insert({ user_id, title })
            .select()
            .single();

          if (error) throw error;

          return json({ conversation: data });
        } catch (err) {
          console.error(err);
          return json(
            { error: "Could not create conversation" },
            { status: 500 }
          );
        }
      },
    },
  },
});
