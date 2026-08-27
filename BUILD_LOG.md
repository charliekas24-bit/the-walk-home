# The Walk Home — build log

## 2026-08-27 · Specification and scope

- Student supplied the detailed game brief and course rubric. Required delivery: public URL, source, concise build log, unfamiliar-user test note, live demo/reflection.
- Chosen scope: an endless top-down runner, three lives, keyboard and touch steering, nine obstacle types, increasing difficulty, mild drift, no external game dependencies or official university graphics.
- Agent assistance: Codex generated the implementation and documentation. Student verification and reflection remain pending.

## 2026-08-27 · First playable version

- Implemented ready → playing → game over → replay states, pause/resume, elapsed-time movement, obstacle spawning, bounding-box collision checks, distance, levels, and localStorage best distance.
- Important parameters: 300 px/sec steering, 180–390 px/sec scrolling, level every 200 m, 1.6-second post-hit protection, drift capped at 24 px/sec.
- Fairness decisions: one obstacle per spawn row; smaller collision boxes than visible art; clamped street boundaries; capped frame delta avoids large jumps after delays.

## 2026-08-27 · Visual and usability pass

- Added original Canvas brick buildings, glowing streetlights, crosswalks, trees, storefronts, student sprites, scooter/car/cone/barrier art, hit particles, and themed checkpoints/messages.
- Added a scarlet/charcoal arcade page, visible control instructions, responsive layout, touch controls, reduced-motion setting, and keyboard focus styles.
- Added auto-pause on focus loss and tab hiding to prevent unfair off-screen losses. This is an agent-proposed safeguard, not a claimed user-test finding.

## 2026-08-27 · Verification and publishing

- JavaScript syntax check passed with Node.
- Local HTTP server returned 200 for the game page.
- The hosting wrapper compiled successfully; the local VS Code game remains standalone and has no framework dependency.
- Automated logic checks passed: movement, boundary clamp, levels, collision damage, grace period, game over, persistence, reset, pause/resume, speed cap, spawn bounds, and blocked storage writes. These use a mocked DOM, not browser interaction.
- A further 10-minute simulated run with restarts and all obstacle draw paths passed using mock Canvas calls. Blocked-storage startup also passed. This checks code paths, not visual appearance.
- Initial GitHub connection exposed no repositories. With the student's explicit approval, created the public repository `charliekas24-bit/the-walk-home` through the signed-in GitHub website. Uploaded the standalone game, build log, and submission worksheets to `main`.
- Enabled GitHub Pages from `main` / root with HTTPS. Public game: https://charliekas24-bit.github.io/the-walk-home/ . The public page loaded successfully and displayed the game's start screen without a login prompt.
- Live-browser smoke check: clicked START, observed distance increasing, and found no captured browser-console errors. Automated game-rule checks were rerun successfully before publication.
- No unfamiliar-user test, signed-out browser test, or physical second-device test has been completed. Do not claim those until observed.

## Next: student verification and revision

1. Read the code and explain input, collision, scoring, and restart.
2. Run the silent unfamiliar-user test in USER_TEST.md.
3. Record one concrete friction point, change, and retest result here.
4. Verify the public URL signed out and on a second device.
5. Add the GitHub repository and public URL to the submission.
