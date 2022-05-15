#  Game Of Life TypeScript with fp-ts

Check it on my [github pages][1]


* [read about Game of Life on Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

---
* [TypeScript](https://www.typescriptlang.org/)
* [fp-ts](https://github.com/gcanti/fp-ts)


## About (rules)

The universe of&nbsp;the Game of&nbsp;Life is&nbsp;an&nbsp;infinite, two-dimensional orthogonal grid of&nbsp;square
cells, each of&nbsp;which is&nbsp;in
one of&nbsp;two possible states, live or&nbsp;dead (or&nbsp;populated and unpopulated, respectively). Every cell
interacts with its
eight neighbours, which are the cells that are horizontally, vertically, or&nbsp;diagonally adjacent. At&nbsp;each step
in&nbsp;time,
the following transitions occur:

Any live cell with fewer than two live neighbours dies, as&nbsp;if&nbsp;by&nbsp;underpopulation.
Any live cell with two or&nbsp;three live neighbours lives on&nbsp;to&nbsp;the next generation.
Any live cell with more than three live neighbours dies, as&nbsp;if&nbsp;by&nbsp;overpopulation.
Any dead cell with exactly three live neighbours becomes a&nbsp;live cell, as&nbsp;if&nbsp;by&nbsp;reproduction.
These rules, which compare the behavior of&nbsp;the automaton to&nbsp;real life, can be&nbsp;condensed into the
following:

Any live cell with two or&nbsp;three live neighbours survives.
Any dead cell with three live neighbours becomes a&nbsp;live cell.
All other live cells die in&nbsp;the next generation. Similarly, all other dead cells stay dead.
The initial pattern constitutes the seed of&nbsp;the system. The first generation is&nbsp;created by&nbsp;applying the
above rules
simultaneously to&nbsp;every cell in&nbsp;the seed, live or&nbsp;dead; births and deaths occur simultaneously, and the
discrete moment
at&nbsp;which this happens is&nbsp;sometimes called a&nbsp;tick. Each generation is&nbsp;a&nbsp;pure function
of&nbsp;the preceding&nbsp;one. The
rules continue to&nbsp;be&nbsp;applied repeatedly to&nbsp;create further generations.

[1]: https://ashmee.github.io/gameOfLife/
