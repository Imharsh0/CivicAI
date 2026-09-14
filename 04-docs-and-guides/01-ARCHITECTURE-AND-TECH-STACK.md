# CivicAI System Architecture & Tech Stack

> “See a problem. Report it. Let AI take it forward.”

CivicAI is built as a lightweight, scalable, and modular civic defect reporting and resolution platform tailored for Indian cities, municipal bodies, RWAs, and university campuses.

---

## 1. High-Level Architecture Diagram

```
                              CIVICAI PLATFORM
                                     |
         ┌───────────────────────────┴───────────────────────────┐
         │                                                       │
   FRONTEND (03-frontend)                                  BACKEND (01-database)
 React 18 + Vite + TypeScript                            Supabase PostgreSQL
 Tailwind CSS + Lucide Icons                             Row Level Security (RLS)
 Bilingual (English / हिन्दी)                             Supabase Auth (JWT)
 Offline-Tolerant Demo Mode                              Supabase Storage Buckets
 Leaflet Geo-Map                                                │
         │                                                       │
         └───────────────────────────┬───────────────────────────┘
                                     │
                             AI VISION ENGINE
                                     │
                        (02-edge-functions)
                     analyze-civic-issue (Deno)
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
     Google Gemini 1.5/2.0 Flash                Client-Side Demo Engine
     Vision API (Zero-Leak Edge)                 Zero-Config Hackathon Fallback
```

---

## 2. Component Specifications

### A. Frontend Layer (`03-frontend`)
- **React 18 & Vite**: Sub-second Hot Module Replacement (HMR) and ultra-fast builds.
- **Client-Side Image Compression**: Pure HTML5 Canvas pipeline (`useImageCompression.ts`) that downscales camera photos to WebP/JPEG under 300KB–1MB before transmission, reducing mobile data consumption across Indian 4G/5G networks.
- **Bilingual Context**: English and Hindi (`LanguageContext.tsx`) with Indian civic terminology.
- **City Context**: 20 tier-1 and tier-2 Indian metros (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, Gurugram, Noida, Bhopal, Indore, Patna, Surat, Nagpur, Kochi, Bhubaneswar).

### B. Algorithmic Priority Engine (`priorityEngine.ts`)
Objective 0–100 priority score calculated via:
$$\text{Score} = \text{Severity} (40\%) + \text{Safety Hazard} (25\%) + \text{Location Corridor} (20\%) + \text{Lifeline Multiplier} (15\%)$$
- **P1 — Critical (85–100)**: Immediate accident hazard or drinking water pipeline burst.
- **P2 — High (70–84)**: Significant health/sanitation or unlit electrical hazards.
- **P3 — Medium (50–69)**: Secondary obstructions and non-critical maintenance.
- **P4 — Low (<50)**: Minor surface defects and cosmetic fixtures.

### C. Lightweight Duplicate Detection (`duplicateDetection.ts`)
- Utilizes the Haversine spherical distance formula to flag active reports within a 600m radius of the same civic category.
- Displays a non-blocking prompt offering:
  1. *View Existing Report*
  2. *Add Supporting Evidence*
  3. *Continue Reporting*

### D. Resolution Evidence System (`BeforeAfterViewer.tsx`)
CivicAI closes the loop on civic complaints by requiring authorities to submit an **After** resolution photograph and official field remarks before an issue is designated as **Resolved**.
