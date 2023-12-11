const parseArgv = (input) => {
  const map = input.map((line) => line.split(''));
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === 'S') {
        return walkThePipe({ map, coordinate: [row, col] });
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

  if (nextRow === row - 1)
    return currentPipe.match(/S|L|\||J/) && nextPipe.match(/S|\||7|F/);
  else if (nextRow === row + 1)
    return currentPipe.match(/S|\||7|F/) && nextPipe.match(/S|\||L|J/);
  else if (nextCol === col - 1)
    return currentPipe.match(/S|J|7|-/) && nextPipe.match(/S|-|L|F/);
  else if (nextCol === col + 1)
    return currentPipe.match(/S|-|L|F/) && nextPipe.match(/S|J|7|-/);

  return false;
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
    .reduce((result, nextCoordinate) =>
      connected({ map, coordinate, nextCoordinate }) ? nextCoordinate : result
    );

const walkThePipe = ({
  map,
  coordinate,
  lastCoordinate,
  count = 0,
  visited = new Set(),
}) => {
  while (map[coordinate[0]][coordinate[1]] !== 'S' || count === 0) {
    visited.add(JSON.stringify(coordinate));
    const nextCoordinate = takeAStep({ map, coordinate, lastCoordinate });
    lastCoordinate = coordinate;
    coordinate = nextCoordinate;
    count++;
  }
  return { count, visited, map };
};

const solvePart1 = ({ count }) => count / 2;

const solvePart2 = ({ visited, map }) =>
  map.reduce((area, row, r) => {
    let insideLoop = false;

    for (let c = 0; c < row.length; c++) {
      const cellIsAPipe = visited.has(JSON.stringify([r, c]));
      const cell = map[r][c];

      if (!cellIsAPipe && insideLoop) area++;
      else if (cellIsAPipe && cell.match(/\||J|7/)) insideLoop = !insideLoop;
      else if (cellIsAPipe) {
        while (map[r][++c] === '-');
        if (
          (!cell.match(/F|S/) || !map[r][c].match(/7|S/)) &&
          (!cell.match(/L|S/) || !map[r][c].match(/J|S/))
        )
          insideLoop = !insideLoop;
      }
    }

    return area;
  }, 0);

const input = parseArgv(process.argv.slice(2));

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
