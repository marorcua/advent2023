import fs from 'fs/promises'

const input = await fs.readFile('input.txt', 'utf-8')

const data = input.split(/\n/g)
const times = data[0]
  .split(' ')
  .map(Number)
  .filter((e) => e !== 0 && !isNaN(e))
const distances = data[1]
  .split(' ')
  .map(Number)
  .filter((e) => e !== 0 && !isNaN(e))
console.log('time', times, distances)

function getPossibilities(time: number, distance: number) {
  let wins = 0
  for (let hold = 1; hold < time; hold++) {
    const boatTime = time - hold
    const boatSpeed = hold
    const boatDistance = boatSpeed * boatTime
    if (boatDistance > distance) ++wins
  }
  console.log('wins ', wins)
  return wins
}

const solvePart1 = () => {
  const wins = times.map((e, i) => getPossibilities(e, distances[i]))
  const beats = wins.reduce((acc, elm) => acc * elm, 1)
  console.log('', beats)
  return beats
}

const solvePart2 = () => {
  const time = times.join('')
  const distance = distances.join('')
  console.log('time part 2', +times.join(''))

  const beats = getPossibilities(+time, +distance)
  console.log('', beats)
  return beats
}
solvePart2()
