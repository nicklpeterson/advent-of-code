const argv = require('minimist')(process.argv.slice(2));

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const parseArgs = () => {
  const games = [];
  let currentGame;

  for (let i = 0; i < argv._.length; i++) {
    const token = argv._[i];

    if (token === 'Game') {
      if (currentGame) {
        games.push(currentGame);
      }

      currentGame = {
        number: Number(argv._[i + 1].replace(':', '')),
        blue: [],
        red: [],
        green: [],
      };
    } else if (Number(token)) {
      currentGame[argv._[i + 1].replace(';', '').replace(',', '')].push(
        Number(token)
      );
    }
  }

  if (currentGame) {
    games.push(currentGame);
  }

  return games;
};

const solvePart1 = (games) =>
  games.reduce((sum, game) => {
    if (gameIsPossible(game)) {
      sum += game.number;
    }

    return sum;
  }, 0);

const solvePart2 = (games) =>
  games.reduce(
    (sum, game) =>
      sum +
      Math.max(...game.red) * Math.max(...game.blue) * Math.max(...game.green),
    0
  );

const gameIsPossible = (game) => {
  let possible = true;
  game.blue.forEach((cubes) => {
    if (cubes > MAX_BLUE) {
      possible = false;
    }
  });

  game.red.forEach((cubes) => {
    if (cubes > MAX_RED) {
      possible = false;
    }
  });

  game.green.forEach((cubes) => {
    if (cubes > MAX_GREEN) {
      possible = false;
    }
  });

  return possible;
};

const games = parseArgs();

console.log('Part 1 - ', solvePart1(games));
console.log('Part 2 - ', solvePart2(games));
