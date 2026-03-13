# Design Disaster: Tomato 🛒🍅

**🏆 National Hackathon Submission**

**Design Disaster** is a front-end "Quick Commerce" web interface built with Next.js, React, Framer Motion, and Tailwind CSS. The primary objective of this project is to intentionally design an agonizing, psychologically excruciating, and hostile user experience by violating established UI/UX heuristic principles (such as Nielsen's heuristics). 

The application perfectly demonstrates how *not* to design a platform, purposely destroying the core promises of "speed" and "convenience" that quick-commerce platforms rely on.

---

## 🚀 The UX Violations

Below are the deliberate Dark-Pattern heuristics implementations you will suffer through when using this app:

### 1. Wait, Was That Even a Loading Screen?
* **Violation:** Visibility of System Status & User Control.
* **Malice:** We artificially stall the entire application on the initial render with a fully blocking, 6-second fake loading screen analyzing "multiversal delivery routes". It stutters realistically to maximize user frustration.

### 2. The Worst Search Bar Placed Wrongly
* **Violation:** Consistency & Proximity, User Control.
* **Malice:** A massive global search bar is glued to the absolute bottom of the DOM. Typing in it triggers an antagonistic "autocorrect" feature that rewrites simple words into complex nonsense (e.g., "Bread" -> "Breadcrumbs for pigeons"). 

### 3. Infinite Geometric Categories
* **Violation:** Recognition rather than Recall & Fitts's Law.
* **Malice:** Categories are represented by an infinite, auto-scrolling horizontal marquee of identical, low-contrast, abstract SVG shapes without text labels. Worse, if you try to hover over the marquee to click one, it *accelerates* to an impossible speed.

### 4. Mathematical CAPTCHA Cart Verification
* **Violation:** Match between system and real world & Error Prevention.
* **Malice:** Clicking "Add to Cart" locks the user in a modal where they must solve a randomly generated algebraic equation (to 2 decimal places) just to prove they aren't a sentient AI. Upon success, it adds a fractional, non-integer quantity (e.g., 1.7 apples) to the cart. 

### 5. Invisible Checkout Button
* **Violation:** Discoverability.
* **Malice:** The checkout button is embedded inside a claustrophobic, 600px tall scrolling block composed of hundreds of lines of Lorem Ipsum legal text. 
* **The Trap:** The button is styled as plain text. To prevent you from clicking it, an invisible `div` overlays 90% of the text surface, creating a microscopic, near-impossible hitbox. Oh, and if you hover over the clickable 10%, there is a 30% chance the button springs to a random location on the screen.

### 6. Ruptured Network Performance
* **Violation:** Performance Mismatch & Efficiency.
* **Malice:** The tiny 40x40 pixel thumbnails in the cart and grid fetch massive, unoptimized **4000x4000 pixel images** from random placeholder APIs, completely destroying network performance and battery life.

### 7. Infinite Pop-ups
* **Violation:** User Control & Freedom.
* **Malice:** High-contrast scam advertisements randomly spawn over the UI every few seconds. The "Close" (X) buttons are microscopic (6px text size), shift violently when hovered, and have a 20% chance of spawning *another* ad instead of actually closing.

### 8. Scroll Hijacking
* **Violation:** Consistency & Standards.
* **Malice:** Trying to scroll down has a 10% chance of instantly jerking the screen 200px upward instead.

### 9. Persistent Screen-Robbing Banner
* **Violation:** Aesthetic & Minimalist Design.
* **Malice:** A pulsating, high-anxiety red banner offering a "0.01% Discount" permanently consumes exactly 25% of the top of the viewport and cannot be closed.

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router)
* **Library:** React (Hooks: `useState`, `useEffect`, `useRef`)
* **Styling:** Tailwind CSS V4
* **Animations:** Framer Motion

## 💻 How to Run Locally

If you are a masochist and want to experience this yourself:

1. Clone the repository
   ```bash
   git clone https://github.com/Revolutionary987/Design-Disaster.git
   ```
2. Navigate to the directory
   ```bash
   cd Design-Disaster
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Suffer! (Start the development server)
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*Created for educational hacking & UX research.*
