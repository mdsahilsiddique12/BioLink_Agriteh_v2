# BioLink Agritech Solutions (V2.0 — Enterprise Multi-Tenant Platform)

An ultra-premium, multi-tenant B2B agritech platform built with **React 19 + Vite + Express 5 + MongoDB**, engineered with dedicated sector spaces, runtime dynamic design tokens, interactive freight calculators, and verified Resend transactional email routing.

---

## 🏛️ Dedicated Sector Spaces & Subdomains

| Sector | Core Subdomain | Aesthetic Theme | Primary Palette | Key Commodities |
| :--- | :--- | :--- | :--- | :--- |
| **Corporate Gateway** | `biolinkagri.in` | **Sapphire Corporate** | High-end Deep Blue, Dark Slate, Clean Platinum | Enterprise Overview, Multi-State Corridors, ESG |
| **Organic Manure** | `manure.biolinkagri.in` | **Bio-Organic Earth** | Rich Forest Green, Warm Soil Brown, Soft Sand | Certified Fermented Organic Manure (FOM), Liquid Slurry |
| **Industrial Feed** | `feed.biolinkagri.in` | **Industrial Harvest** | Sun-Ripened Corn Gold, Deep Molasses, Matte Charcoal | Corn DDGS (30% Protein), Rice DDGS (42%), Heavy Cane Molasses (82° Brix) |
| **Premium Botanicals** | `seabuckthorn.biolinkagri.in` | **Himalayan Premium** | Alpine Orange, Cold Slate Grey, Pristine Snow White | Supercritical CO₂ Seed Oil, Ruby Pulp Oil (>32% Omega-7), Freeze-Dried Berry Powder |

---

## 🚀 Key Upgrades & Architectural Innovations

### 1. Hybrid Multi-Tenant Engine
- **Runtime Theme Token Injection**: Detects incoming subdomain (`manure.*`, `feed.*`, `seabuckthorn.*`, `biolinkagri.in`) or local query/path overrides (`?tenant=feed`, `/feed`) and updates root CSS custom properties dynamically.
- **Floating Network Switcher Bar**: Located above the navbar to seamlessly preview and switch between all 4 industrial sectors in real time.

### 2. Interactive Multi-Axle Tonnage Slider (`<TonnageSlider />`)
- Smooth slider from **15 MT to 500+ MT**
- Automated FTL truckload calculation (e.g., `2 x 25-Ton Multi-Axle Taurus Trucks`)
- Dynamic volume tier discounting (up to -₹350/MT)
- Real-time interstate freight estimation matrix based on destination corridor (Bihar, Bengal, UP, Assam, etc.)
- Dharma Kanta weighbridge compliance verification notice.

### 3. Clean Structural Glassmorphism Cards (`<ProductSpecCard />`)
- Replaced blocky paragraphs with low-border key-value technical data sheets
- Highlights laboratory benchmarks: Crude Protein %, Moisture Cap, Brix Rating, Omega-7 purity
- Direct Certificate of Analysis (COA) modal hooks.

### 4. Upgraded Resend Transactional Email Infrastructure
- Dedicated service in `server/services/resendService.js` and unified `server/services/emailService.js`
- Custom domain verified dispatch (`info@biolinkagri.in` / `notifications.biolinkagri.in`)
- Responsive HTML templates for:
  - Corporate sourcing intakes & RFQs
  - Organic FOM bulk orders & lab samples
  - DDGS & Molasses feed mill procurement
  - Himalayan Sea Buckthorn pilot pack requests
- Fallback to Nodemailer and local development logging when needed.

---

## 🛠️ Getting Started

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run frontend dev server
npm run dev

# 3. In a separate terminal, run backend API
npm run dev:api
```

### Production Build
```bash
npm run build
```

---

## 🐙 Connecting to a Brand New GitHub Repository

```bash
# 1. Initialize git (already done in this folder)
git add .
git commit -m "feat: initial commit for BioLink Agritech V2 enterprise platform"

# 2. Create a new repository on your GitHub account (e.g. 'biolink-agritech-v2')

# 3. Link and push to your new remote repository
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-NEW-REPO>.git
git branch -M main
git push -u origin main
```
