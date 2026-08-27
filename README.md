# The Walk Home

A self-contained HTML5 Canvas arcade game for an entrepreneurial finance class. Fictional college-town setting; no official university branding or external art assets.

## Play locally

Open this folder in VS Code. Right-click `index.html` and choose **Open with Live Server**, or simply double-click `index.html` to open it in a modern browser. No install or build step is needed. Keep `index.html`, `style.css`, and `game.js` together.

## Controls and rules

- A/D or left/right arrow keys: move. On phones, hold the left/right buttons.
- P, Escape, or the pause button: pause/resume. Switching tabs pauses automatically.
- Avoid obstacles; three hits end a run. After a hit, 1.6 seconds of protection prevents instant repeated damage.
- Distance increases with survival time. Every 200 meters adds a level. Speed and spawn frequency rise, then cap.
- Mild steering drift starts at level 3. Sway can be disabled; reduced-motion preferences disable it initially.
- Best distance is saved on this browser using localStorage. It is not a shared leaderboard.
- This is an endless survival game: “Almost Home” is a joke checkpoint, not a finish line.

## Files and ownership

`index.html` contains the interface, `style.css` the page layout, and `game.js` the rules, input, original artwork, and animation loop. `BUILD_LOG.md` records actual work. `USER_TEST.md` is an unfilled human-test worksheet; `DEMO.md` outlines the classroom demo.

The game was generated with Codex from the student's detailed specification. The student must review it, test it with an unfamiliar person, make and verify a meaningful revision, and be able to explain the key code. Do not represent automated checks as a human usability test.

## Publication status

Repository: https://github.com/charliekas24-bit/the-walk-home

GitHub Pages publication is being configured. See BUILD_LOG.md for verification and submission notes.
