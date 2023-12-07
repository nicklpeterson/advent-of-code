const argv = require('minimist')(process.argv.slice(2));

const parseArgv = (input) =>
  input
    .join(',')
    .split('Card')
    .slice(1)
    .map((card) => {
      card = card.split('|');
      const winningNumbers = Array.from(
        new Set(
          card[0]
            .split(',')
            .filter((num) => num !== '' && !isNaN(num))
            .map((num) => Number(num))
            .sort((a, b) => a - b)
        )
      );

      const numbersYouHave = card[1]
        .split(',')
        .filter((num) => num !== '' && !isNaN(num))
        .map((num) => Number(num))
        .sort((a, b) => a - b);

      return { winningNumbers, numbersYouHave, copies: 1 };
    });

const solvePart1 = (input) =>
  input.reduce((acc, card) => {
    const matches = getNumberOfMatches(card);
    const points = matches <= 0 ? 0 : Math.pow(2, matches - 1);
    return acc + points;
  }, 0);

const solvePart2 = (input) =>
  input.reduce((acc, card, index) => {
    [...Array(getNumberOfMatches(card))].forEach((_, match) => {
      input[match + 1 + index].copies += card.copies;
    });
    return acc + card.copies;
  }, 0);

const getNumberOfMatches = ({ winningNumbers, numbersYouHave }) => {
  let winningPtr = 0;
  let cardPtr = 0;
  let matches = 0;

  while (
    winningPtr < winningNumbers.length &&
    cardPtr < numbersYouHave.length
  ) {
    const winningNumber = winningNumbers[winningPtr];
    const yourNumber = numbersYouHave[cardPtr];

    if (winningNumber === yourNumber) {
      matches++;
      cardPtr++;
    } else if (winningNumber > yourNumber) {
      cardPtr++;
    } else {
      winningPtr++;
    }
  }

  return matches;
};

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
