// get the input and split into arrays of 2 elements
const input = await fetch('https://adventofcode.com/2019/day/6/input')
	.then(r => r.text())
	.then(r => r.split('\n').filter(x=>x).map(x => x.split(')')));

// The relationships form a tree, since each obect
// can only orbit exactly one object.

// The question asks
// "What is the sum of the levels of the nodes in the tree"
// We can do a traversal along the root(COM) of the tree
// and sum up their levels

// adjacency list
let map = {};
// opposite link (for part 2)
let parents = {};

for (let [x, y] of input) {
	if (! (x in map))
		map[x] = []
	map[x].push(y);
	parents[y] = x;
}


// queue for tree traversal
let q = ['COM'];
// distance array
let d = {'COM' : 0};
// part 1 sum
let part1 = 0;
while (q.length > 0) {
	let cur = q.shift();
	part1 += d[cur];

	if (map[cur]) {
		for (let child of map[cur]) {
			q.push(child);
			d[child] = d[cur] + 1;
		}
	}
}
console.log(`Part 1: ${part1}`);

// for part 2, the question is
// what is the distance from the least common ancestor
// of you and SAN to both of the objects?

// case 1:
// if YOU and SAN are at the same distance from COM
// simply keep going to parent until we find the same node
// the answer is double this distance

// case 2:
// otherwise, say YOU is x further from COM than SAN
// YOU should go to parent x times, then we're back at case 1

let part2 = 0;
// question asks for between object they are orbiting
let you = parents['YOU'];
let san = parents['SAN'];

while (d[you] > d[san]) {
	part2 += 1;
	you = parents[you];
}

while (d[san] > d[you]) {
	part2 += 1;
	san = parents[san];
}

// d[you] == d[san]
while (you != san) {
	part2 += 2;
	san = parents[san];
	you = parents[you];
}

console.log(`Part 2: ${part2}`);
