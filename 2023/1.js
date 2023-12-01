var argv = require('minimist')(process.argv.slice(2));

const solve = (lines) =>
  lines.reduce((result, line) => getValueOfLine(line) + result, 0);

const getValueOfLine = (line) => {
  const digits = getDigits(line);
  return Number(digits[0]) * 10 + Number(digits[1]);
};

const getDigits = (line) =>
  Array.from(line.toString()).reduce((digits, char) => {
    if (Number(char) && digits.length === 0) {
      digits = [char, char];
    } else if (Number(char)) {
      digits = [digits[0], char];
    }
    return digits;
  }, []);

const lines = argv._;

console.log('result = ', solve(lines));
