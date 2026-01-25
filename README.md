Project Demonstration Video : https://docs.google.com/videos/d/1i0jiA3Ge9SqFNBQmHf8R4rEu_LJPlED7muMvst8FjMk/edit?usp=sharing
#  Monke Rivals

**Monke Rivals** is a real-time, competitive multiplayer typing game where users race against each other to complete text excerpts. Unlike standard typing tests, this project focuses on the *synchronous 1v1 experience*, utilizing a custom matchmaking system to pair players of similar skill levels (or simple availability) in real-time.

---

##  Key Features

* **Real-Time Multiplayer:** Instant feedback on opponent progress using persistent WebSocket connections.
* **Live Matchmaking Queue:** A custom queuing system that pairs players instantly without blocking the main thread.
* **Race Mode:** 1v1 typing battles with live WPM (Words Per Minute) and accuracy tracking.
* **Responsive UI:** A clean, focused interface built with React to minimize distractions during gameplay.

---

##  Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js (Runtime), WebSockets (Real-time communication)
* **Database/Cache:** Redis (Matchmaking queue & temporary game state)
* **Styling:** CSS / Tailwind 

---

##  Architecture & Technical Insights

This project solves the challenge of state synchronization in a real-time environment.

### 1. The Matchmaking Queue (Redis)
Instead of using a traditional relational database to match players, **Monke Rivals** utilizes **Redis** for its atomic operations and speed.
* **Flow:** When a user clicks "Find Match," their socket ID is pushed into a Redis List/Set.
* **Pairing Logic:** The backend monitors this queue. Once the queue length $\ge 2$, the server atomically pops two IDs, generates a unique `roomID`, and emits a `match-found` event to both clients.
* **Why Redis?** This prevents "race conditions" where two users might be matched with the same third person, ensuring a clean 1v1 handshake.

### 2. Real-Time State Management (WebSockets)
* The game state isn't just stored on the client. Key events (like progress updates or game completion) are emitted via WebSockets.
* The server acts as the source of truth for the "Game Over" state to prevent client-side cheating.

---

##  Installation & Setup

Prerequisites: Node.js and a running Redis instance.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/monke-rivals.git](https://github.com/yourusername/monke-rivals.git)
    cd monke-rivals
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Ensure Redis is running locally on port 6379
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm start
    ```

4.  **Play**
    Open `http://localhost:3000` in two separate browser tabs to simulate a match.

---

## 🔮 Future Improvements

* **ELO Ranking System:** Persisting user stats in a SQL/NoSQL database to match players based on skill.
* **Global Leaderboards:** caching top daily scores in Redis Sorted Sets.
* **Private Rooms:** Allowing users to share a link to play against a specific friend.
