# The Walk Home

A self-contained HTML5 Canvas arcade game for an entrepreneurial finance class. Fictional college-town setting; no official university branding or external art assets.

## Play locally

Open this folder in VS Code. Right-click `index.html` and choose **Open with Live Server**, or simply double-click `index.html` to open it in a modern browser. No install or build step is needed. Keep `index.html`, `style.css`, and `game.js` together.

## Controls and rules

- A/D or left/right arrow keys: move. On phones, hold the left/right buttons.
- P, Escape, or the pause button: pause/resume. Switching tabs pauses automatically.
- Avoid obstacles; three hits end a run. After a hit, 1.6 seconds of protection prevents instant repeated damage.
- Distance increases with survival time. Every 120 meters adds a level. Scrolling starts at 220 px/sec, rises by 40 per level, and caps at 520. Obstacles arrive more frequently as levels rise.
- Students run across from level 2. An amber runner and directional warning give 0.85 seconds of notice before they move. Only one crosses at a time.
- Mild steering drift starts at level 3. Occasional 1.2-second blur pulses start later, with 8–12 seconds between pulses. Blur never starts during a crossing or hit recovery.
- The “Sway + blur” switch disables both visual effects; reduced-motion preferences disable them initially. Score and controls remain sharp. Steering drift stays active.
- Best distance is saved on this browser using localStorage. It is not a shared leaderboard.
- This is an endless survival game: “Almost Home” is a joke checkpoint, not a finish line.

## Files and ownership

`index.html` contains the interface, `style.css` the page layout, and `game.js` the rules, input, original artwork, and animation loop. `BUILD_LOG.md` records actual work. `USER_TEST.md` is an unfilled human-test worksheet; `DEMO.md` outlines the classroom demo.

The game was generated with Codex from the student's detailed specification. The student must review it, test it with an unfamiliar person, make and verify a meaningful revision, and be able to explain the key code. Do not represent automated checks as a human usability test.

## Publication status

Repository: https://github.com/charliekas24-bit/the-walk-home

Play online: https://charliekas24-bit.github.io/the-walk-home/

GitHub Pages serves the standalone files from the root of the `main` branch. See BUILD_LOG.md for verification and submission notes.
