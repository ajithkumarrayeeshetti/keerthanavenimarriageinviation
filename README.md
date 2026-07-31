# Ananya & Arjun — Wedding Invitation Website

A complete, production-ready multi-page Indian wedding invitation site built with
React 19 + TypeScript + Vite + Tailwind CSS + react-router-dom (HashRouter).

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

The static output lands in `dist/` — deploy that folder anywhere that serves
static files.

## Personalize the content

**Everything you need to change lives in one file: `src/weddingConfig.ts`.**
Edit the couple's names, wedding date, venue, hosts, phone numbers, the event
schedule, and image paths there. The date field (`weddingDateISO`) drives the
live countdown, so keep it in ISO format (`YYYY-MM-DDTHH:mm:ss`).

Bilingual (English/Hindi) copy for UI labels — nav links, section headings,
form labels — lives in `src/context/LanguageContext.tsx` under `translations`.
Add more languages by adding another key (e.g. `gu` for Gujarati) to that
object and to the `Lang` type.

### Images

Drop your real photos into `public/images/`, matching the filenames already
referenced in `weddingConfig.ts`:

- `hero.jpg` — hero background + framed photo on the Home page
- `story1.jpg` … `story4.jpg` — Our Story milestone photos
- `gallery1.jpg` … `gallery6.jpg` — Gallery grid (add more entries to the
  `gallery` array in `weddingConfig.ts` if you have more photos)

Placeholder images are included so the site runs out of the box — swap them
for the real thing before sharing the link.

### RSVP wiring

The RSVP form supports three modes, set via `weddingConfig.rsvpMode`:

- `"confirmation"` (default) — no backend; just shows a thank-you screen.
  Nothing is stored. Good for previewing the site.
- `"mailto"` — opens the guest's email client with a pre-filled RSVP draft.
- `"formspree"` — POSTs to a Formspree (or compatible) endpoint so responses
  land in your inbox. Set `weddingConfig.formspreeEndpoint` to your form URL.

See the comments directly above `handleSubmit` in `src/pages/RSVP.tsx`.

### Wishes / blessings wall

`src/pages/Wishes.tsx` keeps guest messages in React state only (resets on
refresh) — see the comment block at the top of that file for how to wire it
to Firebase, Supabase, or another datastore for real persistence.

### Google Map

The venue map on the Home page is a key-free `<iframe>` embed built from
`weddingConfig.venue.addressEn`. The "Get Directions" button links out to
Google Maps using the same address — no API key needed, but for pinpoint
accuracy you can swap the query for exact lat/lng coordinates.

## Deploying

**Vercel**
```bash
npm i -g vercel
vercel
```
Framework preset: Vite. Output directory: `dist`.

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```
Or connect the repo in the Netlify dashboard with build command `npm run
build` and publish directory `dist`.

## Project structure

```
src/
  components/   Navbar, Footer, DoorIntro, Countdown
  context/      LanguageContext (EN/HI toggle + translations)
  pages/        Home, Story, Events, Gallery, RSVP, Wishes
  utils/        share.ts (Web Share API + WhatsApp fallback)
  weddingConfig.ts   ← all personalization variables
public/images/  drop real photos here
```

## Notes on the design

- Palette: deep maroon `#7A1930`, antique gold `#C9A24B`, ivory `#FBF7EF`.
- Type: Cormorant Garamond (display), Poppins (body), Noto Serif Devanagari
  (Hindi script).
- The opening-doors intro (`components/DoorIntro.tsx`) is dependency-free —
  pure React state + CSS transitions, no animation library. It plays once
  per page load (component state, not browser storage) and never replays on
  in-app navigation.
