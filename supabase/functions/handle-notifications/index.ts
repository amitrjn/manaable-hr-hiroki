import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  user_id: string
  message: string
  type: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { user_id, message, type } = await req.json() as NotificationPayload

    // Create notification
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        message,
        type,
        status: 'unread',
      })

    if (notificationError) throw notificationError

    // Get user email for sending notification
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', user_id)
      .single()

    if (userError) throw userError

    // TODO: Implement email sending logic here
    // For now, just return success response
    return new Response(
      JSON.stringify({ message: 'Notification created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
