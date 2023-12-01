var argv = require('minimist')(process.argv.slice(2));

const solve = (lines) => {
  if (lines.length <= 0) {
    return 0;
  }

  return getValueOfLine(lines[0]) + solve(lines.slice(1));
};

const getValueOfLine = (line) => {
  let result = 0;
  line = line.toString();

  let left = -1;
  let right = line.length;

  while (left + 1 < line.length && !Number(line[left + 1])) left++;
  while (right - 1 > -1 && !Number(line[right - 1])) right--;

  left++;
  right--;

  if (
    left === -1 ||
    left >= line.length ||
    right === line.length ||
    right < 0
  ) {
    result += 0;
  } else {
    result += Number(line[left]) * 10;
    result += Number(line[right]);
  }

  return result;
};

const lines = argv._;

console.log('result = ', solve(lines));
