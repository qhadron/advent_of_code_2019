// https://adventofcode.com/2019/day/1

// Get the input
const input = await fetch('https://adventofcode.com/2019/day/1/input')
	.then(r => r.text())
	.then(r => r
    .split('\n') // split on new lines
    .filter(x => x) // filter out empty elements
    .map(Number) // convert to number
  );
  

/*
* Part 1: fairly straightforward, just do the calculations
*/
const part1 = input.reduce((acc, cur) => {
  return acc + Math.floor(cur / 3) - 2;
}, 0);

/*
* Part 2: same as part 1, but this time add a while loop
* to collect all the fuel for one mass
*/
const part2 = input.reduce((acc, cur) => {
  do {
    cur = Math.floor(cur / 3) - 2
    if (cur > 0)
      acc += cur;
  } while (cur > 0);
  return acc;
}, 0);

console.log(part1);
console.log(part2);
