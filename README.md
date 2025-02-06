# MinesweeperS
MinesweeperS is an implementation of Minesweeper that allows users to play Solo, or start lobbies which they can chat with other players and compete to finish the puzzle the fastest.
## How To Play
Visit the [MinesweeperS](https://xreme.github.io/MinesweeperS/frontend/landing.html) website. On the landing page, you can choose to start room, join a room, or play singleplayer.
### Singleplayer
At the top of the control box, users can set difficulty presets.

You can press the **Start** button to start a game of minesweeper. 

To the left of the start button, there are options to modify the game: 
- **Grid Size** changes the size of the minesweeper grid (min. 10, max. 50)
- **Bomb Count** changes the amount of bombs placed on the grid (_note that the bombcount may automatically adjust to ensure that the game remains playable_)

### Multiplayer
To get started with multiplayer both players need to have the same Connection Configuration (STUN or TURN). Once both players have the same configuration, one player should start a room. Once the host has started a room, any following players can join the room, using the generated room code or a geneated join link from the host (_note this is only for joining the room_). When a player joins the room, it is announced in the chat. While in the room, players can freely chat. To start a game, the host must set the paramters of the game, and then press the **start** button.

#### Connection Configuration
At the bottom, of the landing page, users can see their current connection configuration.

By default, MinesweeperS uses STUN servers provided by PeerJS, to create a direct connection between peers. On more restrictive networks, establishing direct connections in this manner may not be possible, preventing multiplayer from working as expected.

On more restrictive networks a TURN server can be used as intermediary between peers. TURN configurations can be set through sepcial invite links. At this time there are no other ways set TURN configurations. The connection configuration can be set back to STUN using the **reset** button on the landing page.
