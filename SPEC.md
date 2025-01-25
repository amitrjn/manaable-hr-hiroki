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
- Features:
  - Component-based architecture
  - Real-time updates
  - Responsive design

### 2.2 Backend
- Language: Python
- Architecture: Microservices
- API Style: RESTful (JSON)

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

## 4. Database Schema

### 4.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50),  -- Member/Manager/Admin
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4.2 Leave Requests Table
```sql
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),  -- Vacation/Sick
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),  -- pending/approved/rejected
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4.3 Leave Balances Table
```sql
CREATE TABLE leave_balances (
    user_id UUID REFERENCES users(id),
    vacation_balance DECIMAL(10,2),
    sick_balance DECIMAL(10,2),
    last_accrual_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (user_id)
);
```

### 4.4 Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    message TEXT,
    type VARCHAR(50),
    status VARCHAR(50),  -- unread/read
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

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

### 6.1 Authentication
- Secure password storage (hashed)
- JWT-based authentication
- Token expiration and refresh mechanism

### 6.2 Authorization
- Role-based access control (RBAC)
- Endpoint-level permission checks
- Manager-Member relationship validation

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
