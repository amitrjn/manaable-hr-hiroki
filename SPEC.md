# Technical Specification - Leave Management Web Application

## 1. System Overview
The Leave Management Web Application is designed to facilitate employee leave requests and management. It provides a comprehensive system for tracking vacation and sick leave, managing approvals, and maintaining leave balances.

### 1.1 Key Features
- Leave request submission and approval workflow
- Automated leave balance tracking
- Real-time notifications
- Role-based access control
- Reporting capabilities

## 2. Technical Stack
### 2.1 Frontend
- Framework: Vue.js
- CSS Framework: Tailwind CSS
- Features:
  - Component-based architecture
  - Real-time updates
  - Responsive design
  - Utility-first CSS with Tailwind

### 2.2 Backend
- Platform: Supabase (Backend-as-a-Service)
- Features:
  - PostgreSQL Database
  - Real-time subscriptions
  - Built-in Authentication
  - Row Level Security
  - Storage
  - Edge Functions

## 3. Microservices Architecture

### 3.1 Authentication & Authorization Service
#### Responsibilities
- User authentication
- Token management
- Role validation
- Security enforcement

#### Key Endpoints
- POST /auth/login
- POST /auth/refresh-token
- GET /auth/validate-token

### 3.2 User Management Service
#### Responsibilities
- User profile management
- Manager-Member relationships
- Role assignments

#### Key Endpoints
- CRUD operations for user profiles
- GET /users
- POST /users
- PUT /users/{id}
- DELETE /users/{id}
- PUT /users/{id}/manager

### 3.3 Leave Management Service
#### Responsibilities
- Leave request processing
- Balance tracking
- Leave accrual management

#### Key Endpoints
- GET /leave-requests
- POST /leave-requests
- PATCH /leave-requests/{id}/status
- GET /leave-balances/{user_id}

### 3.4 Notification Service
#### Responsibilities
- Email notifications
- In-app notifications
- Notification status tracking

#### Key Endpoints
- POST /notifications
- GET /notifications/user/{user_id}
- PATCH /notifications/{id}/read

## 4. Supabase Schema and Configuration

### 4.1 Database Tables

#### Users Table
```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50),  -- Member/Manager/Admin
    manager_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Managers can view their team members" ON public.users
    FOR SELECT USING (
        auth.uid() IN (
            SELECT manager_id FROM public.users WHERE id = auth.uid()
        )
    );
```

#### Leave Requests Table
```sql
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

-- Enable Row Level Security
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Policies
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
```

#### Leave Balances Table
```sql
CREATE TABLE public.leave_balances (
    user_id UUID REFERENCES public.users(id) PRIMARY KEY,
    vacation_balance DECIMAL(10,2),
    sick_balance DECIMAL(10,2),
    last_accrual_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own balance" ON public.leave_balances
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Managers can view their team's balances" ON public.leave_balances
    FOR SELECT USING (
        auth.uid() IN (
            SELECT manager_id FROM public.users WHERE id = user_id
        )
    );
```

#### Notifications Table
```sql
CREATE TABLE public.notifications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    message TEXT,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',  -- unread/read
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);
```

### 4.2 Real-time Subscriptions
- Leave request status changes
- New notifications
- Balance updates

### 4.3 Edge Functions
- Leave balance calculation
- Notification dispatch
- Email sending

## 5. Business Rules

### 5.1 Leave Accrual
#### Vacation Leave
- Accrual Rate: 1.5 days per month
- Carryover: Unlimited
- Accrual Schedule: Monthly on the 1st

#### Sick Leave
- Allocation: 12 days annually
- Reset: January 1st each year
- Carryover: None

### 5.2 Approval Workflow
1. Member submits leave request
2. System validates leave balance
3. Manager receives notification
4. Manager approves/rejects request
5. Member receives notification
6. System updates leave balance (if approved)

## 6. Security Requirements

### 6.1 Authentication (Supabase Auth)
- Google OAuth authentication with PKCE flow
- Secure session management (handled by Supabase)
- Role-based access control (Member/Manager/Admin)
- JWT-based authentication
- Token expiration and refresh mechanism
- Magic link authentication option

### 6.2 Authorization
- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Fine-grained database access control
- Manager-Member relationship validation through RLS

### 6.3 Data Protection
- HTTPS encryption
- Input validation
- SQL injection prevention
- XSS protection

## 7. Monitoring and Logging

### 7.1 System Monitoring
- Service health checks
- Performance metrics
- Error tracking

### 7.2 Audit Logging
- User actions
- System events
- Security events

## 8. Reporting Requirements

### 8.1 Member Reports
- Current leave balances
- Leave history
- Pending requests

### 8.2 Manager Reports
- Team leave calendar
- Leave balance summary
- Approval history

### 8.3 Admin Reports
- System usage statistics
- User activity logs
- Leave trends analysis

## 9. Integration Requirements

### 9.1 Email Integration
- SMTP configuration
- Email templates
- Delivery tracking

### 9.2 Calendar Integration
- iCal feed support
- Calendar event creation
- Team calendar sync

## 10. Performance Requirements

### 10.1 Response Times
- API response time < 500ms
- Page load time < 2s
- Real-time updates < 1s

### 10.2 Scalability
- Horizontal scaling support
- Load balancing
- Caching strategy

## 11. Deployment Requirements

### 11.1 Infrastructure
- Containerization (Docker)
- Orchestration (Kubernetes)
- CI/CD pipeline

### 11.2 Environment Setup
- Development
- Staging
- Production

## 12. Testing Requirements

### 12.1 Unit Testing
- Component tests
- Service tests
- Model tests

### 12.2 Integration Testing
- API tests
- Service integration tests
- End-to-end tests

### 12.3 Performance Testing
- Load testing
- Stress testing
- Endurance testing
