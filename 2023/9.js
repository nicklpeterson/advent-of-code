const lagrange = (vals, x) => {
  let sum = 0;
  for (let k = 0; k < vals.length; k++) {
    let product = vals[k];
    for (let i = 0; i < vals.length; i++) {
      if (i !== k) product *= (x - i) / (k - i);
    }
    sum += product;
  }
  return sum;
};

const solve = (input) => {
  const result = { p1: 0, p2: 0 };
  while (input.length) {
    const dataPoints = input.splice(0, 21);
    result.p1 += lagrange(dataPoints, 21);
    result.p2 += lagrange(dataPoints, -1);
  }
  return result;
};

const input = process.argv.slice(2).map((point) => Number(point));
const { p1, p2 } = solve(input);

console.log('Part 1 - ', Math.round(p1));
console.log('Part 2 - ', Math.round(p2));
