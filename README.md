# PMCS-1151-Hub · Course Hub 課程總入口

The course hub for **PMCS (EMI)** — *Introduction to Project Management and Career Strategy as a Product Manager in the AI Era* — semester 1151, Prof. Shihmin Lo, Department of International Business Studies, National Chi Nan University.

**Live:** https://lolopodcast.github.io/PMCS-1151-Hub/

One self-contained HTML file. React, Tailwind and DOMPurify load from pinned CDN versions; there is no build step.

## What is on the page

| Section | Contents |
|---|---|
| Overview | Where the course stands today, the D-day countdown, the four milestone dates, the shape of the course, and shortcuts |
| Weekly Materials | All eighteen weeks — focus, before/after-class work, every required and optional item, and the worksheet link |
| Term Project | The nine-item W9 specification, the five team roles, the three levels of depth, the runtime architecture, and the D-day table |
| Assessment | Grade weights, how worksheets are submitted, and the five acceptance items at W16 |
| Ethics | The seven AI-use and data-ethics statements from the syllabus, and the Full Safety Gate |
| All Resources | The six teaching units, the twelve worksheets, and the reference library |

(*SDL Partner* sits between Weekly Materials and Term Project: what the SDL learning partner is, four install steps, per-platform instructions for Claude, ChatGPT and Gemini, and what to check when it does not respond.)

## Installable (PWA)

The hub installs to a phone home screen or a desktop dock: `manifest.webmanifest` plus `sw.js`, four PNG icons and the meta tags in `<head>`. `start_url` and `scope` are relative (`./`) so it works from the `/PMCS-1151-Hub/` sub-path.

The service worker is **network-first for same-origin requests** and cache-first only for the whitelisted CDN hosts. That ordering is deliberate: the commonest PWA failure is a student pinned to a stale cached page after you redeploy. Here a new deploy is picked up the moment they are online; the cache only serves them when the network does not answer. A new `VERSION` string in `sw.js` drops every older cache, and an updated worker calls `skipWaiting` then reloads the page once.

Registration is skipped on any host other than `lolopodcast.github.io`, `localhost` and `127.0.0.1`, and a failed registration is swallowed — the page works exactly the same without it.

## Notes for maintenance

- **Read-aloud survives Chrome's speech-synthesis quirks.** Three defences, all in `handleTTS`: a strong reference to the live utterance (a garbage-collected one never fires `onend`); a keep-alive that pause/resumes every eight seconds (Chrome goes silent after ~15s otherwise); and a watchdog that returns the button to Play when the engine reports it is neither speaking, pending nor paused for 2.4 seconds. Every teardown calls `resume()` *before* `cancel()` — cancelling while paused leaves the engine stuck in a paused state, after which every later `speak()` queues silently and the page appears dead. The watchdog only uses the fast 2.4s rule once an `onstart` has actually fired; otherwise it falls back to 24 seconds.
- **The three-maps card is collapsed by default** (`<details>`, state in `localStorage` under `pmcs_hub_maps`). It is reference material, not something to scroll past every visit — particularly on a phone. The summary keeps a one-line peek so it is still obvious what is inside, and read-aloud covers the card only while it is open, so what is heard matches what is shown.
- **The three maps are numbered in the order they appear.** Map 1 = T1 AIWE (W3), Map 2 = T2 AGEN (W4), Map 3 = T3 IPOB (W5) — the numbering matches the teaching-unit codes and the week each one is first taught. `MAPS` is the single source; the week titles carry the number in brackets.
- **The three maps are defined before they are referenced.** Weeks 3–5 and 10–12 talk about "Map 1", "Map 2" and "Map 3" — the instructor's classroom shorthand. A card at the top of *Weekly Materials* (`MAPS`) names all three, says what each one answers, lists the weeks it appears in and links to its teaching unit; read-aloud covers it too. Second-pass week titles lead with the substance and carry the map number in brackets, not the other way round.
- **The block strip fits on a desktop and scrolls on a phone.** The chips carry the block's *short* name (`s_zh` / `s_en` in `BLOCKS`) — the full name is the `title` tooltip, and it still appears in full on every week card and in the overview's course map. That keeps the row to about 610px, so it fits whole at 1024px and above with no scrolling at all. Below that, arrow buttons appear at whichever end still has content, the mouse wheel is translated to horizontal scroll (a native non-passive listener — React's `onWheel` is passive at the root, so `preventDefault` there does nothing), and once the row hits its end the wheel is handed back to the page.
- **The block strip follows the narration.** In *Weekly Materials*, read-aloud tags every spoken chunk with the week it belongs to. The strip is sticky under the header, so it stays in view; the matching block chip is ringed with a pulsing dot and the strip scrolls itself so that chip sits in the middle, while the page scrolls vertically to bring the week being read just under the strip. The strip is a single horizontal scroll row (scrollbar hidden) at every width, which is what makes centring possible on a phone.
- **Read-aloud honours the block filter.** Filter to one block and only those weeks are read, starting from the block's own name rather than the section heading. Changing the filter while it is speaking stops playback, so what is heard never disagrees with what is shown.
- **Sections are addressed by string id** (`'ov' 'wk' 'sdl' 'tp' 'as' 'et' 'rs'`), not by array index. Inserting a section used to mean renumbering every branch in `handleTTS`, `renderBody` and the quick links; now it does not.
- **D day is marked with a left accent, not a full outline.** A four-sided ring on the W15 card reads as "selected" in dark mode; `border-l-4` marks it as special without that.
- **The course calendar is derived, not hard-coded.** `W1_DATE` (currently `2026-09-09`, a Wednesday) is the only date in the file; every week, milestone and D-day date is computed from it. Changing that one constant moves the whole calendar. `DDAY_WEEK` is 15.
- The page carries a **passphrase curtain**, not security. The passphrase is hard-coded in front-end JavaScript, so anyone who opens view-source or DevTools can read it. It keeps casual passers-by out of the entry page; it is not a guarantee that the contents stay private, and it must never be reused as a password for any real account. It is the same passphrase as the worksheet index, but each repository remembers it separately, so a student enters it once per site per browser.
- Unlocking is remembered in that browser's `localStorage` under `pmcs_hub_gate`. A different computer, a cleared cache or a private window will ask again.
- The page enforces a **domain lock**: it runs on `lolopodcast.github.io`, `localhost` and `127.0.0.1` only. Serving it from another host shows a notice instead of the content.
- Material URLs are hard-coded, so the repositories behind them must keep their current names. The worksheet links are built from `WS_BASE`, which points at `PMCS-1151`.
- Unlike the teaching units, the root element uses `overflow-x: clip` rather than `hidden`, so the sidebar's `position: sticky` actually engages. `hidden` turns the element into a scroll container and silently breaks sticky.

© Prof. Shihmin Lo. For educational use in this course.
