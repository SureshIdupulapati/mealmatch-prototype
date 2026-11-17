const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'mealmatch.db');
const db = new DatabaseSync(dbPath);

// Initialize Tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      major TEXT NOT NULL,
      campus TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      avatar_url TEXT,
      meals_rescued INTEGER DEFAULT 14,
      co2_saved REAL DEFAULT 18.5,
      money_saved REAL DEFAULT 140.0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drops (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      event_name TEXT NOT NULL,
      host TEXT NOT NULL,
      location_name TEXT NOT NULL,
      campus_area TEXT NOT NULL,
      distance TEXT NOT NULL,
      walk_time TEXT NOT NULL,
      total_portions INTEGER NOT NULL,
      remaining_portions INTEGER NOT NULL,
      portion_type TEXT NOT NULL DEFAULT 'boxes',
      expires_at TEXT NOT NULL,
      image_url TEXT NOT NULL,
      tags TEXT NOT NULL,
      dietary_badges TEXT NOT NULL,
      pickup_instructions TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      drop_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      pass_code TEXT NOT NULL,
      portions INTEGER DEFAULT 1,
      status TEXT DEFAULT 'active',
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(drop_id) REFERENCES drops(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS drop_spots (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      category TEXT NOT NULL
    );
  `);

  // Seed default user if empty
  const userCheck = db.prepare('SELECT count(*) as count FROM users').get();
  if (userCheck.count === 0) {
    db.prepare(`
      INSERT INTO users (id, name, major, campus, verified, avatar_url, meals_rescued, co2_saved, money_saved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'user_alex',
      'Alex Chen',
      "Cognitive Science '27",
      'UC Berkeley',
      1,
      '/assets/avatar.jpg',
      14,
      18.5,
      140.0
    );
  }

  // Seed default spots if empty
  const spotsCheck = db.prepare('SELECT count(*) as count FROM drop_spots').get();
  if (spotsCheck.count === 0) {
    const insertSpot = db.prepare('INSERT INTO drop_spots (id, name, area, category) VALUES (?, ?, ?, ?)');
    insertSpot.run('spot_1', 'Bechtel Hall', 'Engineering • North Campus', 'Engineering');
    insertSpot.run('spot_2', 'MLK Student Union', 'Student Life • Central Campus', 'Student Life');
    insertSpot.run('spot_3', 'Sutardja Dai Hall', 'EECS • North Campus', 'Technology');
  }

  // Seed default drops if empty
  const dropsCheck = db.prepare('SELECT count(*) as count FROM drops').get();
  if (dropsCheck.count === 0) {
    const now = Date.now();
    const insertDrop = db.prepare(`
      INSERT INTO drops (
        id, title, event_name, host, location_name, campus_area,
        distance, walk_time, total_portions, remaining_portions, portion_type,
        expires_at, image_url, tags, dietary_badges, pickup_instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Drop 1: Matches Figma Screen 2 exactly
    insertDrop.run(
      'drop_1',
      'Gourmet Sandwiches & Fruit',
      'ENGINEERING DEPT RECEPTION',
      'Robotics Club',
      'Bechtel Hall, Room 210',
      'North Campus',
      '0.2 mi away',
      '4 min walk',
      24,
      12,
      'boxes',
      new Date(now + 35 * 60 * 1000).toISOString(),
      '/assets/sandwiches.jpg',
      JSON.stringify(['Halal', 'Hot Meals']),
      JSON.stringify(['Nut-Free', 'Dairy-Free', 'Halal Friendly']),
      'Enter through side doors, grab box from table 2. Show your reservation pass code to the host.',
      'active'
    );

    // Drop 2
    insertDrop.run(
      'drop_2',
      'Roasted Veggie Grain Bowls',
      'CAMPUS SUSTAINABILITY FORUM',
      'Eco-Action Berkeley',
      'Sutardja Dai Hall, Atrium 2',
      'North Campus',
      '0.3 mi away',
      '6 min walk',
      16,
      8,
      'bowls',
      new Date(now + 55 * 60 * 1000).toISOString(),
      '/assets/bowls.jpg',
      JSON.stringify(['Vegan', 'Hot Meals']),
      JSON.stringify(['Vegan', 'Dairy-Free', 'Organic']),
      'Pick up near the center stage tables. Bring a clean fork if possible!',
      'active'
    );

    // Drop 3
    insertDrop.run(
      'drop_3',
      'Pastries & Fresh Fruit Platter',
      'ASUC WELLNESS EVENT',
      'ASUC Student Health',
      'MLK Student Union, Room 2',
      'Central Campus',
      '0.5 mi away',
      '9 min walk',
      30,
      24,
      'portions',
      new Date(now + 70 * 60 * 1000).toISOString(),
      '/assets/pastries.jpg',
      JSON.stringify(['Snacks']),
      JSON.stringify(['Vegetarian', 'Fresh Baked']),
      'Left side counter beside the refreshment station. Take 1 box per student.',
      'active'
    );
  }

  // Seed default active reservation matching Figma Screen 3 & 4
  const resCheck = db.prepare('SELECT count(*) as count FROM reservations').get();
  if (resCheck.count === 0) {
    const now = Date.now();
    db.prepare(`
      INSERT INTO reservations (id, drop_id, user_id, pass_code, portions, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'res_default',
      'drop_1',
      'user_alex',
      'MM-CAL-2084',
      1,
      'active',
      new Date(now + 20 * 60 * 1000).toISOString()
    );
  }
}

// Queries & Operations
function getDrops(filterTag = '', searchQuery = '', campusArea = '', sortBy = 'closest') {
  let query = "SELECT * FROM drops WHERE status = 'active' ORDER BY created_at DESC";
  const rows = db.prepare(query).all();

  let drops = rows
    .map(row => {
      let minsLeft = Math.round((new Date(row.expires_at) - new Date()) / 60000);
      // Auto-refresh demo timer if elapsed so drops always stay fresh
      if (minsLeft <= 0) {
        const resetMins = row.id === 'drop_1' ? 35 : row.id === 'drop_2' ? 55 : 70;
        const newExpiry = new Date(Date.now() + resetMins * 60 * 1000).toISOString();
        db.prepare('UPDATE drops SET expires_at = ? WHERE id = ?').run(newExpiry, row.id);
        minsLeft = resetMins;
      }

      return {
        ...row,
        tags: JSON.parse(row.tags),
        dietary_badges: JSON.parse(row.dietary_badges),
        minutes_left: Math.max(5, minsLeft)
      };
    })
    .filter(row => {
      if (filterTag && filterTag !== 'All') {
        const matchesTag = row.tags.some(t => t.toLowerCase() === filterTag.toLowerCase());
        if (!matchesTag) return false;
      }
      if (campusArea && campusArea !== 'All' && !campusArea.includes('All')) {
        const cleanArea = campusArea.replace(' Campus', '').trim().toLowerCase();
        if (!row.campus_area.toLowerCase().includes(cleanArea)) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${row.title} ${row.event_name} ${row.host} ${row.location_name} ${row.tags.join(' ')}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });

  // Sorting
  if (sortBy === 'expiring') {
    drops.sort((a, b) => a.minutes_left - b.minutes_left);
  } else if (sortBy === 'portions') {
    drops.sort((a, b) => b.remaining_portions - a.remaining_portions);
  } else {
    // Closest first
    drops.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  return drops;
}

function getDropById(id) {
  const row = db.prepare('SELECT * FROM drops WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags),
    dietary_badges: JSON.parse(row.dietary_badges),
    minutes_left: Math.max(0, Math.round((new Date(row.expires_at) - new Date()) / 60000))
  };
}

function createDrop(data) {
  const id = 'drop_' + Date.now();
  const now = Date.now();
  const expiresAt = new Date(now + (data.expires_in_minutes || 60) * 60 * 1000).toISOString();

  const insert = db.prepare(`
    INSERT INTO drops (
      id, title, event_name, host, location_name, campus_area,
      distance, walk_time, total_portions, remaining_portions, portion_type,
      expires_at, image_url, tags, dietary_badges, pickup_instructions, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  insert.run(
    id,
    data.title,
    data.event_name || 'CAMPUS EVENT',
    data.host || 'Campus Club',
    data.location_name,
    data.campus_area || 'Central Campus',
    data.distance || '0.2 mi away',
    data.walk_time || '5 min walk',
    parseInt(data.total_portions, 10) || 10,
    parseInt(data.total_portions, 10) || 10,
    data.portion_type || 'portions',
    expiresAt,
    data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    JSON.stringify(data.tags || ['Hot Meals']),
    JSON.stringify(data.dietary_badges || ['Fresh Food']),
    data.pickup_instructions || 'Please show your pass to pick up.'
  );

  return getDropById(id);
}

function claimDrop(dropId, userId = 'user_alex') {
  // Check drop
  const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
  if (!drop) throw new Error('Food drop not found');
  if (drop.remaining_portions <= 0) throw new Error('Sorry, all portions have already been claimed!');

  // Check if user already has an active reservation for this drop
  const existing = db.prepare("SELECT * FROM reservations WHERE user_id = ? AND drop_id = ? AND status = 'active'").get(userId, dropId);
  if (existing) {
    const fullDrop = getDropById(dropId);
    return { reservation: existing, drop: fullDrop, message: 'Existing active reservation loaded' };
  }

  // Decrement drop
  db.prepare('UPDATE drops SET remaining_portions = remaining_portions - 1 WHERE id = ?').run(dropId);

  // Generate unique pass code
  const codeNum = Math.floor(1000 + Math.random() * 9000);
  const passCode = `MM-CAL-${codeNum}`;
  const resId = 'res_' + Date.now();
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();

  // Create reservation
  db.prepare(`
    INSERT INTO reservations (id, drop_id, user_id, pass_code, portions, status, expires_at)
    VALUES (?, ?, ?, ?, 1, 'active', ?)
  `).run(resId, dropId, userId, passCode, expiresAt);

  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(resId);
  const updatedDrop = getDropById(dropId);

  return { reservation, drop: updatedDrop, message: 'Portion successfully reserved!' };
}

function getActiveReservation(userId = 'user_alex') {
  let res = db.prepare(`
    SELECT r.*, d.title as drop_title, d.location_name, d.host, d.event_name, d.image_url, d.walk_time
    FROM reservations r
    JOIN drops d ON r.drop_id = d.id
    WHERE r.user_id = ? AND r.status = 'active'
    ORDER BY r.created_at DESC
    LIMIT 1
  `).get(userId);

  // If no active reservation exists, auto-reactivate latest or claim drop_1 so user always has a live pass
  if (!res) {
    const latest = db.prepare(`
      SELECT r.*, d.title as drop_title, d.location_name, d.host, d.event_name, d.image_url, d.walk_time
      FROM reservations r
      JOIN drops d ON r.drop_id = d.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 1
    `).get(userId);

    if (latest) {
      const newExpires = new Date(Date.now() + 20 * 60 * 1000).toISOString();
      db.prepare("UPDATE reservations SET status = 'active', expires_at = ? WHERE id = ?").run(newExpires, latest.id);
      res = db.prepare(`
        SELECT r.*, d.title as drop_title, d.location_name, d.host, d.event_name, d.image_url, d.walk_time
        FROM reservations r
        JOIN drops d ON r.drop_id = d.id
        WHERE r.id = ?
      `).get(latest.id);
    }
  }

  if (!res) return null;

  let msLeft = new Date(res.expires_at) - new Date();
  if (msLeft <= 0) {
    const newExpires = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    db.prepare('UPDATE reservations SET expires_at = ? WHERE id = ?').run(newExpires, res.id);
    msLeft = 20 * 60 * 1000;
  }

  return {
    ...res,
    seconds_left: Math.max(10, Math.floor(msLeft / 1000))
  };
}

function completePickup(reservationId, userId = 'user_alex') {
  let res = db.prepare('SELECT * FROM reservations WHERE id = ?').get(reservationId);
  if (!res) {
    res = db.prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
  }
  if (!res) throw new Error('Reservation not found');

  db.prepare("UPDATE reservations SET status = 'picked_up' WHERE id = ?").run(res.id);

  // Update user impact metrics
  db.prepare(`
    UPDATE users 
    SET meals_rescued = meals_rescued + 1,
        co2_saved = ROUND(co2_saved + 1.3, 1),
        money_saved = ROUND(money_saved + 10.0, 1)
    WHERE id = ?
  `).run(userId);

  return { success: true, message: 'Meal picked up! Impact stats updated.' };
}

function cancelReservation(reservationId) {
  let res = db.prepare('SELECT * FROM reservations WHERE id = ?').get(reservationId);
  if (!res) {
    res = db.prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get('user_alex');
  }
  if (!res) throw new Error('Reservation not found');

  if (res.status === 'active') {
    db.prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ?").run(res.id);
    db.prepare('UPDATE drops SET remaining_portions = remaining_portions + 1 WHERE id = ?').run(res.drop_id);
  }

  return { success: true, message: 'Reservation cancelled and portion released' };
}

function getUserProfile(userId = 'user_alex') {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const spots = db.prepare('SELECT * FROM drop_spots').all();
  const activeCount = db.prepare("SELECT count(*) as count FROM reservations WHERE user_id = ? AND status = 'active'").get(userId).count;

  return {
    ...user,
    active_reservations_count: activeCount,
    favorite_spots: spots
  };
}

// Initialize on require
initDb();

module.exports = {
  getDrops,
  getDropById,
  createDrop,
  claimDrop,
  getActiveReservation,
  completePickup,
  cancelReservation,
  getUserProfile
};
