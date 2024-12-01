const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Change to your MySQL username
  password: 'password', // Change to your MySQL password
  database: 'gambling_site',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Get user balance
app.get('/balance/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT balance FROM balances WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Place a bet
app.post('/place-bet', (req, res) => {
  const { userId, betAmount } = req.body;

  // Check balance
  db.query('SELECT balance FROM balances WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    const currentBalance = results[0].balance;

    if (betAmount > currentBalance) {
      return res.status(400).send('Insufficient balance.');
    }

    // Update balance after placing the bet
    db.query('UPDATE balances SET balance = balance - ? WHERE user_id = ?', [betAmount, userId], (err) => {
      if (err) return res.status(500).send(err);
      res.send('Bet placed successfully!');
    });
  });
});

// Change odds (Example: Manually updating odds)
app.post('/update-odds', (req, res) => {
  const { matchId, newOdds } = req.body;

  // Update odds in the database (assuming odds are stored in a table)
  db.query('UPDATE odds SET odds = ? WHERE match_id = ?', [newOdds, matchId], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Odds updated successfully!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
