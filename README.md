# PROJECT LMXXX — Riddle Game

A 6-screen mobile-first riddle game: password gate → transmission → 3 riddles → final code reveal.

## Files
- `index.html` — the page structure (all 6 screens)
- `style.css` — the 8-bit terminal look
- `script.js` — the game logic (password check, riddle checks, animations)

## How to test it on your own computer (optional)
Just double-click `index.html` — it opens in your browser and works immediately. No install needed.

## How to put it on Vercel (no coding required)

**Option A — Easiest: drag-and-drop deploy with the Vercel CLI**
1. Install [Node.js](https://nodejs.org) if you don't have it (just click through the installer).
2. Open your computer's Terminal (Mac) or Command Prompt (Windows).
3. Type this and press Enter — it installs Vercel's tool:
   `npm install -g vercel`
4. Navigate into this folder, e.g.:
   `cd path/to/riddle-game`
5. Type:
   `vercel`
6. It will ask you to log in (opens your browser, sign up free with GitHub/Google/email) and ask a few questions — press Enter to accept the defaults each time.
7. When it finishes, it gives you a live link like `https://riddle-game-xxxx.vercel.app` — that's your game, live.
8. To make that link permanent/production (not just a preview), type:
   `vercel --prod`

**Option B — Via GitHub (if you'd rather use Vercel's website)**
1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository, and upload these 3 files (`index.html`, `style.css`, `script.js`) using GitHub's "Add file → Upload files" button in the browser — no Git commands needed.
3. Go to [vercel.com](https://vercel.com), sign up (you can use your GitHub account), click "Add New → Project", pick your repository, and click "Deploy". Leave all settings as default — Vercel auto-detects this as a static site.
4. In under a minute you'll get your live link.

## The game logic, in plain terms
- **Password:** `2823`
- **Riddle #01 answer:** `4`
- **Riddle #02 answer:** `5`
- **Riddle #03 answer:** `3`
- **Final code revealed:** `453`

If you ever want to change any of these, tell me and I'll update the file for you — you won't need to touch the code yourself.
