const matches = [
    { id: 1, teams: "Shemu vs Karim" },
    { id: 2, teams: "Rohan vs Rafi" },
    { id: 3, teams: "Ayan vs Yusuf" },
    { id: 4, teams: "Raju vs Arif" },
    { id: 5, teams: "Tariq vs Zaid" },
    { id: 6, teams: "Mehdi vs Iqbal" },
    { id: 7, teams: "Amir vs Rahman" },
    { id: 8, teams: "Nadeem vs Hasan" },
    { id: 9, teams: "Sami vs Adil" },
    { id: 10, teams: "Farhan vs Wahid" },
  ];
  
  let balance = 1000;
  
  function getRandomOdds() {
    return (Math.random() * (5 - 1) + 1).toFixed(2);
  }
  
  function createMatchHTML(match) {
    let oddsHTML = "";
    for (let i = 0; i < 15; i++) {
      oddsHTML += `<span>Odd ${i + 1}: ${getRandomOdds()}</span>`;
    }
  
    return `
      <div class="match" id="match-${match.id}">
        <p class="team-name">${match.teams}</p>
        <div class="odds">${oddsHTML}</div>
        <div class="bet-section">
          <input type="number" id="bet-amount-${match.id}" placeholder="Bet Amount">
          <button onclick="placeBet(${match.id})">Place Bet</button>
          <p class="error" id="error-${match.id}"></p>
        </div>
      </div>
    `;
  }
  
  function loadMatches() {
    const container = document.getElementById("matches-container");
    matches.forEach((match) => {
      container.innerHTML += createMatchHTML(match);
    });
  }
  
  function placeBet(matchId) {
    const betInput = document.getElementById(`bet-amount-${matchId}`);
    const errorElement = document.getElementById(`error-${matchId}`);
    const betAmount = parseInt(betInput.value);
  
    if (!betAmount || betAmount <= 0) {
      errorElement.textContent = "Enter a valid bet amount.";
      return;
    }
  
    if (betAmount > balance) {
      errorElement.textContent = "Insufficient balance.";
      return;
    }
  
    fetch('/place-bet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 1, betAmount: betAmount }),  // Replace with actual user ID
    })
      .then(response => response.json())
      .then(data => {
        balance -= betAmount;
        document.getElementById("balance").textContent = balance;
        errorElement.textContent = "Bet placed successfully!";
        errorElement.style.color = "green";
        betInput.value = "";
      })
      .catch(err => {
        errorElement.textContent = "Error placing bet!";
        errorElement.style.color = "red";
      });
  }
  
  // Load matches on page load
  loadMatches();
  