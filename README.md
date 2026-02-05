# FX Trading App - Backend API

A backend system for foreign exchange (FX) trading that enables users to register, verify their email, manage multi-currency wallets, and perform real-time currency conversions using live exchange rates.

---

##  Features

- **User Authentication**
  - Email based registration with OTP verification
  - JWT-based authentication
  - Protected endpoints - login required

- **Multi-Currency Wallet System**
  - Support for multiple currencies (NGN, USD, EUR, GBP)
  - Automatic wallet creation per currency
  - Real-time balance tracking

- **FX Trading & Conversion**
  - Real-time exchange rates from external API
  - Convert between any supported currency pairs
  - Bidirectional trading (NGN ↔ Other currencies)

- **Transaction Management**
  - Comprehensive transaction history
  - Support for FUND, CONVERT, and TRADE operations
  - Atomic transaction processing

---

##  Project Schema

![Project Logo](./assets/structure.png)

##  Tech Stack

- **Backend Framework:** NestJS (Node.js)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT (Passport)
- **Email Service:** Nodemailer (Gmail SMTP)
- **FX API:** ExchangeRate-API
- **Validation:** class-validator & class-transformer
- **Language:** TypeScript

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) 
- **npm** (v9.x or higher) - comes with Node.js
- **PostgreSQL** (v14.x or higher) 
- **Git** 

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/pedroski121/fx.git
cd fx
```

### 2. Install Dependencies

```bash
npm install
```

---

## Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
cp  .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Application
PORT = 3000


# Database configuration
DB_HOST = localhost
DB_USERNAME = mac
DB_PASSWORD =1234
DB_DATABASE = fx
DB_SYNCHRONIZE =true
NODE_ENV =development
DB_PORT = 5432

# GMAIL APP PASSWORD
GMAIL_APP_PASSWORD= <gmail_temporary_password>
GMAIL_EMAIL= <gmail_email>


# FX API KEY
FX_API_KEY =<fx_api_key>

# JWT

JWT_SECRET="superSecretKey123"
```

### 3. Get API Keys

#### **ExchangeRate-API Key:**
1. Visit [https://www.exchangerate-api.com](https://www.exchangerate-api.com)
2. Sign up for a free account
3. Copy your API key
4. Add it to `FX_API_KEY` in `.env`

#### **Gmail App Password:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account Settings → Security → App Passwords
3. Generate a new app password for "Mail"
4. Add it to `EMAIL_PASSWORD` in `.env`

---

##  Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fx;

# Exit PostgreSQL
\q
```

### 2. Verify Database Connection

```bash
npm run start:dev
```

If successful, you should see:
```
[Nest] Database connected successfully
[Nest] Application is running on: http://localhost:3000
```

---

## 🏃 Running the Application

### Development Mode (with hot-reload)

```bash
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

---

### API Documentation
Most endpoints require a JWT token in the Authorization header:
```
http://localhost:3000/api
```
---

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

##  Key Assumptions

### **1. Initial Wallet Funding**
- Users can fund their wallets starting with any supported currency. User must use the lowest denominator the currency they want to fund
- Initial wallet balance is 0 for all currencies
- Wallets are auto-created when a user first funds or receives a currency

### **2. FX Rates**
- Exchange rates are fetched from ExchangeRate-API in real-time
- Rates are cached for 5 minutes to optimize API usage and performance using an in memory hashmap. Key future improvements includes scaling the caching layer
- The rate used at the time of conversion is stored in the transaction record for audit purposes

### **3. OTP Verification**
- Each OTP can only be used once
- Only verified and logged in users can access wallet and trading features
- OTP codes are 6 digits

### **4. Transaction References**
- References are auto-generated on the backend to prevent client-side manipulation
- Format: `{TYPE}-{timestamp}-{random}`
<!--- Users can optionally provide their own reference for idempotency -->
<!--- Duplicate references are rejected to prevent double-spending-->

### **5. Supported Currencies**
- Default supported currencies: NGN, USD, EUR, GBP
- Additional currencies can be easily added via the Currency enum

### **6. Balance Storage**
- Balances are stored as `bigint` in the database to handle large amounts. The values are in the smallest denominator of the currency
- Frontend should handle display formatting and decimal places

### **7. Transaction Atomicity**
- All wallet operations (fund and trade) use database transactions
- Either all updates succeed or all rollback (no partial states)
- Prevents race conditions and ensures data consistency

---

##  Architectural Decisions

### **1. Multi-Currency Wallet Design**

**Chosen Approach:** One wallet record per user per currency

```
User 1 → NGN Wallet (balance: 50000)
      → USD Wallet (balance: 100.50)
      → EUR Wallet (balance: 75.00)
```

**Alternative Considered:** Single wallet with JSON column
```
User 1 → Wallet { balances: { NGN: 50000, USD: 100.50 } }
```

**Why I Chose Separate Records:**
- Better database indexing and query performance
- Easier to enforce constraints at DB level
- Simpler transaction logic (update single record)
- Natural relationship modeling
- Unique constraint on (user_id, currency) prevents duplicates

---

### **3. Transaction → User Relationship**

Transactions are mapped to **Users**, not individual wallets.

**Rationale:**
- User-centric transaction history (one query gets all transactions)
- Conversions involve two wallets but belong to one user
- Simpler queries and better performance
- Transaction integrity maintained even if wallets are modified

---

### **4. Database Transaction Usage**

All wallet-modifying operations wrapped in database transactions:

```typescript
await this.dataSource.transaction(async (manager) => {
  // Update wallet 1
  // Update wallet 2
  // Create transaction record
  // All succeed or all rollback
});
```

**Rationale:**
- Prevents partial updates (e.g., deduct from wallet but fail to add to another)
- ACID compliance ensures data integrity
- Handles concurrent requests safely

---

### **5. FX Rate Caching Strategy**

**In-Memory Cache** with 5-minute TTL

**Why Not Redis?**
- Simpler implementation for MVP
- Sufficient for moderate traffic
- Can upgrade to Redis later if needed

**Why Cache at All?**
- Reduces external API calls (free tier has limits)
- Faster response times
- Reduces dependency on external service availability

---

### **6. Password Security**

- **Bcrypt** with 10 salt rounds
- Passwords never stored in plain text
- Password field excluded from query results by default (`select: false`)

---

### **7. Error Handling**

**Consistent API Response Format:**
```typescript
{
  "success": boolean,
  "message": string,
  "data"?: any
}
```

**Benefits:**
- Predictable response structure for frontend
- Easy error handling on client side
- Clear success/failure indication

---

### **8. Validation Layer**

- **DTOs** with class-validator decorators
- Input validation happens before business logic
- Type safety with TypeScript
- Auto-generated validation errors

---

## Security Considerations

### **1. Authentication & Authorization**
- JWT tokens with configurable expiration
- Passwords hashed with bcrypt (salt rounds: 10)
- Email verification required before trading
- Protected routes use JWT guard

### **2. Input Validation**
- All inputs validated using class-validator
- SQL injection prevention via TypeORM parameterized queries
- XSS protection through input sanitization

### **3. Transaction Security**
- Atomic database transactions prevent race conditions
<!--- Idempotency via unique references prevents duplicate processing-->
- Balance checks inside transactions (after locks acquired)

### **4. Rate Limiting** (Recommended for Production)


### **5. Environment Variables**
- Sensitive data stored in `.env` file
- `.env` excluded from version control
- Different configs for dev/staging/production

---


## 📈 Scalability Considerations

### **How This System Can Scale to Millions of Users**

#### **1. Database Optimization**
- **Read Replicas:** Separate read/write operations for transaction history queries
- **Partitioning:** Partition transactions table by date for faster queries

#### **2. Caching Layer**
- **Redis Integration:** Replace in-memory cache with Redis for distributed caching
- **Cache Patterns:**
  - FX rates (5-minute TTL)
  - User wallet balances (1-minute TTL)
  - Transaction history (cache frequent queries)

#### **3. Microservices Architecture**
```
Current Monolith → Future Microservices:
├── Auth Service (handles authentication)
├── Wallet Service (manages wallets & balances)
├── FX Service (rate fetching & caching)
├── Transaction Service (transaction history)
└── Notification Service (emails, SMS)
```

#### **4. Message Queues**
- **Bull/RabbitMQ** for async operations:
  - Email sending
  - Transaction processing
  - Report generation

#### **5. Load Balancing**
- Multiple application instances behind NGINX/AWS ALB
- Session-less design (JWT) allows horizontal scaling

---

## Future Enhancements

### **Planned Features**

1. **Role-Based Access Control (RBAC)**
   - Admin users can view all transactions
   - Regular users restricted to their own data
   - Audit logs for admin actions

2. **Advanced Caching**
   - Redis implementation for distributed caching
   - Cache invalidation strategies
   - Session management with Redis

3. **Analytics & Reporting**
   - Trading volume metrics
   - Popular currency pairs
   - User activity dashboards
   - Revenue tracking (if fees implemented)

4. **Transaction Verification**
   - Webhook support for payment gateways
   - Double-entry bookkeeping validation
   - Reconciliation reports

5. **Enhanced Security**
   - Two-factor authentication (2FA)
   - IP whitelisting
   - Device fingerprinting
   - Suspicious activity detection

6. **API Rate Limiting**
   - Per-user rate limits
   - Tiered limits based on account type
   - DDoS protection

7. **Notification System**
   - Email notifications for transactions
   - SMS alerts for large transfers
   - Push notifications via mobile app

8. **KYC Integration**
   - Document upload and verification
   - Tiered trading limits
   - Compliance with financial regulations

9. **Multi-Language Support**
   - i18n for API responses
   - Email templates in multiple languages





---
