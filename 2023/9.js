const dydx = (data, layers = [data]) => {
  if (data.every((y) => y === 0)) return layers;
  const layer = [];
  for (let i = 1; i < data.length; i++) layer.push(data[i] - data[i - 1]);
  return dydx(layer, [...layers, layer]);
};

const extrapolate = (layers) => {
  if (layers.length === 1) return layers[0];

  const bottomLayer = layers.pop();
  const bottomLast = bottomLayer.pop();
  const bottomFirst = bottomLayer.shift();

  const currentLayer = layers.pop();
  const currentLast = currentLayer.pop();
  const currentFirst = currentLayer.shift();

  layers.push([currentFirst - bottomFirst, currentLast + bottomLast]);
  return extrapolate(layers);
};

const solve = (input) => {
  const result = { p1: 0, p2: 0 };
  while (input.length) {
    const [prev, next] = extrapolate(dydx(input.splice(0, 21)));
    (result.p1 += next), (result.p2 += prev);
  }
  return result;
};

const { p1, p2 } = solve(process.argv.slice(2).map((point) => Number(point)));

console.log('Part 1 - ', p1);
console.log('Part 2 - ', p2);
