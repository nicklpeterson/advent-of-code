const extrapolate = (data, layers = [data]) => {
  if (data.every((y) => y === 0)) return calculateValues(layers);
  const layer = [];
  for (let i = 1; i < data.length; i++) layer.push(data[i] - data[i - 1]);
  return extrapolate(layer, [...layers, layer]);
};

const calculateValues = (layers) => {
  if (layers.length === 1) return layers[0];

  const bottomLayer = layers.pop();

  layers[layers.length - 1] = [
    layers.at(-1).shift() - bottomLayer.shift(),
    layers.at(-1).pop() + bottomLayer.pop(),
  ];

  return calculateValues(layers);
};

const solve = (input) => {
  const result = { p1: 0, p2: 0 };
  while (input.length) {
    const [prev, next] = extrapolate(input.splice(0, 21));
    (result.p1 += next), (result.p2 += prev);
  }
  return result;
};

const { p1, p2 } = solve(process.argv.slice(2).map((point) => Number(point)));

console.log('Part 1 - ', p1);
console.log('Part 2 - ', p2);
