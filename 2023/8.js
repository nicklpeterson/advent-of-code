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

const walkWithDirections = ({ directions, map, node, stop, index = 0 }) => {
  if (index >= directions.length || stop(node)) {
    return { next: node, count: index };
  }
  return walkWithDirections({
    directions,
    map,
    stop,
    node: map[node][directions[index]],
    index: index + 1,
  });
};

const compressMap = ({ map, directions, stop }) =>
  Object.keys(map).reduce((result, node) => {
    result[node] = walkWithDirections({
      directions,
      map,
      node,
      stop,
    });
    return result;
  }, {});

const greatestCommonDivisor = (a, b) => {
  if (a > b) return greatestCommonDivisor(b, a);
  if (a === 0) return b;
  return greatestCommonDivisor(b % a, a);
};

const leastCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);

const walkMap = ({ map, node = 'AAA', count = 0, stop }) => {
  if (stop(node)) {
    return count;
  }

  return walkMap({
    map,
    node: map[node].next,
    count: map[node].count + count,
    stop,
  });
};

const solvePart1 = ({ map, directions }) => {
  const stop = (node) => node === 'ZZZ';
  return walkMap({ map: compressMap({ map, directions, stop }), stop });
};

const solvePart2 = ({ map, directions }) => {
  const stop = (node) => node.slice(-1) === 'Z';
  const cMap = compressMap({ map, directions, stop });
  const nodes = Object.keys(cMap).filter((node) => node.slice(-1) === 'A');
  const counts = [];
  nodes.forEach((node) => {
    counts.push(walkMap({ map: cMap, node, stop }));
  });

  return counts.reduce((result, count) => leastCommonMultiple(result, count));
};

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
