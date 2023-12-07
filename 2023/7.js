const argv = require('minimist')(process.argv.slice(2));

const HIGH_CARD = 0,
  ONE_PAIR = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  FULL_HOUSE = 4,
  FOUR_OF_A_KIND = 5,
  FIVE_OF_A_KIND = 6;

const standardDeck = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'].reduce(
  (deck, card, index) => ({ ...deck, [card]: index }),
  {}
);

const jokerDeck = ['J', 2, 3, 4, 5, 6, 7, 8, 9, 'T', 'Q', 'K', 'A'].reduce(
  (deck, card, index) => ({ ...deck, [card]: index }),
  {}
);

const parseArgv = (input) =>
  input
    .reduce((cards, token, index) => {
      if (index % 2 === 0) {
        cards.push({
          cards: `${token}`,
          bid: input[index + 1],
          counts: getCardCounts(`${token}`),
        });
      }
      return cards;
    }, [])
    .map((hand) => ({ ...hand, type: getHandType(hand) }));

const getCardCounts = (cards) =>
  [...cards].reduce((counts, card) => {
    counts[card] = counts[card] ? counts[card] + 1 : 1;
    return counts;
  }, {});

const getHandType = (hand) => {
  const unique = Object.keys(hand.counts).length;
  if (unique === 5) {
    return HIGH_CARD;
  } else if (unique === 4) {
    return ONE_PAIR;
  } else if (unique === 3) {
    const isTwoPair = Object.values(hand.counts).find((count) => count === 2);
    return isTwoPair ? TWO_PAIR : THREE_OF_A_KIND;
  } else if (unique === 2) {
    const isFullHouse = Object.values(hand.counts).find((count) => count === 3);
    return isFullHouse ? FULL_HOUSE : FOUR_OF_A_KIND;
  } else {
    return FIVE_OF_A_KIND;
  }
};

const applyJokers = (hand) => {
  const js = hand.counts['J'];
  if (hand.type === HIGH_CARD && js) {
    return ONE_PAIR;
  } else if (hand.type === ONE_PAIR && (js === 1 || js === 2)) {
    return THREE_OF_A_KIND;
  } else if (hand.type === TWO_PAIR && js) {
    return js === 2 ? FOUR_OF_A_KIND : FULL_HOUSE;
  } else if (hand.type === THREE_OF_A_KIND && js) {
    return FOUR_OF_A_KIND;
  } else if ((hand.type === FULL_HOUSE || hand.type === FOUR_OF_A_KIND) && js) {
    return FIVE_OF_A_KIND;
  }
  return hand.type;
};

const sumBidsByRank = (hands, deck) =>
  hands
    .sort((handA, handB) => {
      if (handA.type !== handB.type) {
        return handA.type - handB.type;
      } else {
        for (let i = 0; i < 5; i++) {
          if (deck[handA.cards[i]] !== deck[handB.cards[i]]) {
            return deck[handA.cards[i]] - deck[handB.cards[i]];
          }
        }
      }
      return 0;
    })
    .reduce((total, hand, index) => total + hand.bid * (index + 1), 0);

const solvePart1 = (input) => sumBidsByRank(input, standardDeck);

const solvePart2 = (input) =>
  sumBidsByRank(
    input.map((hand) => ({ ...hand, type: applyJokers(hand) })),
    jokerDeck
  );

const input = parseArgv(argv._);

console.log('Part 1 - ', solvePart1(input));
console.log('Part 2 - ', solvePart2(input));
