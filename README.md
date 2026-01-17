# CrabKhai - Premium Seafood from Sundarbans

**CrabKhai** is a premium e-commerce platform dedicated to bringing the freshest live crab and seafood delicacies from the Sundarbans directly to your doorstep. Our mission is to provide an authentic, high-quality seafood experience with a touch of luxury.

## Live Demo
- **Frontend**: [http://localhost:3000](http://localhost:3000) (Local Development)

## Tech Stack
This project is built using the latest web technologies for speed, scalability, and developer experience.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: Prisma (ORM) with PostgreSQL
- **Fonts**: Playfair Display (Headings) & Inter (Body)

---

## 🔒 Security Features

CrabKhai implements enterprise-grade security measures to protect admin operations and customer data.

### Device Authorization System
- **Trusted Device Registration**: New devices must be authorized with a secret setup token before accessing the admin panel
- **30-Day Device Sessions**: Authorized devices remain trusted for 30 days with automatic expiry
- **Device Fingerprinting**: Records browser, OS, device type, and user agent for each trusted device
- **IP Tracking**: Logs IP addresses for all device authorizations and security events

### Authentication & Access Control
- **Multi-Layer Authentication**: Combines session-based auth with device verification
- **Role-Based Access Control (RBAC)**: Granular permissions for Super Admin, Admin, and Hub Manager roles
- **Stale Session Detection**: Automatically clears auth cookies if database record is missing
- **Secure Cookie Management**: HTTP-only, secure cookies in production with proper expiry

### Security Audit & Logging
- **Comprehensive Security Logs**: All security events (login attempts, device authorizations) are logged
- **Severity Levels**: Events categorized as LOW, MEDIUM, or HIGH severity
- **IP & User Agent Tracking**: Full audit trail for compliance and security review
- **Real-time Security Dashboard**: View all security events in the admin panel

### Admin Panel Protection
- **Device Setup Flow**: `/admin/security/device-setup` requires valid token for new device authorization
- **Token Management**: Admins can rotate the setup token from the security dashboard
- **Automatic Redirects**: Unauthorized devices are redirected to the setup page

---

## ⚡ Performance Optimizations

This project includes comprehensive performance optimizations to reduce CPU usage and improve response times.

### React Strict Mode Protection
**useRef Guards** prevent duplicate API calls that occur in React Strict Mode (development):

| Component | Optimization |
|-----------|--------------|
| `AdminHeader.tsx` | Prevents double notification polling |
| `TrustFooter.tsx` | Prevents double `getSiteConfig()` calls |
| `CategoryNav.tsx` | Prevents double category fetching |
| `AdminProvider.tsx` | Prevents double localStorage + DB sync |
| `app/(client)/page.tsx` | Prevents double home page data load |
| `app/admin/customers/page.tsx` | Prevents double customer list fetch |

### Server Action Caching
In-memory caching with TTL (Time-To-Live) for frequently accessed data:

```typescript
// 60-second cache with automatic invalidation
getSiteConfig()   // Cached, invalidated on update
getCategories()   // Cached, invalidated on create/delete
```

### Debounce & Throttle Utilities
Custom hooks in `lib/hooks/useDebounce.ts`:

```typescript
import { useDebounce, useDebouncedCallback, useThrottle } from '@/lib/hooks/useDebounce';

// Debounce a search value
const debouncedSearch = useDebounce(searchTerm, 300);

// Debounce a callback function
const debouncedFetch = useDebouncedCallback(fetchResults, 300);

// Throttle scroll handlers
const throttledScroll = useThrottle(scrollPosition, 500);
```

### Next.js Configuration
Optimized `next.config.ts` for production:

- **Image Optimization**: Remote patterns for external images, optimized device sizes
- **Gzip Compression**: Enabled via `compress: true`
- **Source Maps**: Disabled in production for smaller bundles
- **External Packages**: Prisma packages externalized for faster builds
- **Reduced Logging**: Fetch logging minimized in production

### Performance Impact
- **~50% fewer API calls** in development mode
- **Faster page loads** with cached server actions
- **Reduced database queries** through intelligent caching
- **Smaller production bundle** without source maps

---

## Project Structure
Here's a quick overview of how the codebase is organized:

```
crab-khai/
├── app/                  # Next.js App Router
│   ├── (client)/         # Client-facing pages (Menu, Checkout)
│   ├── admin/            # Admin dashboard routes
│   │   └── security/     # Security dashboard & device setup
│   ├── actions/          # Server actions (with caching)
│   └── api/              # API routes
├── components/           # Reusable UI components
│   ├── client/           # Components for the public store
│   ├── admin/            # Components for the admin panel
│   └── ui/               # Base UI elements (Buttons, Inputs)
├── lib/                  # Utilities and helper functions
│   ├── hooks/            # Custom React hooks (debounce, throttle)
│   └── prisma.ts         # Prisma client singleton
├── prisma/               # Database schema and config
└── public/               # Static assets (images, fonts)
```

## Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rootkityasin/CrabKhai.git
   cd CrabKhai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Kitchen Management System (Backend)
This project includes a robust backend administrative dashboard designed to streamline kitchen operations and business management. Everything you need to run the business is built right in.

### Key Features:
- **Order Management**: Real-time tracking of incoming orders, status updates, and fulfillment.
- **Product & Category Management**: Easy tools to add, update, or remove seafood items and organize them.
- **Inventory & Stock**: Keep track of what's fresh and what's running low.
- **Analytics & Reporting**: Insightful dashboards to monitor sales performance and customer trends.
- **Customer Database**: Manage customer profiles and order history.
- **Billing & Subscriptions**: Integrated financial tools for invoicing and subscription plans.
- **Marketing Tools**: Manage promos, themes, and automation settings.
- **Trusted Device Security**: Advanced security layer requiring device authorization for admin access.
- **Smart Admin Redirect**: Intelligent routing that instantly directs admins to the dashboard upon login.
- **User Roles**: Granular access control for admins, kitchen staff, and managers.

### ⚙️ Admin Panel Settings

The admin panel includes a powerful **Shop Settings** section that controls how your entire system operates:

#### Measurement Unit
Choose how stock and quantities are displayed:

| Setting | Display | Use Case |
|---------|---------|----------|
| **Product Pieces (Default)** | "5 pcs", "10 units" | Standard retail items |
| **Weight (Kg/Gm)** | "400g", "1.2kg" | Seafood, meat, bulk goods |
| **Volume (Ltr/ml)** | "500ml", "1.5 Ltr" | Liquids, beverages |

**Weight per Unit Setting:**
- Define: `1 Unit = X grams` (e.g., 200g)
- Controls how stock is **displayed and calculated** everywhere:
  - Cart Drawer: Shows "400g" instead of "2"
  - Cart Page: Weight-based quantity display
  - Admin Products: Shows "2.4 kg (12 units)"
  - Inventory: Add/remove stock in grams
  
**Logic:**
```
Display Weight = Stock Value (stored as grams)
Units (reference) = Stock Value ÷ Weight per Unit
```

#### Shop Type
Choose your business model:

| Type | Features |
|------|----------|
| **Restaurant** | Kitchen Order Board (Kanban), Stage management (Draft → Selling) |
| **Grocery/Retail** | Standard order table view, simplified workflow |

**What Changes:**
- Restaurant: Enables Kanban board at `/admin/orders`
- Grocery: Traditional order list view
- Product stages work differently based on shop type

### 📊 Customer Management

#### Excel Import Feature
Bulk import customers from CSV/Excel files:

1. Click **Upload Excel** → See format guide popup
2. File must have **Name** and **Phone** columns (Email optional)
3. System automatically:
   - Parses header row
   - Maps columns by name matching
   - Validates phone numbers (10+ digits)
   - Skips duplicates (by phone)
   - Reports: "Imported X, Skipped Y"

**Supported Column Names:**
- Name: `Name`, `Full Name`, `Customer Name`
- Phone: `Phone`, `Mobile`, `Contact`
- Email: `Email`, `Mail` (optional)

### 🧠 AI Smart Features (Powered by Gemini Pro)
- **Magic Description**: Automatically generates professional product descriptions.
- **Bangla Auto-Translate**: Translates ingredient names to Bangla as you type.
- **Smart Paste**: Copy-paste raw text (e.g., "Crab 500g 1200tk") and let AI parse it into the form. **(Price is intentionally excluded so you can set it manually)**.

## Design System
We use a custom theme configured in `tailwind.config.ts` to reflect our brand identity:
- **Colors**: `crab-red` (Primary), `ocean-blue` (Secondary), `sand` (Accent).
- **Typography**: Serif headings for elegance, Sans-serif body for readability.

## Contributing
Feel free to open issues or submit pull requests if you have ideas for improvements.

---
*Built with ❤️ by 90s Solutions*

## Deployment & Environment Variables

When deploying to Vercel (or any other host), you **MUST** configure the following Environment Variables in your project settings:

### Required Variables
| Variable Key | Description |
|--------------|-------------|
| `DATABASE_URL` | Connection string for your PostgreSQL database. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name (e.g., `dwrmfoq1a`). |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your **Unsigned** Upload Preset (e.g., `CrabKhai`). |
| `ADMIN_SETUP_SECRET` | Secret token for authorizing new admin devices (optional, has default). |

### How to Add in Vercel
1. Go to your Vercel Dashboard.
2. Select your project -> **Settings**.
3. Click on **Environment Variables** in the sidebar.
4. Add the keys and values listed above.
5. **Redeploy** your application for changes to take effect.
