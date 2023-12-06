const argv = require('minimist')(process.argv.slice(2));

const parseArgvPart1 = (input) => {
  const times = input.slice(1, 5);
  const distances = input.slice(6, 10);
  return times.map((time, index) => ({ time, distance: distances[index] }));
};

const parseArgvPart2 = (input) => {
  const time = Number(input.slice(1, 5).join(''));
  const distance = Number(input.slice(6, 10).join(''));
  return { time, distance };
};

const quadraticFormula = ({ a, b, c }) => {
  const sol1 = Math.floor(
    (-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
  );
  const sol2 = Math.floor(
    (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
  );
  return [sol1, sol2];
};

// Y = distance traveled
// x = time pushing button
// z = time of event
// D = record distance
// Y = x * (z - x)
// Y = xz - x^2 = (-1)*x^2 + z * x + 0
// 0 = (-1)*x^2 + z * x - D
const solvePart1 = (input) =>
  input.reduce((result, { time, distance }) => {
    const [sol1, sol2] = quadraticFormula({ a: -1, b: time, c: -1 * distance });
    return result * (sol2 - sol1);
  }, 1);

const solvePart2 = ({ time, distance }) => {
  const [sol1, sol2] = quadraticFormula({ a: -1, b: time, c: -1 * distance });
  return sol2 - sol1;
};

console.log('Part 1 - ', solvePart1(parseArgvPart1(argv._)));
console.log('Part 2 - ', solvePart2(parseArgvPart2(argv._)));
