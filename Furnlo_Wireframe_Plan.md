# Furnlo — MVP Wireframe Plan

## 1. Overview

This document defines every screen, component, and user flow needed for the Furnlo MVP. It covers three user roles (Designer, Client, Admin) across four core modules. Each screen includes its purpose, key elements, interactions, and navigation context.

**Design System Baseline:**
- Framework: Next.js + Tailwind CSS + shadcn/ui
- Layout: Sidebar navigation for dashboards, minimal nav for auth and client portal
- Responsive: Desktop-first (designers work on laptops), mobile-friendly for client portal
- Typography: Clean sans-serif, hierarchy through weight and size (not color alone)
- Color Direction: Neutral base (warm grays/off-white), single strong accent color for CTAs and active states. Furniture platforms should feel premium but not flashy.

---

## 2. Sitemap by Role

### Designer (Primary User)

```
/login
/signup
/dashboard
/projects
/projects/new
/projects/:id                → Project overview
/projects/:id/rooms          → Room briefs
/projects/:id/rooms/:roomId  → Room detail
/projects/:id/catalog        → Browse + compare products
/projects/:id/shortlist      → Shortlisted items
/projects/:id/cart           → Cart with locked variants
/projects/:id/order          → Order summary + payment
/projects/:id/orders/:orderId → Order status + PO breakdown
/settings                    → Profile, account
```

### Client (Read-Heavy, Limited Actions)

```
/client/login
/client/:projectId                → Project overview (shared link)
/client/:projectId/shortlist      → Review shortlisted items
/client/:projectId/order-status   → Order tracking (post-order)
```

### Admin / Platform Ops (Internal)

```
/admin/login
/admin/dashboard               → Overview metrics
/admin/designers               → Designer applications + approval queue
/admin/designers/:id           → Designer detail + approve/reject
/admin/orders                  → All orders across designers
/admin/catalog                 → Catalog ingestion management (Claude API trigger)
```

---

## 3. Screen-by-Screen Wireframe Spec

---

### 3.1 Authentication Screens

#### Screen: Designer Signup — `/signup`

**Purpose:** New designer creates an account (pending approval).

**Elements:**
- Furnlo logo + tagline
- Form fields: Full name, Email, Password, Confirm password, Business name, Phone number
- "Sign Up" button (primary CTA)
- Link: "Already have an account? Sign in"
- Footer: Minimal (copyright, terms)

**Behavior:**
- On submit → create account with status `pending_review` → redirect to a "Your application is under review" confirmation screen
- Basic client-side validation (email format, password match, required fields)

**Notes:** No email verification. No document upload. Keep it dead simple.

---

#### Screen: Designer Login — `/login`

**Purpose:** Approved designer signs into the platform.

**Elements:**
- Furnlo logo
- Form fields: Email, Password
- "Sign In" button
- Link: "Don't have an account? Sign up"

**Behavior:**
- On success → redirect to `/dashboard`
- If account is `pending_review` → show message: "Your account is under review"
- If account is `rejected` → show message: "Your application was not approved"

---

#### Screen: Client Login — `/client/login`

**Purpose:** Client accesses their project portal.

**Elements:**
- Furnlo logo + "Client Portal" label
- Form fields: Email, Access code (or password)
- "View My Project" button

**Behavior:**
- On success → redirect to `/client/:projectId`
- For MVP, client credentials are created by the designer during client onboarding

---

#### Screen: Admin Login — `/admin/login`

**Purpose:** Internal team accesses the admin panel.

**Elements:**
- Simple email + password form
- No signup link (admin accounts created manually)

---

### 3.2 Designer Dashboard

#### Screen: Dashboard — `/dashboard`

**Purpose:** Designer's home screen after login. Quick overview of active work.

**Layout:** Sidebar (left) + Main content (right)

**Sidebar Navigation:**
- Dashboard (active)
- Projects
- Settings
- Logout

**Main Content:**
- **Welcome header:** "Welcome back, {name}"
- **Stats row (3-4 cards):**
  - Active projects count
  - Items in shortlists (across projects)
  - Pending orders
  - Total ordered value (lifetime)
- **Recent projects list:** Table or card grid showing last 5 projects with name, client, status, last updated, and a "View" link
- **Quick action:** "+ New Project" button (prominent)

---

### 3.3 Projects Module

#### Screen: Projects List — `/projects`

**Purpose:** All projects for this designer.

**Elements:**
- Page header: "Projects" + "+ New Project" button (top-right)
- Filter/sort: By status (Draft, Active, Ordered, Closed), by date
- **Project cards or table rows**, each showing:
  - Project name
  - Client name
  - Status badge (color-coded)
  - Room count
  - Created date
  - "View" action

---

#### Screen: New Project — `/projects/new`

**Purpose:** Designer creates a new project and onboards a client.

**Layout:** Multi-step form or single scrollable form with sections.

**Section 1 — Client Details:**
- Client name
- Client email
- Client phone
- Billing address
- Shipping address (checkbox: "Same as billing")

**Section 2 — Project Details:**
- Project name
- Project description / notes
- Budget range: Two input fields (Min and Max in USD). Predefined quick-select chips: "$5k–$15k", "$15k–$30k", "$30k–$50k", "$50k–$100k", "$100k+" — clicking a chip auto-fills min/max, but designer can override manually. This approach lets designers set precise ranges while keeping input fast.
- Style preference: Single text input with placeholder text: "e.g., Modern minimalist with warm wood tones" (free-text, not multi-select — keeps it flexible for MVP)

**Section 3 — Room Briefs (repeatable):**
- "+ Add Room" button
- For each room:
  - Room name (e.g., "Living Room", "Master Bedroom")
  - **Room dimensions (required):** Length (ft) × Width (ft) × Height (ft). Auto-calculated area in sq.ft displayed below inputs. Furniture recommendations and fit assessments depend on this data.
  - **Room budget range:** Min and Max (USD). Quick-select chips proportional to project budget. Sum of room budgets shown against project total to help designer allocate.
  - Category needs (multi-select: Sofa, Dining Table, Bed, Desk, Storage, Lighting, Fan, Rug, etc.)
  - **Client requirements** (structured capture):
    - Color palette preferences (text input with placeholder: "e.g., neutrals, warm earth tones")
    - Material preferences (text input with placeholder: "e.g., no glass, prefer solid wood")
    - Seating / capacity needs (number input, optional)
    - Functional constraints (textarea with placeholder: "e.g., must fit through 30-inch doorway, needs storage underneath")
    - Inspiration / moodboard links (URL input, repeatable)
  - **Designer internal notes** (textarea — private, not visible to client)
  - **Shared notes** (textarea — visible to both designer and client in portal)

**Behavior:**
- "Save as Draft" → saves with status `draft`
- "Create Project" → saves with status `active`, generates client portal access
- Room dimensions auto-calculate sq.ft: `length × width = area_sqft`
- On success → redirect to `/projects/:id`

---

#### Screen: Project Overview — `/projects/:id`

**Purpose:** Single project hub. Everything about this project in one place.

**Layout:** Sidebar (global nav) + Project sub-navigation (horizontal tabs or secondary sidebar)

**Project Sub-Navigation Tabs:**
- Overview (active)
- Rooms
- Catalog
- Shortlist
- Cart
- Orders

**Overview Content:**
- **Project header:** Project name, client name, status badge, created date
- **Client info card:** Name, email, phone, shipping address. "Edit" link. "Share Client Portal Link" button.
- **Room summary:** List of rooms with category needs. "Manage Rooms" link → `/projects/:id/rooms`
- **Project activity / timeline:** Simple log of recent actions (project created, items shortlisted, order placed, etc.)
- **Quick stats:** Items shortlisted, items in cart, orders placed

---

#### Screen: Rooms — `/projects/:id/rooms`

**Purpose:** Manage room-level briefs within a project.

**Elements:**
- List of rooms as cards
- Each card: Room name, category needs as tags, dimensions, budget, notes
- "Edit" and "Delete" actions per room
- "+ Add Room" button
- Click room name → `/projects/:id/rooms/:roomId` (room detail with shortlisted items for that room)

---

### 3.4 Catalog & Comparison Module (Core Wedge)

#### Screen: Catalog Browse — `/projects/:id/catalog`

**Purpose:** Designer searches and browses furniture products across brands within the project context. THIS IS THE MOST IMPORTANT SCREEN IN THE MVP.

**Layout:** Full-width with filters sidebar (left) + product grid (right)

**Top Bar:**
- Search input: "Search products..."
- Room context selector: Dropdown to filter by room from this project
- "Compare Selected" button (disabled until 2+ products selected)

**Filters Sidebar:**
- Category (Sofa, Dining Table, Bed, etc.) — derived from room brief needs
- Brand (checkboxes for available brands)
- Price range (slider: min-max)
- Material (Wood, Metal, Fabric, Leather, etc.)
- Style (Modern, Traditional, etc.)
- Availability (In Stock, Made to Order)
- Sort by: Price low-high, Price high-low, Brand A-Z, Lead time

**Product Grid:**
- Card layout (3-4 columns on desktop)
- Each product card:
  - Product image (primary)
  - Product name
  - Brand name (subtle)
  - MRP price (client-facing)
  - Checkbox: "Select for comparison"
  - **Pin icon:** "Pin for comparison" (sets this as the reference product)
  - Quick actions: "Shortlist" heart/bookmark icon, "View Details" link
  - Lead time badge (e.g., "Ships in 4-6 weeks")
  - **Room fit indicator** (if room context is selected): green/yellow/red based on product vs. room dimensions

**Global Catalog:**
- Products scraped by ANY designer or admin are stored globally and visible to ALL designers
- "Browse Existing Catalog" tab shows all previously scraped products (no re-scraping needed)
- "Import New Products" tab allows adding new brand URLs

**Empty State:**
- If no products loaded: "No products found. Add products to the catalog." + "Import from URL" button (triggers Claude API extraction)

**Catalog Ingestion Action:**
- "Import Products" button (top-right or empty state)
- Opens modal: "Paste a furniture brand collection URL"
- Input field for URL
- **Cache indicator:** If URL was previously scraped, show "Products from this URL were last imported on {date}. Use cached data or re-import?"
- "Extract Products" button → checks cache first → if miss, calls Claude API → shows loading spinner → populates grid on success

---

#### Screen: Product Detail — Modal or `/projects/:id/catalog/:productId`

**Purpose:** Full product details before shortlisting.

**Elements:**
- Image gallery (main image + thumbnails)
- Product name, brand
- MRP price
- Variant selector: Finish/color dropdown, Size dropdown (if applicable)
- Specifications table: Dimensions (L × W × H × D), Weight, Material, Construction
- Lead time
- Product description
- "Shortlist for {Room Name}" button (dropdown to select room)
- "Add to Comparison" button
- Link: "View on brand site" (opens product_url in new tab)

---

#### Screen: Comparison View — `/projects/:id/catalog/compare`

**Purpose:** Side-by-side comparison of products across brands. The pin-and-compare mechanism is Furnlo's core differentiator.

**Pin-and-Compare Mechanism:**
1. Designer browses catalog and clicks "Pin" on a product (e.g., a sofa from Brand X)
2. The pinned product becomes a fixed reference column (highlighted, locked to the left)
3. Designer then selects other products from different brands to compare against the pin
4. The pinned column stays visible while comparison products can be swapped in/out
5. Designer can change the pinned product at any time
6. Pinned state persists per project/room (saved in `pinned_comparisons` table)

**Layout:** Pinned column (left, visually distinct with accent border) + comparison columns (right, scrollable if > 2)

**Comparison Rows (vertical):**

| Attribute | Pinned (Brand X) | Brand Y | Brand Z |
|---|---|---|---|
| Image | [img] | [img] | [img] |
| Name | — | — | — |
| Brand | — | — | — |
| Price (MRP) | — | — (highlight if cheaper) | — |
| Dimensions | — | — (flag if larger than room) | — |
| Material | — | — | — |
| Finish Options | — | — | — |
| Lead Time | — | — (highlight if faster) | — |
| Availability | — | — | — |
| Customization | — | — | — |
| **Room Fit** | — | — | — |

**Room Fit Row:** Auto-calculated based on product dimensions vs. room dimensions (sq.ft). Shows "Fits" (green), "Tight" (yellow), or "Won't Fit" (red). This connects back to the room dimensions captured during project creation.

**Actions per column:**
- "Shortlist" button
- "Remove from comparison" (X icon)
- "Pin This Instead" (swap which product is the reference)

**Top actions:**
- "Back to Catalog" link
- "Share comparison with client" button (generates a view in client portal — designer notes excluded)
- Room selector dropdown (compare for specific room context, pulls room dimensions for fit check)

---

### 3.5 Shortlist Module

#### Screen: Shortlist — `/projects/:id/shortlist`

**Purpose:** All shortlisted products for this project, organized by room.

**Layout:** Grouped by room (collapsible sections)

**Per Room Section:**
- Room name header + item count + room dimensions (sq.ft)
- Product cards (horizontal list or table):
  - Image thumbnail
  - Product name
  - Brand
  - Selected variant (finish, size)
  - MRP price
  - Room fit indicator (from dimension comparison)
  - Status badge: Suggested / Approved / Rejected (if client has reviewed)
  - Actions: "Add to Cart", "Remove", "Swap" (go back to catalog for this room)

**Top Actions:**
- "Share with Client" button → makes shortlist visible in client portal
- "Add All to Cart" button (for approved items)
- Filter: By room, by approval status

**Notes Visibility (Critical):**
- **Designer notes** section: Visible ONLY in designer view. Shows designer's internal reasoning, fit assessment, pairing notes, and priority ranking. Never appears in client portal.
- **Client notes** section: Visible ONLY in client portal. Client's comments and feedback on products. Designer sees these in their view but cannot edit them.
- **Shared notes** section: Visible to BOTH designer and client. Agreed decisions, confirmed preferences.

---

### 3.6 Cart & Order Module

#### Screen: Cart — `/projects/:id/cart`

**Purpose:** Final pre-order review. Variant locking happens here.

**Layout:** Table/list format

**Per Line Item:**
- Image thumbnail
- Product name + brand
- Selected variant: Finish, Size (editable dropdowns — this is where variant locking happens)
- Quantity (editable number input)
- Unit price (MRP)
- Line total
- Room assignment
- Estimated lead time
- "Remove" action

**Cart Summary (right sidebar or bottom):**
- Subtotal
- Tax estimate
- Shipping estimate
- **Total**
- "Proceed to Order" button (primary CTA)

**Validation before proceeding:**
- All variants must be selected (no empty finish/size)
- Quantities must be > 0
- Shipping address must exist on the project
- Show inline errors if validation fails

---

#### Screen: Order Summary & Payment — `/projects/:id/order`

**Purpose:** Final confirmation before placing the bulk order.

**Section 1 — Order Review:**
- All line items (read-only, summarized from cart)
- Grouped by brand (preview of how the order will split)
- Shipping address
- Total amount

**Section 2 — Payment:**
- Stripe Elements embedded (card input)
- "Place Order" button
- For MVP: Stripe test mode, so use test card numbers

**Behavior:**
- On "Place Order" → create project order with status `submitted` → process Stripe payment → on success, update to `paid` → split into brand POs → redirect to order confirmation

---

#### Screen: Order Confirmation & Status — `/projects/:id/orders/:orderId`

**Purpose:** Post-order view showing the single project order and its brand PO breakdown.

**Section 1 — Project Order:**
- Order ID, date, status badge, total amount
- Payment status (Paid / Pending)

**Section 2 — Brand PO Breakdown:**
- Expandable sections per brand
- Each brand section shows:
  - Brand name
  - PO status badge (Sent, Acknowledged, etc.)
  - Line items for that brand
  - Subtotal for that brand

**Section 3 — Timeline:**
- Simple vertical timeline: Order placed → Payment confirmed → POs sent to brands → ...

---

### 3.7 Client Portal

#### Screen: Client Project View — `/client/:projectId`

**Purpose:** Client sees their project at a glance. Clean, minimal, read-heavy.

**Layout:** No sidebar. Top navigation bar with Furnlo logo + project name + logout.

**Content:**
- **Project header:** Project name, designer name and contact, project status
- **Navigation tabs:** Shortlist | Order Status
- **Shortlist tab (default):**
  - Products grouped by room (room name + dimensions shown)
  - Each product: Image, name, brand, MRP price, selected variant, room fit indicator
  - **Shared notes** visible (agreed decisions between designer and client)
  - **Client notes** section: Client can add/edit their own comments per product (private, designer sees but cannot edit)
  - **Designer notes are NEVER shown here** — client cannot see designer's internal reasoning, fit assessments, or pairing notes
  - Actions (if permissions allow): "Approve", "Reject", "Add Comment"
- **Order Status tab:**
  - Visible only after order is placed
  - Simplified order status (not the full PO breakdown)
  - Expected delivery timeline

**Design Notes:**
- This portal should feel calm and premium. The client doesn't need to see trade discounts, PO splits, or operational complexity.
- MRP pricing only. No internal economics visible.
- Notes visibility is a hard boundary: `designer_notes` → never in client portal, `client_notes` → never in designer dashboard editable, `shared_notes` → visible everywhere.

---

### 3.8 Admin Panel

#### Screen: Admin Dashboard — `/admin/dashboard`

**Purpose:** Platform operations overview.

**Elements:**
- Stats cards: Total designers (by status), total projects, total orders, total GMV
- Recent designer applications (quick approve/reject)
- Recent orders

---

#### Screen: Designer Applications — `/admin/designers`

**Purpose:** Review and approve/reject designer signups.

**Elements:**
- Table: Name, email, business name, signup date, status, actions
- Filter by status: Pending, Approved, Rejected
- Click row → designer detail

---

#### Screen: Designer Detail — `/admin/designers/:id`

**Purpose:** View designer info and take action.

**Elements:**
- All submitted info (name, business, email, phone)
- Account status with action buttons: "Approve" / "Reject" / "Suspend"
- Designer's projects list (if approved)

---

#### Screen: Catalog Management — `/admin/catalog`

**Purpose:** Trigger and manage catalog ingestion.

**Elements:**
- "Import Products" section:
  - URL input field
  - "Extract via Claude API" button
  - Import history log (URL, timestamp, products extracted, status)
- Products table: Name, brand, price, status (active/inactive), last updated
- Bulk actions: Activate, deactivate, delete

---

## 4. User Flow Diagrams

### Flow A — Designer Complete Journey (MVP Demo Flow)

```
Signup → Pending Review → [Admin Approves] → Login
  → Dashboard → + New Project → Enter client + rooms
    → Catalog → Browse/Search → [Import from URL if empty]
      → Select products → Compare side-by-side
        → Shortlist items (assign to rooms)
          → Share shortlist with client
            → [Client reviews, approves/rejects]
              → Add approved items to Cart
                → Lock variants, set quantities
                  → Proceed to Order → Stripe Payment
                    → Order placed → POs generated
                      → Order status visible to designer + client
```

### Flow B — Client Review Flow

```
Receives portal link from designer → Login
  → View project shortlist by room
    → Approve / Reject / Comment on items
      → [Designer sees feedback]
        → After order is placed: View order status
```

### Flow C — Admin Approval Flow

```
Login → Dashboard → See pending applications
  → Click designer → Review details
    → Approve or Reject
      → Designer receives access (or rejection)
```

### Flow D — Catalog Ingestion Flow

```
Admin or Designer triggers "Import Products"
  → Paste brand collection URL
    → Claude API + web search extracts product data
      → Returns structured JSON
        → Validate fields (name, price, image required)
          → Insert into products table
            → Products appear in catalog browse
```

---

## 5. Component Library (Reusable Across Screens)

| Component | Used In | Description |
|---|---|---|
| `Sidebar` | All designer pages | Global nav: Dashboard, Projects, Settings, Logout |
| `ProjectTabs` | Project detail pages | Sub-nav: Overview, Rooms, Catalog, Shortlist, Cart, Orders |
| `ProductCard` | Catalog, Shortlist | Image, name, brand, price, quick actions |
| `ComparisonColumn` | Comparison view | Single product column in comparison grid |
| `StatusBadge` | Everywhere | Color-coded pill: Draft, Active, Pending, Approved, etc. |
| `RoomCard` | Rooms list | Room name, category tags, dimensions, actions |
| `LineItem` | Cart, Order summary | Product row with variant selectors, quantity, price |
| `FilterSidebar` | Catalog browse | Category, brand, price, material, style filters |
| `ImportModal` | Catalog, Admin | URL input + Claude API trigger for product extraction |
| `TimelineVertical` | Order status | Step-by-step progress indicator |
| `StatCard` | Dashboards | Metric label + value + optional trend |
| `EmptyState` | Any list/grid | Illustration + message + CTA when no data exists |

---

## 6. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| **Desktop (1280px+)** | Full sidebar + main content. Catalog shows 4-column grid. Comparison shows up to 4 products. |
| **Tablet (768-1279px)** | Sidebar collapses to icons. Catalog shows 2-3 column grid. Comparison stacks to 2 products with horizontal scroll. |
| **Mobile (< 768px)** | Bottom tab navigation replaces sidebar. Catalog shows 1-2 column grid. Comparison becomes swipeable cards. Cart becomes stacked list. **Client portal is the priority for mobile optimization.** |

---

## 7. Wireframe Build Order (Recommended Sequence)

Build wireframes in this order — each builds on the previous:

| Phase | Screens | Rationale |
|---|---|---|
| **Phase 1** | Login, Signup, Dashboard | Auth + entry point. Proves the skeleton works. |
| **Phase 2** | Projects list, New Project, Project Overview, Rooms | CRUD foundation. Data needed for everything else. |
| **Phase 3** | Catalog Browse, Product Detail, Comparison View, Import Modal | **The core wedge.** This is what investors will evaluate. Spend the most time here. |
| **Phase 4** | Shortlist, Cart, Order Summary, Order Confirmation | Complete the purchase flow. |
| **Phase 5** | Client Portal (all screens) | Proves the multi-stakeholder model. |
| **Phase 6** | Admin Dashboard, Designer Applications, Catalog Management | Operational control layer. Can be rough for MVP. |

---

## 8. Design Tokens (Suggested Starting Point)

```css
/* Colors */
--color-bg:          #FAFAF8;       /* warm off-white */
--color-surface:     #FFFFFF;
--color-border:      #E8E5E0;
--color-text:        #1A1A1A;
--color-text-muted:  #6B6560;
--color-accent:      #2C5F2D;       /* deep green — premium, furniture-appropriate */
--color-accent-hover:#234D24;
--color-error:       #C53030;
--color-success:     #2C5F2D;
--color-warning:     #D69E2E;

/* Status badge colors */
--status-draft:      #9CA3AF;
--status-active:     #3B82F6;
--status-approved:   #10B981;
--status-rejected:   #EF4444;
--status-pending:    #F59E0B;
--status-ordered:    #6366F1;

/* Typography */
--font-display:      'DM Serif Display', serif;    /* headings, logo */
--font-body:         'DM Sans', sans-serif;         /* body text, UI */

/* Spacing scale */
--space-xs:  4px;
--space-sm:  8px;
--space-md:  16px;
--space-lg:  24px;
--space-xl:  32px;
--space-2xl: 48px;
--space-3xl: 64px;

/* Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

/* Shadows */
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px rgba(0,0,0,0.07);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.1);
```

---

## 9. Key Design Principles for Furnlo

1. **Designer-first, not shopper-first.** This is a professional tool, not a consumer marketplace. The UI should feel like a workspace, not a storefront.
2. **Comparison is king.** The catalog comparison view should be the most polished screen. If only one screen looks great, it should be this one.
3. **Hide complexity from the client.** The client portal shows MRP pricing, room context, and approval actions. Nothing about trade discounts, POs, or brand economics.
4. **Status visibility everywhere.** Every object (project, shortlist item, order, PO) should show its status clearly. Use consistent color-coded badges.
5. **Progressive disclosure.** Don't overload screens. Use expandable sections, modals, and detail views to reveal information on demand.

---

*Document prepared as wireframe blueprint for Furnlo MVP*
*Last updated: March 12, 2026*
