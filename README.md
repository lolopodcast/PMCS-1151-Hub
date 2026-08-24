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

## Notes for maintenance

- **The course calendar is derived, not hard-coded.** `W1_DATE` (currently `2026-09-09`, a Wednesday) is the only date in the file; every week, milestone and D-day date is computed from it. Changing that one constant moves the whole calendar. `DDAY_WEEK` is 15.
- The page carries a **passphrase curtain**, not security. The passphrase is hard-coded in front-end JavaScript, so anyone who opens view-source or DevTools can read it. It keeps casual passers-by out of the entry page; it is not a guarantee that the contents stay private, and it must never be reused as a password for any real account. It is the same passphrase as the worksheet index, but each repository remembers it separately, so a student enters it once per site per browser.
- Unlocking is remembered in that browser's `localStorage` under `pmcs_hub_gate`. A different computer, a cleared cache or a private window will ask again.
- The page enforces a **domain lock**: it runs on `lolopodcast.github.io`, `localhost` and `127.0.0.1` only. Serving it from another host shows a notice instead of the content.
- Material URLs are hard-coded, so the repositories behind them must keep their current names. The worksheet links are built from `WS_BASE`, which points at `PMCS-1151`.
- Unlike the teaching units, the root element uses `overflow-x: clip` rather than `hidden`, so the sidebar's `position: sticky` actually engages. `hidden` turns the element into a scroll container and silently breaks sticky.

© Prof. Shihmin Lo. For educational use in this course.
