# odin-tic-tac-toe

Another assignment from the Odin Project. There was a focus on applying the factory pattern discussed in prior lessons for creating objects and private variables. The biggest challenges in this project were:
- Deciding where logic about the game should reside, e.g. should the game board know when a player has won or should a game controller *using* that board be in charge of determining that? How 'dumb' or 'smart' should the board be? Such questions came up for nearly every object and I found it tough to neatly partition the logic of the application across them.
- Implementing the AI player. Implementing the minimax algorithm did not come naturally to me, despite understanding the idea of it.
