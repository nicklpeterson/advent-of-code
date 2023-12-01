var argv = require('minimist')(process.argv.slice(2));

const solve = (lines) => {
  if (lines.length <= 0) return 0;
  return getValueOfLine(lines[0]) + solve(lines.slice(1));
};

const getValueOfLine = (line) => {
  const digits = getDigits(line);
  return Number(digits[0]) * 10 + Number(digits[1]);
};

const getDigits = (line, digits = []) => {
  line = line.toString();

  if (line.length === 0) {
    return digits;
  }

  if (Number(line[0]) && digits.length === 0) {
    digits = [line[0], line[0]];
  } else if (Number(line[0])) {
    digits = [digits[0], line[0]];
  }

  return getDigits(line.slice(1), digits);
};

const lines = argv._;

console.log('result = ', solve(lines));
