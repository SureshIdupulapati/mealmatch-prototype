const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Get all active food drops (with optional tag, search, area & sorting)
app.get('/api/drops', (req, res) => {
  try {
    const { tag, search, area, sort } = req.query;
    const drops = db.getDrops(tag, search, area, sort);
    res.json({ drops, total: drops.length });
  } catch (err) {
    console.error('Error fetching drops:', err);
    res.status(500).json({ error: 'Failed to fetch drops' });
  }
});

// 2. Get single food drop details
app.get('/api/drops/:id', (req, res) => {
  try {
    const drop = db.getDropById(req.params.id);
    if (!drop) {
      return res.status(404).json({ error: 'Drop not found' });
    }
    res.json({ drop });
  } catch (err) {
    console.error('Error fetching drop:', err);
    res.status(500).json({ error: 'Failed to fetch drop' });
  }
});

// 3. Post a new drop (for campus clubs / organizers)
app.post('/api/drops', (req, res) => {
  try {
    const {
      title,
      event_name,
      host,
      location_name,
      campus_area,
      total_portions,
      portion_type,
      tags,
      dietary_badges,
      pickup_instructions,
      expires_in_minutes,
      image_url
    } = req.body;

    if (!title || !location_name || !total_portions) {
      return res.status(400).json({ error: 'Title, location, and total portions are required' });
    }

    const newDrop = db.createDrop({
      title,
      event_name,
      host,
      location_name,
      campus_area,
      total_portions,
      portion_type,
      tags,
      dietary_badges,
      pickup_instructions,
      expires_in_minutes,
      image_url
    });

    res.status(201).json({ success: true, drop: newDrop });
  } catch (err) {
    console.error('Error creating drop:', err);
    res.status(500).json({ error: 'Failed to create food drop' });
  }
});

// 4. Claim a portion (reserves 1 box for 20 minutes)
app.post('/api/drops/:id/claim', (req, res) => {
  try {
    const dropId = req.params.id;
    const userId = req.body.userId || 'user_alex';

    const result = db.claimDrop(dropId, userId);
    res.json({
      success: true,
      message: result.message,
      reservation: result.reservation,
      drop: result.drop
    });
  } catch (err) {
    console.error('Error claiming drop:', err);
    res.status(400).json({ error: err.message || 'Failed to claim portion' });
  }
});

// 5. Get active reservation for user
app.get('/api/reservations/active', (req, res) => {
  try {
    const userId = req.query.userId || 'user_alex';
    const reservation = db.getActiveReservation(userId);
    res.json({ active_reservation: reservation });
  } catch (err) {
    console.error('Error getting active reservation:', err);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// 6. Complete pickup (marks as picked up, increments user stats: meals rescued +1, CO2 saved +1.3kg, money saved +$10)
app.post('/api/reservations/:id/pickup', (req, res) => {
  try {
    const userId = req.body.userId || 'user_alex';
    const result = db.completePickup(req.params.id, userId);
    const profile = db.getUserProfile(userId);
    res.json({ success: true, message: result.message, profile });
  } catch (err) {
    console.error('Error completing pickup:', err);
    res.status(400).json({ error: err.message || 'Failed to complete pickup' });
  }
});

// 7. Cancel reservation (releases portion back to drop)
app.post('/api/reservations/:id/cancel', (req, res) => {
  try {
    const result = db.cancelReservation(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    console.error('Error cancelling reservation:', err);
    res.status(400).json({ error: err.message || 'Failed to cancel reservation' });
  }
});

// 8. Get student profile & impact metrics
app.get('/api/user/profile', (req, res) => {
  try {
    const userId = req.query.userId || 'user_alex';
    const profile = db.getUserProfile(userId);
    res.json({ profile });
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Fallback for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`MealMatch Backend Server running on http://localhost:${PORT}`);
});
