import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeaveBalance {
  user_id: string
  vacation_balance: number
  sick_balance: number
  last_accrual_date: string
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

    // Get user_id from request
    const { user_id } = await req.json()
    
    // Get current balance
    const { data: balance, error: balanceError } = await supabaseClient
      .from('leave_balances')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (balanceError) throw balanceError

    const currentBalance = balance as LeaveBalance
    const lastAccrual = new Date(currentBalance.last_accrual_date)
    const now = new Date()
    
    // Calculate months since last accrual
    const monthsDiff = (now.getFullYear() - lastAccrual.getFullYear()) * 12 + 
                      (now.getMonth() - lastAccrual.getMonth())
    
    // Add 1.5 days per month for vacation
    const newVacationBalance = currentBalance.vacation_balance + (monthsDiff * 1.5)
    
    // Reset sick leave if it's a new year
    const newSickBalance = now.getFullYear() > lastAccrual.getFullYear() ? 12 : currentBalance.sick_balance
    
    // Update balance
    const { error: updateError } = await supabaseClient
      .from('leave_balances')
      .update({
        vacation_balance: newVacationBalance,
        sick_balance: newSickBalance,
        last_accrual_date: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('user_id', user_id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        vacation_balance: newVacationBalance,
        sick_balance: newSickBalance,
        last_accrual_date: now.toISOString()
      }),
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
