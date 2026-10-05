# 🧭 SAARATHI
### *Every Journey Needs a Guide.*
**AI-Powered Journey Intelligence Platform for Indian Roads**

---

## 🌟 The Vision
Traditional navigation asks:
> *"What is the fastest route?"*

**Saarathi answers:**
> *"What is the smartest route for **THIS** journey, **THIS** vehicle, **THIS** user, and **THIS** situation?"*

Saarathi moves beyond standard map routing by unifying:
`Navigation + Route Intelligence + Vehicle Intelligence + Cost Intelligence + Road Intelligence + Journey Simulation + Explainable AI Decision Making`

---

## 🚀 Key Architectural Pillars

### 1. Vehicle-Aware Routing & Dynamics
- **🏍️ Motorcycle / Scooter:** Optimizes for smooth asphalt to reduce two-wheeler fatigue, avoids deep monsoon waterlogging, and accounts for two-wheeler toll exemption on Indian highways.
- **🚗 Car / SUV:** Balances transit velocity, toll plaza costs (FASTag), traffic bottlenecks, and secure parking availability.
- **⚡ Electric Vehicle (EV):** Real-time battery drain calculation, arrival reserve percentage, kilowatt-hour consumption, and mapped fast-charging hubs (Tata EZ Charge, Jio-bp, Ather Grid, Statiq) with detour times.
- **🛺 Auto Rickshaw:** CNG fuel consumption and urban corridor suitability.
- **🚲 Bicycle:** Pothole avoidance, maximum comfortable commute ranges, and elevation minimization.

### 2. Deterministic Saarathi Journey Score (0–100)
Rather than arbitrary metrics, Saarathi calculates a multi-factor score:
$$\text{Saarathi Score} = w_t \cdot S_{\text{time}} + w_c \cdot S_{\text{cost}} + w_r \cdot S_{\text{road}} + w_s \cdot S_{\text{safety}} + w_v \cdot S_{\text{vehicle}} + w_{tr} \cdot S_{\text{traffic}} + w_e \cdot S_{\text{efficiency}}$$
Weights dynamically calibrate based on user modes:
- **⚡ Fastest:** Time prioritization ($w_t = 0.45$)
- **💰 Cheapest:** Total cost minimization ($w_c = 0.48$)
- **🛡️ Safest:** Hazard & waterlogging avoidance ($w_s = 0.40$)
- **🛣️ Smoothest:** Surface smoothness & pothole avoidance ($w_r = 0.48$)
- **⚖️ Balanced:** Optimal compromise across all factors

### 3. "Why Saarathi Chose This Route" (Explainable AI Engine)
Every recommendation provides transparent, data-driven rationales:
- `✓ ₹84 cheaper than expressway corridor`
- `✓ +28% higher road smoothness index`
- `✓ 2 fewer hazard & pothole segments`
- `✓ Zero toll plazas`
- `✓ Only 4 minutes slower with 60% less vehicle wear`

### 4. Natural Language AI Journey Planner
Type constraints in natural language or Hinglish:
> *"I need to reach college by 9 AM, I'm on a bike and I don't want to spend more than ₹150."*
The engine parses:
- **Vehicle:** Bike
- **Arrival Deadline:** 9:00 AM
- **Budget:** ₹150
- **Priority:** Cheapest + On-time
Automatically configures the planner and selects the optimal path.

### 5. ⭐ Live Journey Simulation Mode
- **60fps Smooth Geometry Animation:** Vehicle marker moves continuously along real curved road coordinates using `requestAnimationFrame` and spatial interpolation.
- **Dynamic Heading Rotation:** Calculates compass bearing in real-time, rotating vehicle orientation smoothly toward road headings.
- **Turn Anticipation:** Realistic velocity curves slowing down at tight junctions and roundabouts.
- **Follow Camera Mode:** Toggles between automatic center tracking and free-roam exploration.
- **Live Road Events:** Toast warnings when approaching potholes, waterlogging, or speed breakers.
- **Toll Arrival Experience:** Displays toll barrier ahead, executes automated FASTag deduction, and ticks running trip costs in real-time.
- **Dynamic Rerouting Event:** Demonstrates real-time condition changes, alerting the driver and smoothly rerouting upon clicking **[SWITCH ROUTE]**.
- **Off-Route Recovery:** Simulates off-route departure with automated recalculation.

### 6. Road Intelligence & Crowdsourced Network
- Interactive map overlays for:
  - 🕳️ Potholes
  - 🚧 Hazards & Construction
  - 🌊 Monsoon Waterlogging
  - 🛣️ Toll Plazas
  - ⚡ EV Superchargers
  - 🅿️ Destination Parking
- Regional Road Health Score (0–100).
- Crowdsourced Incident Reporter with verification upvotes.
- Smart Departure Time Advisor evaluating traffic waves.

### 7. Preloaded Indian Metros Demo
- **Hyderabad:** Banjara Hills Road No. 12 → Gachibowli Financial District
- **Bengaluru:** MG Road (Cubbon Park) → Electronic City Phase 1
- **Chennai:** Guindy Olympia Tech Park → ECR Kovalam Beach
- **Mumbai:** Bandra West Linking Road → Navi Mumbai Vashi Plaza
- **Delhi NCR:** Connaught Place → DLF Cyber City Gurgaon
*(Plus any custom click on the map anywhere in India or the world!)*

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling & Theme:** Tailwind CSS v4, custom glassmorphism, royal amber/gold Indian luxury tech aesthetic (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`)
- **Mapping & GIS:** Leaflet + CartoDB Dark Matter luxury tiles (100% reliable, zero API key failures during presentations)
- **Icons & Polish:** Lucide React, Canvas Confetti

---

## 🏃 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📄 License
MIT License. Crafted for the Next-Gen Mobility Hackathon.
