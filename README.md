# BallistickEMU

A Stick Arena Ballistick v558 emulator written in Node.js

Credits: **Zaseth**, **ADagen**, **KevinGuest**

Ruffle support has been added so `game.swf` can run in the browser without Flash Player.

# Modifications

- [Web] Replaced the Flash embed with Ruffle in `htdocs/index.html`
- [Web] Added a local web server — run `npm run web` and open http://127.0.0.1:8080/
- [Proxy] Added a socket proxy so Ruffle can talk to the game server — run `npm run proxy`
- [SWF] Removed `Protect` tag
- [SWF] Removed `Unknown` tag
- [SWF] Moved every URL to `http://127.0.0.1/`
- [SWF] Fixed `apiURL` to `http://api.localhost/?`

# Setup

1. Install **Node.js** and **MySQL**
2. Run `npm install` in the project folder
3. Start MySQL and import `ballistickemu.sql`
4. Change `config/database.js` if your MySQL user or password is not `root` / blank
5. Put your modified `game.swf` in `htdocs/`
6. Add `127.0.0.1 api.localhost` to your hosts file (needed for login)
7. Use **Apache/XAMPP** to serve `htdocs/` with PHP, or use `npm run web` for quick testing
8. Open **3 terminals** and run:
   - `npm start` — game server
   - `npm run proxy` — socket proxy for Ruffle
   - `npm run web` — local site (skip if using Apache)
9. Open http://127.0.0.1:8080/ in your browser

# Copyright

I take no rights for the actual Flash media.
