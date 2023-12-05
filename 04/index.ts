const data04 = require('fs')
  .readFileSync('input.txt', 'utf8')
  .toString()
  .split('\n')

const separateLines = (line: string) => {
  const list = line.split('|')
  let winningNumbers: string | string[] = list[0]

  winningNumbers = winningNumbers.split(': ')[1]
  winningNumbers = winningNumbers.split(' ').filter((e) => e)

  let listNumbers: string | string[] = list[1]
  listNumbers = listNumbers.split(' ').filter((e) => e)

  return { winningNumbers, listNumbers }
}

function firstTest(data: string[]) {
  const result: number[] = []
  data.forEach((elm) => {
    const { listNumbers, winningNumbers } = separateLines(elm)
    const winningPile = listNumbers.filter(
      (e) => winningNumbers.indexOf(e) > -1
    )
    let wins = winningPile.length
    if (winningPile.length > 1) wins = 2 ** (wins - 1)
    result.push(wins)
  })
  const finalResult = result.reduce((acc, elm) => elm + acc, 0)

  console.log(finalResult)

  return finalResult
}

function secondTest(data: string[]) {
  let initialData = data.map((e, i: number) => ({
    card: i,
    matchings: 1,
  }))

  data.forEach((elem: string, ind) => {
    const { winningNumbers, listNumbers } = separateLines(elem)
    const matchingNumbers = listNumbers.filter(
      (e) => winningNumbers.indexOf(e) > -1
    ).length

    const currentCard = initialData.find((e) => e.card === ind)
    if (!currentCard) return

    if (matchingNumbers === 0) return

    for (let index = 1; index <= matchingNumbers; index++) {
      const nextCardIndex = initialData.findIndex(
        (e) => e.card === index + currentCard.card
      )
      initialData[nextCardIndex].matchings =
        initialData[nextCardIndex].matchings + currentCard.matchings
    }
  })
  console.log(
    'final data ',
    initialData.reduce((acc, elm) => acc + elm.matchings, 0)
  )
}

secondTest(data04)
