const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

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
]

function getNumberInString(word: string): NumberPosition[] {
  const numbersWithPosition = [{ index: -1, numberFound: 0 }]

  word.split('').forEach((element: string, index: number) => {
    const checkForNumber = +element
    if (checkForNumber)
      numbersWithPosition.push({ index, numberFound: checkForNumber })
  })
  //   const last = number.length - 1
  //   number = number[0] + number[last]
  //   console.log('number', number)

  return numbersWithPosition.filter((e) => e.index !== -1)
}

type NumberPosition = {
  index: number
  numberFound: number
}

const transformStringToNumber = (word: string): NumberPosition[] => {
  function getAllStringNumbers(
    word: string,
    stringNumber: string,
    accumulatedPosition: number,
    accumulatedArray: NumberPosition[]
  ): NumberPosition[] {
    const foundWord = word.indexOf(stringNumber)
    if (foundWord !== -1) {
      accumulatedArray.push({
        index: accumulatedPosition + foundWord,
        numberFound: stringNumbers.indexOf(stringNumber) + 1,
      })
      const newWord = word.slice(foundWord + 1, word.length)

      return getAllStringNumbers(
        newWord,
        stringNumber,
        foundWord + 1 + accumulatedPosition,
        accumulatedArray
      )
    }
    return accumulatedArray
  }

  let existingNumber: NumberPosition[] = stringNumbers.reduce<NumberPosition[]>(
    (acc: NumberPosition[], e, i): NumberPosition[] => {
      const foundWord = word.indexOf(e)
      let numberPositions: NumberPosition[] = []
      if (foundWord !== -1) {
        numberPositions = getAllStringNumbers(word, e, 0, numberPositions)
      }

      return [...acc, ...numberPositions]
    },
    []
  )

  existingNumber = existingNumber.filter((e) => e.index !== -1)
  console.log('getting word ', word, ' existing array: ', existingNumber)

  return existingNumber
}

const calculatePosition = (word: string): number => {
  let numbersFound
  numbersFound = [
    ...transformStringToNumber(word),
    ...getNumberInString(word),
  ].sort((a, b) => a.index - b.index)
  const finalNumber = +(
    numbersFound[0].numberFound +
    '' +
    (numbersFound[numbersFound.length - 1].numberFound + '')
  )

  console.log('calculating number ', word, numbersFound, finalNumber)

  return finalNumber
}

const response = data.reduce(
  (acc: number, e: string) => acc + calculatePosition(e),
  0
)
console.log('response: ', response)
