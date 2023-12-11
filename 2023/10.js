const parseArgv = (input) => {
  const map = input.map((line) => line.split(''));
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === 'S') {
        return walkThePipe({
          map,
          coordinate: [row, col],
          stop: ([row, col]) => map[row][col] === 'S',
        });
      }
    }
  }
  throw Error('Failed to find start');
};

const connected = ({ map, coordinate, nextCoordinate }) => {
  const [row, col] = coordinate;
  const [nextRow, nextCol] = nextCoordinate;
  const currentPipe = map[row][col];
  const nextPipe = map[nextRow][nextCol];

  if (nextRow === row - 1) {
    return (
      ['S', 'L', '|', 'J'].includes(currentPipe) &&
      ['S', '|', '7', 'F'].includes(nextPipe)
    );
  } else if (nextRow === row + 1) {
    return (
      ['S', '|', '7', 'F'].includes(currentPipe) &&
      ['S', 'L', '|', 'J'].includes(nextPipe)
    );
  } else if (nextCol === col - 1) {
    return (
      ['S', 'J', '7', '-'].includes(currentPipe) &&
      ['S', '-', 'L', 'F'].includes(nextPipe)
    );
  } else if (nextCol === col + 1) {
    return (
      ['S', '-', 'L', 'F'].includes(currentPipe) &&
      ['S', 'J', '7', '-'].includes(nextPipe)
    );
  } else {
    return false;
  }
};

const takeAStep = ({ map, coordinate, lastCoordinate = [null, null] }) =>
  [
    [coordinate[0] - 1, coordinate[1]],
    [coordinate[0] + 1, coordinate[1]],
    [coordinate[0], coordinate[1] - 1],
    [coordinate[0], coordinate[1] + 1],
  ]
    .filter(
      ([row, col]) =>
        (row !== lastCoordinate[0] || col !== lastCoordinate[1]) &&
        row < map.length &&
        col < map[row]?.length
    )
    .reduce((result, nextCoordinate) => {
      return connected({ map, coordinate, nextCoordinate })
        ? nextCoordinate
        : result;
    });

const walkThePipe = ({
  map,
  coordinate,
  lastCoordinate,
  stop,
  count = 0,
  visited = new Set(),
}) => {
  const start = coordinate;
  while (!stop(coordinate) || count === 0) {
    visited.add(JSON.stringify(coordinate));
    const nextCoordinate = takeAStep({ map, coordinate, lastCoordinate });
    lastCoordinate = coordinate;
    coordinate = nextCoordinate;
    count++;
  }
  return { count, visited, map };
};

const solvePart1 = ({ count }) => count / 2;

const solvePart2 = ({ visited, map }) => {
  let area = 0;

  for (let r = 0; r < map.length; r++) {
    let wallCount = 0;
    for (let c = 0; c < map[r].length; c++) {
      const cellIsAPipe = visited.has(JSON.stringify([r, c]));
      const cell = map[r][c];
      if (!cellIsAPipe && wallCount % 2 !== 0) {
        area++;
      } else if (cellIsAPipe && ['|', 'J', '7'].includes(cell)) {
        wallCount++;
      } else if (cellIsAPipe) {
        while (c + 1 < map[r].length && map[r][++c] === '-');
        if (
          (!['F', 'S'].includes(cell) || !['7', 'S'].includes(map[r][c])) &&
          (!['L', 'S'].includes(cell) || !['J', 'S'].includes(map[r][c]))
        )
          wallCount++;
      }
    }
  }

  return area;
};

const input = parseArgv(process.argv.slice(2));

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
