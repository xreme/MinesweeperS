# MinesweeperS
MinesweeperS is an implementation of the classic game Minesweeper *with a twist*, players can start lobbies, chat with other players, and play along side them.
## How To Play
Visit the [MinesweeperS](https://xreme.github.io/MinesweeperS/frontend/landing.html) website. On the landing page, you can choose to start room, join a room, or play singleplayer.
### Singleplayer
At the top of the control box, users can set difficulty presets.

You can press the **Start** button to start a game of minesweeper. 

To the left of the start button, there are options to modify the game: 
- **Grid Size** changes the size of the minesweeper grid (min. 10, max. 50)
- **Bomb Count** changes the amount of bombs placed on the grid (_note that the bombcount may automatically adjust to ensure that the game remains playable_)

### Multiplayer
To get started with multiplayer both players need to have the same Connection Configuration (STUN or TURN). Once both players have the same configuration, one player should start a room. Once the host has started a room, any following players can join the room, using the generated room code or a geneated join link from the host (_note this is only for joining the room_). While in the room, players can freely chat. To start a game, the host must set the paramters of the game, and then press the **start** button.

#### Connection Configuration
At the bottom, of the landing page, users can see their current connection configuration.

By default, MinesweeperS uses STUN servers provided by PeerJS, to create a direct connection between peers. On more restrictive networks, establishing direct connections in this manner may not be possible, preventing multiplayer from working as expected.


On more restrictive networks a TURN server can be used as intermediary between peers. TURN configurations can be set through sepcial invite links. At this time there are no other ways set TURN configurations. The connection configuration can be set back to STUN using the **reset** button on the landing page.

## Technical Overview

MinesweeperS is built with a focus on real-time multiplayer performance and reliability. Below are some of the key technical implementations:

### Networking Architecture (TURN/STUN)
Multiplayer connectivity is powered by **PeerJS**, which simplifies the WebRTC handshake process. The system employs a dual-layered ICE (Interactive Connectivity Establishment) approach:
- **STUN (Session Traversal Utilities for NAT)**: Used by default to discover the public IP addresses of peers and establish direct P2P connections.
- **TURN (Traversal Using Relays around NAT)**: A fallback mechanism for restrictive networks (e.g., corporate firewalls) that don't allow direct P2P traffic. In these cases, traffic is securely relayed through a TURN server to ensure a successful connection.

### Flood Reveal Algorithm
The core tile-revealing logic uses a **Recursive Flood Reveal** (commonly referred to as a "Bucket Fill" algorithm). When a player clicks an empty tile (0 neighboring mines), the algorithm:
1.  Recursively checks all 8 neighboring tiles.
2.  Reveals them if they are not already revealed or flagged.
3.  Continues the process for any newly revealed empty tiles, creating the satisfying "pop" effect that clears large sections of the board instantly.

### Multiplayer Synchronization & Race Conditions
In **CO-OP mode**, where multiple players interact with the same board, race conditions are a primary concern. To handle this:
- **Action Queue System**: All incoming player actions (clicks, flags) are passed through an `actionQueue` on the host. This ensures that actions are processed sequentially in the order they were received, preventing "double-reveals" or conflicting state updates if two players click the same tile at nearly the same millisecond.
- **Host-Authority Model**: The host maintains the "source of truth" for the game state and broadcasts updates to all connected clients.

### Protocol Choice & Reliability
While real-time games often use UDP (for speed) or TCP (for reliability), MinesweeperS utilizes **WebRTC DataChannels** configured for **Reliable Transmission (SCTP)**. This provides the best of both worlds:
- **No Packet Loss**: Unlike standard UDP, the reliable SCTP stream ensures that every chat message and game action arrives at its destination, avoiding "ghost" clicks or missing messages.
- **Low Latency**: It maintains P2P speed while providing TCP-like delivery guarantees.

### Data Formatting
Communication between peers follows a structured JSON format to ensure efficiency and extensibility:
```json
{
  "header": "typeOfMessage",
  "body": {
    "data": "content"
  }
}
```
This "Header/Body" pattern allows the game to quickly parse message types (Chat, Game Action, Host Info) and route them to the appropriate handlers without unnecessary overhead.

