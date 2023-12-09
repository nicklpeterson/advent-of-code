const argv = require('minimist')(process.argv.slice(2));

const parseArgv = (input) => {
  const directions = input
    .shift()
    .split('')
    .map((direction) => (direction === 'L' ? 0 : 1));
  input = input.join('').replaceAll('(', '').split(')');
  input.pop();

  const map = input.reduce((map, node) => {
    node = node.split(/=|,/gi);
    map[node[0]] = node.slice(1);
    return map;
  }, {});

  return { map, directions };
};

const getNextDirection = ({ directions, index }) =>
  directions[
    ((index % directions.length) + directions.length) % directions.length
  ];

const greatestCommonDivisor = (a, b) => {
  if (a > b) return greatestCommonDivisor(b, a);
  return a === 0 ? b : greatestCommonDivisor(b % a, a);
};

const leastCommonMultiple = (nums) =>
  nums.reduce((a, b) => (a * b) / greatestCommonDivisor(a, b));

const walkMap = ({ map, directions, stop, node = 'AAA' }) => {
  let index = 0;
  while (!stop(node))
    node = map[node][getNextDirection({ directions, index: index++ })];
  return index;
};

const solvePart1 = ({ map, directions }) => {
  const stop = (node) => node === 'ZZZ';
  return walkMap({ map, directions, stop });
};

const solvePart2 = ({ map, directions }) => {
  const stop = (node) => node.slice(-1) === 'Z';
  const nodes = Object.keys(map).filter((node) => node.slice(-1) === 'A');
  const counts = nodes.map((node) => walkMap({ map, node, directions, stop }));
  return leastCommonMultiple(counts);
};

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
