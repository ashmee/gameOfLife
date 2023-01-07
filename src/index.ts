import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Random";
import * as O from "fp-ts/Option";
import { pipe, tuple } from "fp-ts/function";

type Cell = E.Either<"dead", "alive">;
type Coordinates = { x: number; y: number };
type World = Cell[][];

const canvas = document.querySelector<HTMLCanvasElement>("#gameOfLife")!;
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
canvas.width = winWidth;
canvas.height = winHeight;

const context = canvas.getContext("2d")!;
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "#038C3E";

const CELL_SIZE = 12;
const cellsX = Math.floor(winWidth / CELL_SIZE);
const cellsY = Math.floor(winHeight / CELL_SIZE);

const dead: Cell = E.left("dead");
const alive: Cell = E.right("alive");

const generateArray = (max: number) =>
  A.unfold(0, (n: number) => (n < max ? O.some([n, n + 1]) : O.none));

function generateWorld(sizeX: number, sizeY: number, random = false): World {
  // const res: World = [];
  //
  // for (let i = 0; i < sizeX; i++) {
  //   const col: Cell[] = [];
  //
  //   for (let j = 0; j < sizeY; j++) {
  //     col.push(random ? pipe(R.randomBool(), (r) => (r ? alive : dead)) : dead);
  //   }
  //
  //   res.push(col);
  // }
  //
  // return res;

  const xs = generateArray(sizeX);
  const ys = generateArray(sizeY);
  // return pipe(
  //   xs,
  //   A.map(() =>
  //     pipe(
  //       ys,
  //       A.map(() => (random ? pipe(R.randomBool(), (r) => (r ? alive : dead)) : dead))
  //     )
  //   )
  // );
  const generateCell = () =>
    random ? pipe(R.randomBool(), (r) => (r ? alive : dead)) : dead;

  return A.comprehension([xs], () => pipe(ys, A.map(generateCell)));
}

const iterateWorld = (world: World) =>
  pipe(
    world,
    A.chainWithIndex((x, c) =>
      pipe(
        c,
        A.mapWithIndex((y, cell) => ({
          x,
          y,
          cell
        }))
      )
    )
  );

const findCell =
  (world: World) =>
  (coords: Coordinates): O.Option<Cell> => {
    return pipe(
      world,
      A.lookup(coords.x),
      O.chain((col) => pipe(col, A.lookup(coords.y)))
    );
  };

const findNeighbors =
  (world: World) =>
  (coords: Coordinates): Cell[] =>
    pipe(
      A.comprehension(
        [
          [-1, 0, 1],
          [-1, 0, 1]
        ],

        tuple
      ),
      A.filter(([x, y]) => !(x === 0 && y === 0)),
      A.map(([xCurrent, yCurrent]) =>
        findCell(world)({ x: xCurrent + coords.x, y: yCurrent + coords.y })
      ),
      A.compact
    );

const flattenTwo = <L, R>(
  e: E.Either<E.Either<L, R>, E.Either<L, R>>
): E.Either<L, R> => (E.isLeft(e) ? e.left : e.right);

function createNewGeneration(world: World): World {
  const res: World = generateWorld(world.length, world[0].length);

  pipe(
    iterateWorld(world),
    A.map(({ x, y, cell }) => {
      const liveNeighbors: Cell[] = pipe(
        findNeighbors(world)({ x, y }),
        A.filter(E.isRight)
      );

      res[x][y] = pipe(
        cell,
        E.bimap(
          () => (liveNeighbors.length === 3 ? alive : dead),
          () =>
            liveNeighbors.length === 2 || liveNeighbors.length === 3
              ? alive
              : dead
        ),
        //распрямляем эйзэры (Either)
        flattenTwo
      );
    })
  );

  return res;
}

const drawCell =
  ({ x, y }: Coordinates) =>
  (cell: Cell) => {
    pipe(
      cell,
      E.fold(
        () =>
          context.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE),
        () =>
          context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      )
    );
  };

function drawWorld(world: World): void {
  pipe(
    iterateWorld(world),
    // for (let i = 0; i < world.length; i++) {
    //   for (let j = 0; j < world[i].length; j++) {
    //     drawCell({ x: i, y: j })(world[i][j]);
    //   }
    // }
    A.map(({ x, y, cell }) => drawCell({ x, y })(cell))
  );
}

let world: World = generateWorld(cellsX, cellsY, true);

let gameTimeout;
let generations = 0;
const stat = document.querySelector<HTMLDivElement>("#generationsCounter");


const gameLoop = (world: World, speed = 56) => {
  gameTimeout && clearTimeout(gameTimeout);

  const newGeneration = createNewGeneration(world);
  drawWorld(newGeneration);
  generations++;
  stat!.innerHTML = String(generations);

  gameTimeout = setTimeout(() => gameLoop(newGeneration), speed);
};

gameLoop(world);

const button = document.querySelector<HTMLButtonElement>("#restart");
button?.addEventListener("click", () => {
  generations = 0;
  gameLoop(generateWorld(cellsX, cellsY, true));
});
