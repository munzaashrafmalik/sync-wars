// ===== Sync Wars - All Games Working =====

// Game State
const gameState = {
    currentGame: null,
    isPlaying: false,
    isPaused: false,
    score: 0,
    highScores: JSON.parse(localStorage.getItem('syncwarsScores') || '{}'),
    soundEnabled: true
};

// Audio
let audioCtx = null;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!gameState.soundEnabled || !audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;
        if (type === 'start') {
            osc.frequency.value = 440;
            gain.gain.value = 0.1;
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'score') {
            osc.frequency.value = 880;
            gain.gain.value = 0.1;
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'gameover') {
            osc.frequency.value = 220;
            gain.gain.value = 0.2;
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'match') {
            osc.frequency.value = 660;
            gain.gain.value = 0.1;
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch(e) {}
}

// Storage
function saveScore(game, score) {
    const current = gameState.highScores[game] || 0;
    if (score > current) {
        gameState.highScores[game] = score;
        localStorage.setItem('syncwarsScores', JSON.stringify(gameState.highScores));
        return true;
    }
    return false;
}

function updateHighScores() {
    ['ludo', 'tictactoe', 'tetris', 'memory', '2048', 'brick'].forEach(game => {
        const el = document.getElementById(`${game}HighScore`);
        if (el) el.textContent = gameState.highScores[game] || 0;
    });
}

// Clear loops
let gameLoop = null;
let gameInterval = null;
function clearLoops() {
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (gameInterval) clearInterval(gameInterval);
    gameLoop = null;
    gameInterval = null;
}

// DOM helpers
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    updateHighScores();
    setupGameCards();
    setupControls();
    loadTheme();
});

function setupGameCards() {
    $$('.game-card').forEach(card => {
        card.onclick = () => selectGame(card.dataset.game);
    });
}

function setupControls() {
    // Theme toggle
    const themeBtn = $('themeToggle');
    if (themeBtn) themeBtn.onclick = toggleTheme;
    
    // Back button
    const backBtn = $('backBtn');
    if (backBtn) backBtn.onclick = backToMenu;
    
    // Restart button
    const restartBtn = $('restartBtn');
    if (restartBtn) restartBtn.onclick = restartGame;
    
    // Pause button
    const pauseBtn = $('pauseBtn');
    if (pauseBtn) pauseBtn.onclick = togglePause;
    
    // Sound toggle
    const soundBtn = $('soundToggle');
    if (soundBtn) soundBtn.onclick = () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        soundBtn.innerHTML = gameState.soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    };
    
    // Game over buttons
    const playAgainBtn = $('playAgainBtn');
    if (playAgainBtn) playAgainBtn.onclick = restartGame;
    
    const menuBtn = $('menuBtn');
    if (menuBtn) menuBtn.onclick = backToMenu;
    
    // Leaderboard
    const leaderboardBtn = $('leaderboardBtn');
    if (leaderboardBtn) leaderboardBtn.onclick = () => openLeaderboard();
    
    const leaderboardClose = $('leaderboardClose');
    if (leaderboardClose) leaderboardClose.onclick = () => closeLeaderboard();
    
    // Leaderboard tabs
    $$('.tab-btn').forEach(btn => {
        btn.onclick = () => showLeaderboardTab(btn.dataset.game);
    });
    
    // Modal overlays
    $$('.modal-overlay').forEach(overlay => {
        overlay.onclick = (e) => {
            e.target.closest('.modal').classList.remove('active');
        };
    });
    
    // Game start buttons
    const startBtns = {
        'startLudo': () => { $('ludoOverlay').style.display = 'none'; ludo.start(); },
        'startTicTacToe': () => { $('tictactoeOverlay').style.display = 'none'; tictactoe.start(); },
        'startTetris': () => { $('tetrisOverlay').style.display = 'none'; tetris.start(); },
        'startMemory': () => { $('memoryOverlay').style.display = 'none'; memory.start(); },
        'start2048': () => { $('game2048Overlay').style.display = 'none'; game2048.start(); },
        'startBrick': () => { $('brickOverlay').style.display = 'none'; brick.start(); }
    };
    
    Object.keys(startBtns).forEach(id => {
        const btn = $(id);
        if (btn) btn.onclick = startBtns[id];
    });
    
    // Keyboard
    document.addEventListener('keydown', handleKey);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('syncwarsTheme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    const themeBtn = $('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('syncwarsTheme', newTheme);
    
    const themeBtn = $('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    console.log('Theme changed to:', newTheme);
}

function selectGame(game) {
    clearLoops();
    gameState.currentGame = game;
    gameState.score = 0;
    gameState.isPlaying = false;
    
    $('mainMenu').style.display = 'none';
    $('gameWrapper').style.display = 'flex';
    
    $$('.game-canvas').forEach(el => el.style.display = 'none');
    const gameId = game === '2048' ? 'game2048' : `${game}Game`;
    const gameEl = $(gameId);
    if (gameEl) gameEl.style.display = 'block';
    
    const titles = {
        ludo: '🎲 Ludo', tictactoe: '⭕ Tic Tac Toe', tetris: '🧱 Tetris',
        memory: '🧠 Memory', '2048': '🔢 2048', brick: '🏓 Brick Breaker'
    };
    $('currentGameTitle').textContent = titles[game] || game;
    $('currentScore').textContent = '0';
    
    $$('.game-overlay').forEach(el => el.style.display = 'none');
    const overlayId = game === '2048' ? 'game2048Overlay' : `${game}Overlay`;
    const overlay = $(overlayId);
    if (overlay) overlay.style.display = 'flex';
}

function backToMenu() {
    clearLoops();
    $('gameWrapper').style.display = 'none';
    $('mainMenu').style.display = 'block';
    updateHighScores();
    gameState.currentGame = null;
}

function restartGame() {
    clearLoops();
    $('gameOverModal').classList.remove('active');
    const game = gameState.currentGame;
    if (game) {
        const overlayId = game === '2048' ? 'game2048Overlay' : `${game}Overlay`;
        $(overlayId).style.display = 'flex';
    }
}

function togglePause() {
    if (!gameState.isPlaying) return;
    gameState.isPaused = !gameState.isPaused;
    $('pauseBtn').innerHTML = gameState.isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

function handleKey(e) {
    if (!gameState.isPlaying || gameState.isPaused) return;
    const handlers = {
        tetris: () => tetris.input(e),
        '2048': () => game2048.input(e),
        brick: () => brick.input(e),
        tictactoe: () => tictactoe.input(e)
    };
    if (handlers[gameState.currentGame]) handlers[gameState.currentGame]();
}

function showGameOver(score) {
    clearLoops();
    gameState.isPlaying = false;
    playSound('gameover');
    $('finalScore').textContent = score || gameState.score;
    const isNew = saveScore(gameState.currentGame, score || gameState.score);
    $('highscoreCheck').style.display = isNew ? 'flex' : 'none';
    $('gameOverModal').classList.add('active');
}

// ===== Leaderboard Functions =====
function openLeaderboard() {
    const modal = $('leaderboardModal');
    if (modal) {
        modal.classList.add('active');
        showLeaderboardTab('all');
    }
}

function closeLeaderboard() {
    const modal = $('leaderboardModal');
    if (modal) modal.classList.remove('active');
}

function showLeaderboardTab(filter) {
    // Update active tab
    $$('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.game === filter);
    });
    
    // Get leaderboard data
    const leaderboard = JSON.parse(localStorage.getItem('syncwarsLeaderboard') || '[]');
    const list = $('leaderboardList');
    if (!list) return;
    
    // Filter
    let filtered = filter === 'all' ? leaderboard : leaderboard.filter(e => e.game === filter);
    
    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state" style="padding: 40px; text-align: center; color: var(--text-secondary);"><p>No scores yet. Be the first!</p></div>';
        return;
    }
    
    // Sort by score
    filtered.sort((a, b) => b.score - a.score);
    
    // Show top 10
    list.innerHTML = filtered.slice(0, 10).map((entry, i) => {
        const icons = { ludo: '🎲', tictactoe: '⭕', tetris: '🧱', memory: '🧠', '2048': '🔢', brick: '🏓' };
        return `
            <div class="leaderboard-entry">
                <span class="leaderboard-rank">#${i + 1}</span>
                <div class="leaderboard-info">
                    <div class="leaderboard-game">${icons[entry.game] || '🎮'} ${entry.game}</div>
                    <div class="leaderboard-date">${entry.date}</div>
                </div>
                <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
            </div>
        `;
    }).join('');
}

// Save to leaderboard
function saveToLeaderboard(game, score) {
    try {
        const leaderboard = JSON.parse(localStorage.getItem('syncwarsLeaderboard') || '[]');
        leaderboard.push({
            game,
            score,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('syncwarsLeaderboard', JSON.stringify(leaderboard.slice(0, 50)));
    } catch(e) {}
}

// Override saveScore to also save to leaderboard
const originalSaveScore = saveScore;
saveScore = function(game, score) {
    const result = originalSaveScore(game, score);
    if (result) saveToLeaderboard(game, score);
    return result;
};

// ============================================
// 🎲 LUDO
// ============================================
const ludo = {
    players: ['red', 'green', 'yellow', 'blue'],
    playerIdx: 0,
    dice: 0,
    hasRolled: false,
    waiting: false,
    tokens: { red: [-1,-1,-1,-1], green: [-1,-1,-1,-1], yellow: [-1,-1,-1,-1], blue: [-1,-1,-1,-1] },
    safe: [0, 8, 13, 16, 21, 24, 29, 32, 37, 40, 45, 48],
    starts: { red: 0, green: 13, yellow: 26, blue: 39 },
    path: [
        {r:6,c:1},{r:6,c:2},{r:6,c:3},{r:6,c:4},{r:6,c:5},{r:5,c:6},{r:4,c:6},{r:3,c:6},{r:2,c:6},{r:1,c:6},{r:0,c:6},
        {r:0,c:7},{r:0,c:8},{r:1,c:8},{r:2,c:8},{r:3,c:8},{r:4,c:8},{r:5,c:8},{r:6,c:9},{r:6,c:10},{r:6,c:11},
        {r:6,c:12},{r:6,c:13},{r:6,c:14},{r:7,c:14},{r:8,c:14},{r:8,c:13},{r:8,c:12},{r:8,c:11},{r:8,c:10},{r:8,c:9},
        {r:9,c:8},{r:10,c:8},{r:11,c:8},{r:12,c:8},{r:13,c:8},{r:14,c:8},{r:14,c:7},{r:14,c:6},{r:13,c:6},{r:12,c:6},
        {r:11,c:6},{r:10,c:6},{r:9,c:6},{r:8,c:5},{r:8,c:4},{r:8,c:3},{r:8,c:2},{r:8,c:1},{r:8,c:0},{r:7,c:0},{r:6,c:0}
    ],
    
    start() {
        this.playerIdx = 0;
        this.dice = 0;
        this.hasRolled = false;
        this.waiting = false;
        this.tokens = { red: [-1,-1,-1,-1], green: [-1,-1,-1,-1], yellow: [-1,-1,-1,-1], blue: [-1,-1,-1,-1] };
        gameState.score = 0;
        gameState.isPlaying = true;
        playSound('start');
        this.createBoard();
        this.updateTurn();
        this.renderTokens();
        $('rollDice').onclick = () => this.roll();
    },
    
    createBoard() {
        const board = $('ludoBoard');
        board.querySelectorAll('.ludo-cell').forEach(el => {
            if (!el.classList.contains('ludo-home') && !el.classList.contains('ludo-center')) el.remove();
        });
        
        this.path.forEach((p, i) => {
            const cell = document.createElement('div');
            cell.className = 'ludo-cell';
            cell.style.gridRow = p.r + 1;
            cell.style.gridColumn = p.c + 1;
            if (i === 0) cell.classList.add('red');
            if (i === 13) cell.classList.add('green');
            if (i === 26) cell.classList.add('yellow');
            if (i === 39) cell.classList.add('blue');
            if (this.safe.includes(i)) cell.classList.add('safe');
            board.appendChild(cell);
        });
        
        const homes = [
            {r:7,c:1,color:'red'}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6},
            {r:1,c:7,color:'green'}, {r:2,c:7}, {r:3,c:7}, {r:4,c:7}, {r:5,c:7}, {r:6,c:7},
            {r:7,c:13,color:'yellow'}, {r:7,c:12}, {r:7,c:11}, {r:7,c:10}, {r:7,c:9}, {r:7,c:8},
            {r:13,c:7,color:'blue'}, {r:12,c:7}, {r:11,c:7}, {r:10,c:7}, {r:9,c:7}, {r:8,c:7}
        ];
        homes.forEach((h, i) => {
            const cell = document.createElement('div');
            cell.className = 'ludo-cell';
            cell.style.gridRow = h.r + 1;
            cell.style.gridColumn = h.c + 1;
            if (h.color) cell.classList.add(h.color);
            if (i === 5 || i === 11 || i === 17 || i === 23) {
                cell.innerHTML = '🏁';
                cell.style.fontSize = '0.7rem';
            }
            board.appendChild(cell);
        });
    },
    
    get player() { return this.players[this.playerIdx]; },
    
    roll() {
        if (!gameState.isPlaying || this.hasRolled || this.waiting) return;
        this.dice = Math.floor(Math.random() * 6) + 1;
        this.hasRolled = true;
        const icons = ['⚀','⚁','⚂','⚃','⚄','⚅'];
        let rolls = 0;
        const anim = setInterval(() => {
            $('diceValue').textContent = icons[Math.floor(Math.random() * 6)];
            if (++rolls > 10) {
                clearInterval(anim);
                $('diceValue').textContent = icons[this.dice - 1];
                playSound('match');
                this.checkMoves();
            }
        }, 100);
    },
    
    checkMoves() {
        const p = this.player;
        let moves = 0, moveIdx = -1;
        this.tokens[p].forEach((pos, i) => {
            if (this.canMove(p, i)) { moves++; moveIdx = i; }
        });
        
        if (moves === 0) setTimeout(() => this.next(), 1000);
        else if (moves === 1) setTimeout(() => this.move(moveIdx), 500);
        else { this.waiting = true; this.renderTokens(); }
    },
    
    canMove(p, i) {
        const pos = this.tokens[p][i];
        if (pos === -1) return this.dice === 6;
        if (pos >= 100) return false;
        const steps = this.steps(p, pos);
        return steps + this.dice <= 57;
    },
    
    steps(p, pos) {
        if (pos < 0) return 0;
        if (pos >= 100) return 57;
        const start = this.starts[p];
        return pos >= start ? pos - start : 52 - start + pos;
    },
    
    move(i) {
        const p = this.player;
        const pos = this.tokens[p][i];
        
        if (pos === -1) {
            this.tokens[p][i] = this.starts[p];
            playSound('score');
        } else {
            const steps = this.steps(p, pos);
            const newSteps = steps + this.dice;
            
            if (newSteps > 56) {
                if (newSteps === 57) {
                    this.tokens[p][i] = 100 + i;
                    gameState.score += 100;
                    $('currentScore').textContent = gameState.score;
                    playSound('score');
                }
            } else if (newSteps > 50) {
                this.tokens[p][i] = 1000 + (newSteps - 51);
            } else {
                const newPos = (pos + this.dice) % 52;
                this.tokens[p][i] = newPos;
                this.capture(newPos);
            }
        }
        
        this.waiting = false;
        this.renderTokens();
        
        if (this.checkWin()) return;
        
        if (this.dice === 6) {
            this.hasRolled = false;
            this.updateTurn();
        } else {
            setTimeout(() => this.next(), 500);
        }
    },
    
    capture(pos) {
        if (this.safe.includes(pos)) return;
        const p = this.player;
        this.players.forEach(other => {
            if (other !== p) {
                this.tokens[other].forEach((t, i) => {
                    if (t === pos && t >= 0 && t < 52) {
                        this.tokens[other][i] = -1;
                        playSound('score');
                        gameState.score += 50;
                        $('currentScore').textContent = gameState.score;
                    }
                });
            }
        });
    },
    
    checkWin() {
        const p = this.player;
        if (this.tokens[p].every(t => t >= 100)) {
            gameState.score += 1000;
            $('currentScore').textContent = gameState.score;
            saveScore('ludo', 1);
            alert(`🏆 ${p.toUpperCase()} WINS!`);
            playSound('score');
            this.start();
            return true;
        }
        return false;
    },
    
    next() {
        this.playerIdx = (this.playerIdx + 1) % 4;
        this.hasRolled = false;
        this.waiting = false;
        this.dice = 0;
        this.updateTurn();
    },
    
    updateTurn() {
        const colors = { red: '#f56565', green: '#48bb78', yellow: '#ecc94b', blue: '#4299e1' };
        const p = this.player;
        $('turnIndicator').innerHTML = `<span style="color:${colors[p]};font-weight:bold">${p.toUpperCase()}'s Turn - Roll Dice!</span>`;
    },
    
    handleTokenClick(p, i) {
        if (!this.waiting || p !== this.player) return;
        if (this.canMove(p, i)) this.move(i);
    },
    
    renderTokens() {
        $$('.ludo-token').forEach(el => el.remove());
        const p = this.player;
        
        this.players.forEach((pl, pi) => {
            this.tokens[pl].forEach((pos, ti) => {
                let target = null;
                
                if (pos === -1) {
                    const home = $(`${pl}Home`);
                    if (home) target = home.children[ti];
                } else if (pos >= 100 && pos < 1000) {
                    return;
                } else if (pos >= 1000) {
                    const hp = pos - 1000;
                    const stretches = {
                        red: {r:7, c:[1,2,3,4,5,6]},
                        green: {c:7, r:[1,2,3,4,5,6]},
                        yellow: {r:7, c:[13,12,11,10,9,8]},
                        blue: {c:7, r:[13,12,11,10,9,8]}
                    };
                    const s = stretches[pl];
                    const cp = s.r !== undefined ? {r:s.r, c:s.c[hp]} : {r:s.r[hp], c:s.c};
                    target = this.getCell(cp.r, cp.c);
                } else {
                    const cp = this.path[pos];
                    if (cp) target = this.getCell(cp.r, cp.c);
                }
                
                if (target) {
                    const token = document.createElement('div');
                    token.className = `ludo-token ${pl}`;
                    const movable = this.waiting && pl === p && this.canMove(pl, ti);
                    if (movable) {
                        token.classList.add('movable');
                        token.onclick = () => this.handleTokenClick(pl, ti);
                    }
                    target.appendChild(token);
                }
            });
        });
    },
    
    getCell(r, c) {
        return Array.from($('ludoBoard').children).find(cell => 
            parseInt(cell.style.gridRow) === r + 1 && parseInt(cell.style.gridColumn) === c + 1
        );
    }
};

// ============================================
// ⭕ TIC TAC TOE
// ============================================
const tictactoe = {
    board: [],
    current: 'X',
    active: false,
    wins: 0,
    conditions: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
    
    start() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.current = 'X';
        this.active = true;
        gameState.score = 0;
        gameState.isPlaying = true;
        playSound('start');
        this.render();
        this.updateIndicator();
        $('tictactoeResult').textContent = '';
        this.setupCells();
    },
    
    setupCells() {
        $$('.ttt-cell').forEach((cell, i) => {
            cell.onclick = () => this.click(i);
        });
    },
    
    render() {
        $$('.ttt-cell').forEach((cell, i) => {
            cell.textContent = this.board[i];
            cell.className = 'ttt-cell' + (this.board[i] ? ` ${this.board[i].toLowerCase()}` : '');
        });
    },
    
    click(i) {
        if (!this.active || this.board[i]) return;
        this.board[i] = this.current;
        this.render();
        
        if (this.checkWin()) {
            this.active = false;
            this.wins++;
            gameState.score = this.wins * 100;
            $('currentScore').textContent = gameState.score;
            playSound('score');
            $('tictactoeResult').innerHTML = '<span class="win">🎉 Player ' + this.current + ' Wins!</span>';
            saveScore('tictactoe', this.wins);
        } else if (this.board.every(c => c)) {
            this.active = false;
            $('tictactoeResult').innerHTML = '<span class="draw">🤝 Draw!</span>';
        } else {
            this.current = this.current === 'X' ? 'O' : 'X';
            this.updateIndicator();
        }
    },
    
    checkWin() {
        return this.conditions.some(c => c.every(i => this.board[i] === this.current));
    },
    
    updateIndicator() {
        $('playerIndicator').textContent = `Player ${this.current}'s Turn`;
    },
    
    input(e) {
        const map = {'1':0,'2':1,'3':2,'4':3,'5':4,'6':5,'7':6,'8':7,'9':8};
        if (map[e.key] !== undefined && this.active) this.click(map[e.key]);
    }
};

// ============================================
// 🧱 TETRIS
// ============================================
const tetris = {
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    cols: 10,
    rows: 20,
    size: 30,
    board: [],
    piece: null,
    next: null,
    score: 0,
    level: 1,
    lines: 0,
    dropTime: 0,
    lastDrop: 0,
    
    pieces: [
        {shape: [[1,1,1,1]], color: '#00f0f0'},
        {shape: [[1,0,0],[1,1,1]], color: '#0000f0'},
        {shape: [[0,0,1],[1,1,1]], color: '#f0a000'},
        {shape: [[1,1],[1,1]], color: '#f0f000'},
        {shape: [[0,1,1],[1,1,0]], color: '#00f000'},
        {shape: [[1,1,1],[0,1,0]], color: '#a000f0'},
        {shape: [[1,1,0],[0,1,1]], color: '#f00000'}
    ],
    
    init() {
        if (!this.canvas) {
            this.canvas = $('tetrisCanvas');
            this.canvas.width = this.cols * this.size;
            this.canvas.height = this.rows * this.size;
            this.ctx = this.canvas.getContext('2d');
            this.nextCanvas = $('tetrisNext');
            this.nextCanvas.width = 120;
            this.nextCanvas.height = 120;
            this.nextCtx = this.nextCanvas.getContext('2d');
        }
    },
    
    start() {
        this.init();
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 1000;
        this.piece = this.randomPiece();
        this.next = this.randomPiece();
        gameState.score = 0;
        gameState.isPlaying = true;
        playSound('start');
        this.updateDisplay();
        this.lastDrop = performance.now();
        this.loop();
    },
    
    randomPiece() {
        const p = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        return {
            shape: p.shape.map(r => [...r]),
            color: p.color,
            x: Math.floor(this.cols / 2) - Math.floor(p.shape[0].length / 2),
            y: 0
        };
    },
    
    loop(time) {
        if (!gameState.isPlaying) return;
        gameLoop = requestAnimationFrame((t) => this.loop(t));
        if (gameState.isPaused) return;
        
        if (!time) time = performance.now();
        if (time - this.lastDrop > this.dropTime) {
            this.drop();
            this.lastDrop = time;
        }
        this.draw();
    },
    
    drop() {
        this.piece.y++;
        if (this.collide()) {
            this.piece.y--;
            this.lock();
            this.piece = this.next;
            this.next = this.randomPiece();
            this.updateDisplay();
            if (this.collide()) showGameOver(this.score);
        }
    },
    
    collide() {
        return this.piece.shape.some((row, dy) =>
            row.some((val, dx) => {
                if (!val) return false;
                const x = this.piece.x + dx, y = this.piece.y + dy;
                return x < 0 || x >= this.cols || y >= this.rows || (y >= 0 && this.board[y][x]);
            })
        );
    },
    
    lock() {
        this.piece.shape.forEach((row, dy) => {
            row.forEach((val, dx) => {
                if (val && this.piece.y + dy >= 0) {
                    this.board[this.piece.y + dy][this.piece.x + dx] = this.piece.color;
                }
            });
        });
        this.clear();
    },
    
    clear() {
        let cleared = 0;
        this.board = this.board.filter(row => {
            if (row.every(c => c)) { cleared++; return false; }
            return true;
        });
        while (this.board.length < this.rows) this.board.unshift(Array(this.cols).fill(0));
        
        if (cleared > 0) {
            this.lines += cleared;
            this.score += [0, 100, 300, 500, 800][cleared] * this.level;
            gameState.score = this.score;
            $('currentScore').textContent = this.score;
            playSound('score');
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropTime = Math.max(100, 1000 - (this.level - 1) * 100);
        }
    },
    
    rotate() {
        const rotated = this.piece.shape[0].map((_, i) =>
            this.piece.shape.map(r => r[i]).reverse()
        );
        const newPiece = { ...this.piece, shape: rotated };
        const oldShape = this.piece.shape;
        this.piece.shape = rotated;
        if (this.collide()) this.piece.shape = oldShape;
        else this.draw();
    },
    
    move(dx, dy) {
        this.piece.x += dx;
        if (this.collide()) this.piece.x -= dx;
        else this.draw();
    },
    
    input(e) {
        if (e.key === 'ArrowLeft') this.move(-1, 0);
        else if (e.key === 'ArrowRight') this.move(1, 0);
        else if (e.key === 'ArrowDown') this.drop();
        else if (e.key === 'ArrowUp') this.rotate();
    },
    
    updateDisplay() {
        $('tetrisLevel').textContent = this.level;
        $('tetrisLines').textContent = this.lines;
    },
    
    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = cell;
                    ctx.fillRect(x * this.size + 1, y * this.size + 1, this.size - 2, this.size - 2);
                }
            });
        });
        
        if (this.piece) {
            this.piece.shape.forEach((row, dy) => {
                row.forEach((val, dx) => {
                    if (val) {
                        ctx.fillStyle = this.piece.color;
                        ctx.fillRect(
                            (this.piece.x + dx) * this.size + 1,
                            (this.piece.y + dy) * this.size + 1,
                            this.size - 2, this.size - 2
                        );
                    }
                });
            });
        }
        
        const nctx = this.nextCtx;
        nctx.fillStyle = '#1e293b';
        nctx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        if (this.next) {
            const ox = (this.nextCanvas.width - this.next.shape[0].length * 25) / 2;
            const oy = (this.nextCanvas.height - this.next.shape.length * 25) / 2;
            this.next.shape.forEach((row, dy) => {
                row.forEach((val, dx) => {
                    if (val) {
                        nctx.fillStyle = this.next.color;
                        nctx.fillRect(ox + dx * 25 + 1, oy + dy * 25 + 1, 23, 23);
                    }
                });
            });
        }
    }
};

// ============================================
// 🧠 MEMORY GAME - Fixed
// ============================================
const memory = {
    cards: [],
    flipped: [],
    matched: 0,
    moves: 0,
    timer: null,
    startT: 0,
    locked: false,
    emojis: ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎢', '🎡'],
    
    start() {
        this.cards = [...this.emojis, ...this.emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, i) => ({ emoji, id: i, flipped: false, matched: false }));
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        gameState.score = 0;
        gameState.isPlaying = true;
        this.locked = false;
        playSound('start');
        
        // Create grid
        const grid = document.getElementById('memoryGrid');
        if (!grid) {
            alert('Memory grid not found!');
            return;
        }
        
        grid.innerHTML = '';
        this.cards.forEach((card, i) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.index = i;
            cardEl.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front"></div>
                    <div class="memory-card-back">${card.emoji}</div>
                </div>
            `;
            cardEl.onclick = () => this.flip(i);
            grid.appendChild(cardEl);
        });
        
        this.updateStats();
        this.startTime();
    },
    
    flip(i) {
        if (this.locked || !gameState.isPlaying) return;
        const card = this.cards[i];
        if (card.flipped || card.matched) return;
        
        card.flipped = true;
        this.flipped.push(card);
        
        const cardEl = document.querySelector(`.memory-card[data-index="${i}"]`);
        if (cardEl) cardEl.classList.add('flipped');
        
        if (this.flipped.length === 2) {
            this.moves++;
            this.updateStats();
            this.check();
        }
    },
    
    check() {
        this.locked = true;
        const [c1, c2] = this.flipped;
        
        if (c1.emoji === c2.emoji) {
            // Match!
            c1.matched = true;
            c2.matched = true;
            this.matched++;
            this.flipped = [];
            this.locked = false;
            playSound('match');
            this.updateStats();
            
            if (this.matched === this.emojis.length) {
                this.end();
            }
        } else {
            // No match
            setTimeout(() => {
                const card1 = document.querySelector(`.memory-card[data-index="${c1.id}"]`);
                const card2 = document.querySelector(`.memory-card[data-index="${c2.id}"]`);
                if (card1) card1.classList.remove('flipped');
                if (card2) card2.classList.remove('flipped');
                
                c1.flipped = false;
                c2.flipped = false;
                this.flipped = [];
                this.locked = false;
            }, 1000);
        }
    },
    
    startTime() {
        this.startT = Date.now();
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startT) / 1000);
            const min = Math.floor(elapsed / 60);
            const sec = elapsed % 60;
            const timeEl = document.getElementById('memoryTime');
            if (timeEl) timeEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
        }, 1000);
    },
    
    updateStats() {
        const movesEl = document.getElementById('memoryMoves');
        const pairsEl = document.getElementById('memoryPairs');
        if (movesEl) movesEl.textContent = this.moves;
        if (pairsEl) pairsEl.textContent = `${this.matched}/${this.emojis.length}`;
    },
    
    end() {
        if (this.timer) clearInterval(this.timer);
        gameState.score = Math.max(0, 1000 - this.moves * 10);
        document.getElementById('currentScore').textContent = gameState.score;
        playSound('score');
        setTimeout(() => showGameOver(gameState.score), 500);
    }
};

// ============================================
// 🔢 2048
// ============================================
const game2048 = {
    grid: [],
    score: 0,
    best: parseInt(localStorage.getItem('2048best') || '0'),
    
    start() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        gameState.score = 0;
        gameState.isPlaying = true;
        playSound('start');
        this.addTile();
        this.addTile();
        this.render();
    },
    
    addTile() {
        const empty = [];
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++)
                if (this.grid[r][c] === 0) empty.push({ r, c });
        if (empty.length > 0) {
            const { r, c } = empty[Math.floor(Math.random() * empty.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    },
    
    input(e) {
        const key = e.key;
        let moved = false;
        
        if (key === 'ArrowUp') moved = this.up();
        else if (key === 'ArrowDown') moved = this.down();
        else if (key === 'ArrowLeft') moved = this.left();
        else if (key === 'ArrowRight') moved = this.right();
        
        if (moved) {
            this.addTile();
            this.render();
            if (this.over()) setTimeout(() => showGameOver(this.score), 300);
        }
    },
    
    slide(row) {
        const arr = row.filter(v => v);
        return arr.concat(Array(4 - arr.length).fill(0));
    },
    
    combine(row) {
        for (let i = 0; i < 3; i++) {
            if (row[i] && row[i] === row[i + 1]) {
                row[i] *= 2;
                row[i + 1] = 0;
                this.score += row[i];
                gameState.score = this.score;
                $('currentScore').textContent = this.score;
                playSound('score');
            }
        }
        return row;
    },
    
    operate(row) {
        row = this.slide(row);
        row = this.combine(row);
        return this.slide(row);
    },
    
    left() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const old = [...this.grid[r]];
            this.grid[r] = this.operate(this.grid[r]);
            if (old.join(',') !== this.grid[r].join(',')) moved = true;
        }
        return moved;
    },
    
    right() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const old = [...this.grid[r]];
            this.grid[r].reverse();
            this.grid[r] = this.operate(this.grid[r]);
            this.grid[r].reverse();
            if (old.join(',') !== this.grid[r].join(',')) moved = true;
        }
        return moved;
    },
    
    up() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const row = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
            const old = [...row];
            const newRow = this.operate(row);
            for (let r = 0; r < 4; r++) this.grid[r][c] = newRow[r];
            if (old.join(',') !== newRow.join(',')) moved = true;
        }
        return moved;
    },
    
    down() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const row = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
            const old = [...row];
            const newRow = this.operate(row.reverse()).reverse();
            for (let r = 0; r < 4; r++) this.grid[r][c] = newRow[r];
            if (old.join(',') !== newRow.join(',')) moved = true;
        }
        return moved;
    },
    
    over() {
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++)
                if (this.grid[r][c] === 0) return false;
        
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 3; c++)
                if (this.grid[r][c] === this.grid[r][c + 1]) return false;
        
        for (let c = 0; c < 4; c++)
            for (let r = 0; r < 3; r++)
                if (this.grid[r][c] === this.grid[r + 1][c]) return false;
        
        return true;
    },
    
    render() {
        const container = $('game2048Grid');
        container.innerHTML = this.grid.flat().map(v =>
            `<div class="game2048-cell" data-value="${v}">${v || ''}</div>`
        ).join('');
        
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('2048best', this.best.toString());
            $('game2048Best').textContent = this.best;
        }
    }
};

// ============================================
// 🏓 BRICK BREAKER
// ============================================
const brick = {
    canvas: null,
    ctx: null,
    paddle: { x: 250, y: 380, w: 100, h: 15 },
    ball: { x: 300, y: 350, r: 8, dx: 4, dy: -4 },
    bricks: [],
    lives: 3,
    level: 1,
    
    init() {
        if (!this.canvas) {
            this.canvas = $('brickCanvas');
            this.canvas.width = 600;
            this.canvas.height = 400;
            this.ctx = this.canvas.getContext('2d');
        }
    },
    
    createBricks() {
        this.bricks = [];
        const rows = 5, cols = 8, bw = 65, bh = 20, pad = 10;
        const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#4299e1'];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.bricks.push({
                    x: c * (bw + pad) + 20,
                    y: r * (bh + pad) + 50,
                    w: bw, h: bh, status: 1, color: colors[r]
                });
            }
        }
    },
    
    resetBall() {
        this.ball = { x: 300, y: 350, r: 8, dx: 4 * (Math.random() > 0.5 ? 1 : -1), dy: -4 };
        this.paddle.x = 250;
    },
    
    start() {
        this.init();
        this.lives = 3;
        this.level = 1;
        this.resetBall();
        this.createBricks();
        gameState.score = 0;
        gameState.isPlaying = true;
        playSound('start');
        
        this.canvas.onmousemove = (e) => {
            if (!gameState.isPlaying) return;
            const rect = this.canvas.getBoundingClientRect();
            this.paddle.x = Math.max(0, Math.min(e.clientX - rect.left - this.paddle.w / 2, this.canvas.width - this.paddle.w));
        };
        
        this.loop();
    },
    
    loop() {
        if (!gameState.isPlaying) return;
        gameLoop = requestAnimationFrame(() => this.loop());
        if (gameState.isPaused) return;
        this.update();
    },
    
    update() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        if (this.ball.x + this.ball.r > this.canvas.width || this.ball.x - this.ball.r < 0)
            this.ball.dx = -this.ball.dx;
        if (this.ball.y - this.ball.r < 0)
            this.ball.dy = -this.ball.dy;
        
        if (this.ball.y + this.ball.r > this.paddle.y &&
            this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.w) {
            this.ball.dy = -Math.abs(this.ball.dy);
            playSound('match');
        }
        
        if (this.ball.y + this.ball.r > this.canvas.height) {
            this.lives--;
            if (this.lives <= 0) {
                showGameOver(gameState.score);
                return;
            }
            this.resetBall();
        }
        
        this.bricks.forEach(b => {
            if (b.status === 1 &&
                this.ball.x > b.x && this.ball.x < b.x + b.w &&
                this.ball.y > b.y && this.ball.y < b.y + b.h) {
                this.ball.dy = -this.ball.dy;
                b.status = 0;
                gameState.score += 10;
                $('currentScore').textContent = gameState.score;
                playSound('score');
            }
        });
        
        if (this.bricks.every(b => b.status === 0)) {
            this.level++;
            this.resetBall();
            this.createBricks();
        }
        
        this.draw();
    },
    
    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#667eea';
        ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);
        
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
        ctx.fillStyle = '#f56565';
        ctx.fill();
        
        this.bricks.forEach(b => {
            if (b.status === 1) {
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });
        
        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px Arial';
        ctx.fillText(`Lives: ${'❤️'.repeat(this.lives)}`, 10, 25);
    },
    
    input(e) {
        const speed = 30;
        if (e.key === 'ArrowLeft') this.paddle.x = Math.max(0, this.paddle.x - speed);
        else if (e.key === 'ArrowRight') this.paddle.x = Math.min(this.canvas.width - this.paddle.w, this.paddle.x + speed);
    }
};
