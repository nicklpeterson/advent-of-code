const dydx = (data, layers = [data]) => {
  if (data.every((y) => y === 0)) return layers;

  const layer = [];
  data.forEach((y, index) => {
    if (index > 0) layer.push(y - data[index - 1]);
  });

  layers.push(layer);
  return dydx(layer, layers);
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
    input = input.map((point) => Number(point));
    const dataSets = [];
    while (input.length > 0) dataSets.push(input.splice(0, 21));
    return dataSets.reduce(
      (result, dataSet) => {
        const [prev, next] = extrapolate(dydx(dataSet));
        return { p1: result.p1 + next, p2: result.p2 + prev };
      },
      { p1: 0, p2: 0 }
    );
  };

const { p1, p2 } = solve(process.argv.slice(2))

console.log('Part 1 - ', p1);
console.log('Part 2 - ', p2);
