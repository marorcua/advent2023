const data02 = require('fs')
  .readFileSync('input.txt', 'utf8')
  .toString()
  .split('\n')

const initialGame: InitialGame = {
  red: 12,
  green: 13,
  blue: 14,
}
type InitialGame = {
  red: number
  green: number
  blue: number
}
type GameSets = {
  game: number
  sets: [InitialGame]
}

function organizeGameData(games: string) {
  //first split from ';'
  const splitData = games.split('; ')

  //we resplit in ','
  //3 blue, 2 green
  const gameSets = splitData.map((e) => {
    const completeGame = e.split(', ')
    const sets = completeGame.map((e) => {
      // 3 blue
      const color = e.split(' ')[1]
      const cubes = e.split(' ')[0]
      return { [color]: +cubes }
    })
    return sets
  })
  return gameSets.flat()
}

function extractGameNumber(gameName: string) {
  const gameNumber = gameName.split('Game ')[1]
  return +gameNumber
}

function compareSets(sets: InitialGame[]) {
  const gamesNotSuccessful = sets.reduce((acc: boolean, elm: InitialGame) => {
    const color = Object.keys(elm) as Array<keyof InitialGame>
    if (initialGame[color[0] as keyof InitialGame] < elm[color[0]]) return false
    return acc
  }, true)

  return gamesNotSuccessful
}

function calculateMinimumSets(sets: InitialGame[]) {
  const minimumSets = sets.reduce(
    (acc: InitialGame, elm: InitialGame) => {
      const color = Object.keys(elm)[0] as keyof InitialGame
      let minimumBoxes = elm[color]
      if (acc[color] && acc[color] > elm[color]) return acc
      acc[color] = minimumBoxes
      return acc
    },
    { red: 0, green: 0, blue: 0 }
  )

  return minimumSets
}

function resolveSecondPuzzle(data: string[]) {
  //first the number of the game:
  const gameData = data.map((e: string, i: number) => {
    const gameSets = e.split(': ')

    return {
      game: extractGameNumber(gameSets[0]),
      sets: organizeGameData(gameSets[1]),
    }
  })

  //   let notSuccessfuls =[]
  //FIRST STAR
  //   const successfuls = gameData.reduce((acc, e) => {
  //     const { game, sets } = e
  //     const isPossible = compareSets(sets)

  //     if (isPossible) acc.push(game)
  //     return acc
  //   }, [])
  //   console.log('successful:', successfuls.reduce((acc, elm) => acc + elm, 0))

  //SECOND STAR
  const minimumSets = gameData.reduce((acc: number, e: GameSets) => {
    const { sets } = e

    const set: InitialGame = calculateMinimumSets(sets)
    const power: number = Object.values(set).reduce(
      (acc: number, elm: number): number => {
        if (typeof elm !== 'number') return acc
        return elm * acc
      },
      1
    )

    return acc + power
  }, 0)

  return minimumSets
}

const result = resolveSecondPuzzle(data02)
console.log('result ', result)
