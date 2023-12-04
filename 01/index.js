"use strict";
const fs = require('fs');
const data01 = fs.readFileSync('input.txt', 'utf8').toString().split('\n');
const stringNumbers = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
];
function getNumberInString(word) {
    const numbersWithPosition = [{ index: -1, numberFound: 0 }];
    word.split('').forEach((element, index) => {
        const checkForNumber = +element;
        if (checkForNumber)
            numbersWithPosition.push({ index, numberFound: checkForNumber });
    });
    //   const last = number.length - 1
    //   number = number[0] + number[last]
    //   console.log('number', number)
    return numbersWithPosition.filter((e) => e.index !== -1);
}
const transformStringToNumber = (word) => {
    function getAllStringNumbers(word, stringNumber, accumulatedPosition, accumulatedArray) {
        const foundWord = word.indexOf(stringNumber);
        if (foundWord !== -1) {
            accumulatedArray.push({
                index: accumulatedPosition + foundWord,
                numberFound: stringNumbers.indexOf(stringNumber) + 1,
            });
            const newWord = word.slice(foundWord + 1, word.length);
            return getAllStringNumbers(newWord, stringNumber, foundWord + 1 + accumulatedPosition, accumulatedArray);
        }
        return accumulatedArray;
    }
    let existingNumber = stringNumbers.reduce((acc, e, i) => {
        const foundWord = word.indexOf(e);
        let numberPositions = [];
        if (foundWord !== -1) {
            numberPositions = getAllStringNumbers(word, e, 0, numberPositions);
        }
        return [...acc, ...numberPositions];
    }, []);
    existingNumber = existingNumber.filter((e) => e.index !== -1);
    console.log('getting word ', word, ' existing array: ', existingNumber);
    return existingNumber;
};
const calculatePosition = (word) => {
    let numbersFound;
    numbersFound = [
        ...transformStringToNumber(word),
        ...getNumberInString(word),
    ].sort((a, b) => a.index - b.index);
    const finalNumber = +(numbersFound[0].numberFound +
        '' +
        (numbersFound[numbersFound.length - 1].numberFound + ''));
    console.log('calculating number ', word, numbersFound, finalNumber);
    return finalNumber;
};
const response = data01.reduce((acc, e) => acc + calculatePosition(e), 0);
console.log('response: ', response);
