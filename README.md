# 🎮 Sync Wars - Multi-Game Arcade
# sync_wars URL: https://sync-wars-munza.netlify.app/

A professional multi-game arcade application built with pure HTML, CSS, and JavaScript. Play 6 classic games in one beautiful app!

## 🎯 Games Included

### 1. 🎲 Ludo
Classic board game for 4 players. Race your tokens around the board and be the first to get all tokens home!
- **Players:** 4 (Red, Green, Yellow, Blue)
- **Tokens:** 4 per player
- **Controls:** Click "Roll Dice", then click movable tokens
- **Goal:** Get all 4 tokens to the center before opponents
- **Features:** 
  - Real Ludo board structure
  - Safe spots (⭐ marked)
  - Capture opponents
  - Extra turn on rolling 6
  - Auto-move when only one option

### 2. ⭕ Tic Tac Toe
Classic X and O game. Get 3 in a row to win!
- **Players:** 2 (X and O)
- **Controls:** Click cells or press 1-9 keys
- **Goal:** Get 3 symbols in a row (horizontal, vertical, or diagonal)
- **Features:**
  - Win detection
  - Draw detection
  - Score tracking
  - Keyboard support

### 3. 🧱 Tetris
The legendary block-stacking puzzle game. Complete lines to score points!
- **Controls:** Arrow Keys (← → to move, ↑ to rotate, ↓ to drop faster)
- **Goal:** Clear lines and survive as long as possible
- **Features:**
  - All 7 tetromino pieces
  - Next piece preview
  - Level system
  - Line clearing
  - Score tracking

### 4. 🧠 Memory
Test your memory by matching card pairs. Find all pairs in minimum moves!
- **Cards:** 16 (8 pairs)
- **Controls:** Click cards to flip
- **Goal:** Match all pairs in minimum moves and time
- **Features:**
  - Move counter
  - Timer
  - Matched pairs display
  - Score based on moves

### 5. 🔢 2048
Merge tiles to reach the legendary 2048! Slide and combine numbers.
- **Grid:** 4x4
- **Controls:** Arrow Keys to slide tiles
- **Goal:** Merge tiles to reach 2048
- **Features:**
  - Score tracking
  - Best score saved
  - Smooth animations
  - Game over detection

### 6. 🏓 Brick Breaker
Break all bricks using a ball and paddle. Classic arcade action!
- **Controls:** Mouse or Arrow Keys to move paddle
- **Goal:** Break all bricks without losing all lives
- **Features:**
  - Multiple levels
  - Lives system
  - Score tracking
  - Ball physics

## ✨ Features

### 🎨 Professional UI
- Beautiful gradient backgrounds
- Glassmorphism design
- Smooth animations
- Neon glow effects
- Responsive layout

### 🏆 Score System
- Real-time score tracking
- High score saving (per game)
- Global leaderboard
- New high score celebrations

### 🎮 Game Controls
- Pause/Resume functionality
- Restart game button
- Sound toggle (on/off)
- Mobile controls (D-Pad for some games)
- Back to menu button

### 🌓 Theme Support
- Dark mode (default)
- Light mode option
- Smooth transitions
- Persistent theme preference

### 💾 Data Persistence
- High scores saved locally
- Leaderboard history
- Theme preference saved
- No account needed
- All data stored in browser

### 📱 Responsive Design
- Desktop optimized
- Mobile friendly
- Touch controls support
- Adaptive layout

---

## 🎮 How to Play Each Game

### Main Menu Navigation
1. **Select Game:** Click on any game card
2. **View High Score:** See top scores on each card
3. **Leaderboard:** Click trophy icon for rankings
4. **Theme:** Toggle dark/light mode (top right)

### During Game
1. **Start:** Click "Start Game" button
2. **Play:** Use keyboard or touch controls
3. **Pause:** Click pause button
4. **Restart:** Click restart button
5. **Quit:** Click "Back to Menu"

### Controls Summary

| Game | Controls |
|------|----------|
| Ludo | Click "Roll Dice", then click tokens |
| Tic Tac Toe | Click cells or press 1-9 |
| Tetris | Arrow Keys (↑ rotate) |
| Memory | Click cards |
| 2048 | Arrow Keys |
| Brick Breaker | Mouse or Arrow Keys |

## 🏆 Scoring System

### Ludo
- +100 points per token reached home
- +50 points per capture
- +1000 points for winning

### Tic Tac Toe
- +100 points per win
- Cumulative wins tracked

### Tetris
- 100 points × level (1 line)
- 300 points × level (2 lines)
- 500 points × level (3 lines)
- 800 points × level (4 lines)

### Memory
- Base: 1000 points
- -10 points per move
- Faster = Higher score!

### 2048
- Points for merging tiles
- 2+2=4 → +4 points
- Higher merges = more points

### Brick Breaker
- +10 points per brick
- Bonus for level completion

## 💡 Tips & Tricks

### Ludo
- Get tokens out with 6
- Use safe spots strategically
- Capture opponents when possible
- Plan multiple moves ahead

### Tic Tac Toe
- Start in corners
- Block opponent's lines
- Create forks (two winning options)

### Tetris
- Keep the center open
- Plan rotations ahead
- Clear multiple lines for bonus points

### Memory
- Start from corners
- Remember positions
- Focus on patterns

### 2048
- Keep highest tile in corner
- Don't swipe randomly
- Plan merges ahead

### Brick Breaker
- Angle your shots
- Protect your paddle
- Target weak points

## 🌐 Deployment

### Deploy to Netlify (Easiest)

#### Method 1: Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag entire `sync-wars` folder to upload area
4. Get live URL instantly!

#### Method 2: From GitHub
1. Push code to GitHub
2. In Netlify: "New site from Git"
3. Select your repository
4. Deploy!

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch: `main`
4. Save
5. Get URL: `https://YOUR_USERNAME.github.io/sync-wars/`

## 🔧 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

**Mobile Support:**
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Touch controls enabled

## 🛠️ Troubleshooting

**Game not starting?**
- Refresh the page (Ctrl+F5)
- Clear browser cache
- Try a different browser

**Controls not working?**
- Click on game area first
- Check if game is started
- Ensure not paused

**Sound not playing?**
- Check sound toggle button
- Browser may require interaction first

**Theme not changing?**
- Check browser console for errors
- Clear cache and refresh

**High scores not saving?**
- Check if localStorage is enabled
- Try a different browser

## 🎯 Achievements (Self-Tracking)

Try to reach these milestones:

### Ludo
- 🥉 Win 1 game
- 🥈 Win 5 games
- 🥇 Win 10 games

### Tic Tac Toe
- 🥉 5 wins
- 🥈 20 wins
- 🥇 50 wins

### Tetris
- 🥉 10 lines cleared
- 🥈 50 lines cleared
- 🥇 100 lines cleared

### Memory
- 🥉 Complete in 20 moves
- 🥈 Complete in 15 moves
- 🥇 Complete in 10 moves

### 2048
- 🥉 Reach 512 tile
- 🥈 Reach 1024 tile
- 🥇 Reach 2048 tile

### Brick Breaker
- 🥉 Clear 50 bricks
- 🥈 Clear 200 bricks
- 🥇 Clear 500 bricks

## 🔐 Privacy

- All data stored locally in browser
- No server connection required
- No data collection
- No ads
- No tracking
- 100% offline capable

## 📚 Learning

This project demonstrates:
- Vanilla JavaScript
- Canvas API
- Game loops with requestAnimationFrame
- Collision detection
- State management
- Local Storage API
- Event handling
- Responsive CSS
- CSS Grid & Flexbox
- CSS animations
- Touch events
- DOM manipulation

## 🙏 Credits

- Classic games reimagined
- Modern UI/UX design
- Built with vanilla JavaScript
- No external game libraries
- Icons: Font Awesome

## 📄 License

Free to use for personal and commercial projects!

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit improvements
- Share with friends

## 📞 Support

If you encounter any issues:
1. Check Troubleshooting section
2. Clear browser cache
3. Try different browser
4. Check browser console for errors

---

**🎮 Sync Wars - Play, Compete, Win! 🏆**

Challenge yourself, beat high scores, and enjoy classic gaming!

Made with ❤️ using HTML, CSS, and JavaScript
