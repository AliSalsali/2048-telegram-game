# 2048 - Telegram Mini-App

A beautiful, mobile-first implementation of the classic 2048 puzzle game, optimized for Telegram Web Apps.

![2048 Game](https://img.shields.io/badge/Game-2048-brightgreen) ![Telegram](https://img.shields.io/badge/Platform-Telegram-blue) ![Mobile](https://img.shields.io/badge/Design-Mobile--First-orange)

## 🎮 Game Features

- **Classic 2048 Gameplay**: Swipe to move tiles, merge matching numbers
- **Stunning UI**: Modern design with gradient tile colors (2 → 2048)
- **Smooth Animations**: Tile sliding, spawning, and merging effects
- **Mobile-Optimized**: Touch/swipe controls for seamless mobile play
- **Telegram Integration**: Native theme support (Dark/Light mode)
- **Score Tracking**: Best score persistence using localStorage
- **Share Feature**: Share your score and achievements in Telegram

## 🎨 Design

The UI/UX was designed using **Stitch MCP** with a focus on:
- Minimalist, premium aesthetic
- Beautiful color palettes for tiles
- Smooth, satisfying animations
- Mobile-first responsive design

## 🛠️ Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Grid layout, animations, responsive design
- **Vanilla JavaScript**: Game logic and controls
- **Telegram Web App SDK**: Theme integration and sharing

## 🚀 Quick Start

### Running Locally

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser
3. **Test with keyboard** (Arrow keys) or enable mobile device emulation in DevTools

### Testing on Mobile

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone SE)
4. Enable touch simulation
5. Test swipe gestures

## 📱 Deploying to Telegram

### Step 1: Host Your Game

Deploy the files to a public web server:

**Option A: GitHub Pages**
```bash
# Create a new repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/2048-telegram.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch
```

**Option B: Netlify / Vercel**
- Drag and drop the folder to [Netlify](https://app.netlify.com/drop) or [Vercel](https://vercel.com)
- Get your public URL

### Step 2: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the instructions
3. Save your bot token

### Step 3: Add Mini App

1. Send `/newapp` to @BotFather
2. Select your bot
3. Enter app title: `2048 Game`
4. Enter app description: `Classic 2048 puzzle game`
5. Upload a 640x360 photo (screenshot of the game)
6. Upload a GIF demo (optional)
7. **Enter your Web App URL**: `https://yourdomain.com/index.html`
8. **Choose platform**: Web App (for all platforms)

### Step 4: Test

1. Open your bot in Telegram
2. Click the menu button (☰) or send any message
3. Tap "2048 Game" to launch the Mini-App
4. Play and enjoy! 🎮

## 🎯 How to Play

1. **Swipe** (or use arrow keys) to move all tiles
2. **Merge** two tiles with the same number
3. **Reach 2048** to win!
4. **Keep playing** to achieve higher scores

### Controls

- **Mobile**: Swipe in any direction (up, down, left, right)
- **Desktop**: Use arrow keys (↑ ↓ ← →)

## 🎨 Tile Color Scheme

| Value | Color | Hex |
|-------|-------|-----|
| 2 | Soft Cream | `#eee4da` |
| 4 | Light Tan | `#ede0c8` |
| 8 | Warm Orange | `#f2b179` |
| 16 | Bright Orange | `#f59563` |
| 32 | Coral | `#f67c5f` |
| 64 | Red-Orange | `#f65e3b` |
| 128 | Gold | `#edcf72` |
| 256 | Darker Gold | `#edcc61` |
| 512 | Amber | `#edc850` |
| 1024 | Deep Amber | `#edc53f` |
| 2048 | Victory Gold | `#edc22e` |

## 📂 Project Structure

```
2048/
├── index.html       # Main HTML structure
├── style.css        # Styling and animations  
├── game.js          # Core 2048 game logic
├── touch.js         # Touch/swipe controls
├── telegram.js      # Telegram Web App integration
└── README.md        # This file
```

## 🔧 Customization

### Change Grid Size
Edit `game.js`:
```javascript
this.gridSize = 5; // Change from 4 to 5 for a 5x5 grid
```

### Modify Tile Colors
Edit CSS variables in `style.css`:
```css
--tile-2: #your-color;
```

### Adjust Spawn Probability
Edit `game.js` in `spawnTile()`:
```javascript
const value = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
```

## 🌟 Features Explained

### Telegram Theme Integration
The game automatically adapts to your Telegram theme (Light/Dark mode) by:
- Reading `Telegram.WebApp.themeParams`
- Applying colors to CSS variables
- Detecting theme changes in real-time

### localStorage Persistence
Your best score is saved locally and persists across sessions.

### Share Functionality
Uses Telegram's native sharing when available, falls back to Web Share API.

## 🐛 Troubleshooting

**Game not loading in Telegram?**
- Ensure your URL is HTTPS (required by Telegram)
- Check browser console for errors
- Verify Telegram SDK script is loading

**Swipes not working?**
- Make sure you're swiping on the game grid
- Try increasing `minSwipeDistance` in `touch.js`

**Theme colors not applying?**
- This only works inside Telegram Mini-App environment
- Test by deploying to Telegram (won't work in regular browser)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Design**: Generated with Stitch MCP
- **Game Concept**: Original 2048 by Gabriele Cirulli
- **Development**: Built as a Telegram Mini-App

## 🎉 Enjoy!

Have fun playing 2048! Try to beat your high score and share your achievements with friends!

---

Made with ❤️ for Telegram
