// Enhanced save system with better error handling
function saveLocal() {
  try {
    const key = STORAGE_KEY_PREFIX + (slotInput.value || 'default');
    const saveData = JSON.stringify(state);
    
    // Check if we have enough space
    try {
      localStorage.setItem(key, saveData);
      console.log('Game saved successfully');
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        showError('Storage full! Consider starting a new save slot.');
      } else {
        throw e;
      }
    }
  } catch(e) {
    console.error('Save failed:', e);
    showError('Failed to save game progress');
  }
}

function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'notification error';
  errorEl.textContent = message;
  errorEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-weight: 500;
  `;
  document.body.appendChild(errorEl);
  
  setTimeout(() => {
    errorEl.style.transition = 'opacity 0.3s ease';
    errorEl.style.opacity = '0';
    setTimeout(() => errorEl.remove(), 300);
  }, 3000);
}
// More varied and interesting golden cookie effects
const goldenCookieEffects = [
  {
    id: 'cookieFrenzy',
    name: 'Cookie Frenzy',
    weight: 25,
    apply: () => {
      const amt = Math.floor(getCps() * 60 + 100);
      state.cookies += amt;
      popCookieEffect('+' + format(amt));
      return `Frenzy! Gained ${format(amt)} cookies!`;
    }
  },
  {
    id: 'clickStorm',
    name: 'Click Storm',
    weight: 20,
    apply: () => {
      applyTempBuff('clickBoost', 20, s => s.baseClickValue *= 10, s => s.baseClickValue /= 10);
      popCookieEffect('Click x10!');
      return 'Click power multiplied by 10 for 20 seconds!';
    }
  },
  {
    id: 'buildingBoost',
    name: 'Building Boost',
    weight: 20,
    apply: () => {
      applyTempBuff('cpsBoost', 45, s => s.prestigeMultiplier *= 3, s => s.prestigeMultiplier /= 3);
      popCookieEffect('CPS x3!');
      return 'Building production tripled for 45 seconds!';
    }
  },
  {
    id: 'luckyBonus',
    name: 'Lucky Bonus',
    weight: 15,
    apply: () => {
      const bonus = Math.floor(state.cookies * 0.15);
      state.cookies += bonus;
      popCookieEffect('+' + format(bonus));
      return `Lucky! Gained 15% of your cookies (${format(bonus)})!`;
    }
  },
  {
    id: 'timeWarp',
    name: 'Time Warp',
    weight: 10,
    apply: () => {
      // Simulate 30 seconds of production instantly
      const warpGain = getCps() * 30;
      state.cookies += warpGain;
      state.totalCookies += warpGain;
      popCookieEffect('+' + format(warpGain));
      return `Time Warp! Gained ${format(warpGain)} cookies instantly!`;
    }
  },
  {
    id: 'freeBuildings',
    name: 'Free Buildings',
    weight: 10,
    apply: () => {
      // Give 10 free random buildings
      const buildingKeys = Object.keys(state.items);
      const randomBuilding = buildingKeys[Math.floor(Math.random() * buildingKeys.length)];
      state.items[randomBuilding].count += 10;
      popCookieEffect(`+10 ${randomBuilding}s!`);
      return `Bonus! Received 10 free ${randomBuilding}s!`;
    }
  }
];
// Optimized rendering to reduce DOM updates
let renderThrottle = false;
let pendingRender = false;

function requestRender() {
  if (renderThrottle) {
    pendingRender = true;
    return;
  }
  
  render();
  renderThrottle = true;
  
  setTimeout(() => {
    renderThrottle = false;
    if (pendingRender) {
      pendingRender = false;
      requestRender();
    }
  }, 16); // ~60fps
}

// Use in game loop
function tickLoop() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  
  const gained = getCps() * dt;
  state.cookies += gained;
  state.totalCookies += gained;
  
  requestRender();
}
// Add keyboard navigation for heavenly tree
function setupTreeNavigation() {
  const treeNodes = treeArea.querySelectorAll('.treeNode:not(.locked) .nodeBuy');
  if (treeNodes.length === 0) return;
  
  let currentIndex = 0;
  treeNodes[currentIndex].focus();
  
  heavenModal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % treeNodes.length;
      treeNodes[currentIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + treeNodes.length) % treeNodes.length;
      treeNodes[currentIndex].focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      treeNodes[currentIndex].click();
    }
  });
}
// Add game statistics
const stats = {
  cookiesClicked: 0,
  goldenCookiesClicked: 0,
  ascensions: 0,
  achievementsUnlocked: 0,
  totalTimePlayed: 0
};

// Update in relevant functions
function clickCookie() {
  stats.cookiesClicked++;
  // ... existing code
}

function spawnGoldenCookie() {
  // ... existing code
  g.addEventListener('click', () => {
    stats.goldenCookiesClicked++;
    // ... existing code
  });
}

// Display in UI or console
function showStats() {
  console.log('Game Statistics:', stats);
}
