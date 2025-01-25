-- Create tables and policies
-- Enable RLS and create policies for users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50),  -- Member/Manager/Admin
    manager_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Managers can view their team members" ON public.users
    FOR SELECT USING (
        auth.uid() IN (
            SELECT manager_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Enable RLS and create policies for leave_requests table
CREATE TABLE public.leave_requests (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    type VARCHAR(50),  -- Vacation/Sick
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),  -- pending/approved/rejected
    manager_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON public.leave_requests
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can create their own requests" ON public.leave_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Managers can view their team's requests" ON public.leave_requests
    FOR SELECT USING (
        auth.uid() IN (
            SELECT manager_id FROM public.users WHERE id = user_id
        )
    );

-- Enable RLS and create policies for leave_balances table
CREATE TABLE public.leave_balances (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    vacation_balance DECIMAL(10,2),
    sick_balance DECIMAL(10,2),
    last_accrual_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own balance" ON public.leave_balances
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Managers can view their team's balances" ON public.leave_balances
    FOR SELECT USING (
        auth.uid() IN (
            SELECT manager_id FROM public.users WHERE id = user_id
        )
    );

-- Enable RLS and create policies for notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    message TEXT,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',  -- unread/read
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Enable real-time subscriptions for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_balances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
