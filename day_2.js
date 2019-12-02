// get the input

const input = await fetch('https://adventofcode.com/2019/day/2/input')
	.then(r => r.text()) // convert to text
	.then(r => r.split(',').filter(x => x).map(Number));	// convert to numbers
  
// part 1
// idea: execute the program as the question specified
// note: the arguments to the op code are the *location* of the values

// make a copy of the input (so we only fetch once)
// and preprocess it according to the instructions
// noun and verb are from part 2
function preprocess(list, noun = 12, verb = 2) {
	let result = Array.from(list);
  result[1] = noun;
  result[2] = verb;
	return result;
}

function run(program) {
  let pc = 0; // program counter
  while (true) {
    let op = program[pc];
    if (op == 99)
      break;
    let x = program[program[pc+1]];
    let y = program[program[pc+2]];
    let dest = program[pc + 3];
    switch (op) {
      case 1:
        // addition
        program[dest] = x + y;
        pc += 4;
        break;
      case 2:
        // multiplication
        program[dest] = x * y;
        pc += 4;
        break;
    }
  }
  return program[0];
}

const part1 = run(preprocess(input));
console.log(part1);

// part 2
// idea: analyze the program and see what the inputs would be

// The program uses the noun to do some calculations,
// then adds the verb,
// finally adds 1 and stores it to [0]
/*
1,0,0,3, 
1,1,2,3, 
1,3,4,3,
1,5,0,3,
2,6,1,19,  // use of noun: [19] = [6] + noun
// the following lines are some calculations done with the noun
// the destination is the address itself ([23] below is the value 23)
1,5,19,23,
2,9,23,27,
1,6,27,31,
1,31,9,35,
2,35,10,39,
1,5,39,43,
2,43,9,47,
1,5,47,51,
1,51,5,55,
1,55,9,59,
2,59,13,63,
1,63,9,67,
1,9,67,71,
2,71,10,75,
1,75,6,79,
2,10,79,83,
1,5,83,87,
2,87,10,91,
1,91,5,95,
1,6,95,99,
2,99,13,103,
1,103,6,107, 
1,107,5,111,
2,6,111,115,
1,115,13,119,
1,119,2,123,  // [123] = [119] + [2], where [2] is the verb and never written to

// this instruction saves to [0]
// it adds [5] and [123]
// note that [5] is never written to, so [5] = input[5] = 1
1,5,123,0, // [0] = input[5] + [123] = 1 + [119] + [2], where [119] is the result of some operations with the noun
99,
2,0,14,0
*/

// Finally, we have [0] = (1 + some calculations with the noun) + verb
// so for some noun, verb = desired_output - run(preprocess(input, noun, 0))

const desired_output = 19690720;

// since both numbers are in the range [0,99],
// we iterate on the noun, until desired_output - result < 100
let noun, verb;
for (noun = 0; noun < 100; ++noun) {
  let result = run(preprocess(input, noun, 0));
  verb = desired_output - result;
  if (verb < 100)
    break;
}

// check verb and noun are correct
if (run(preprocess(input, noun, verb)) != desired_output)
  console.err("There is no noun and verb combination that gives the desired output!");

const part2 = 100 * noun + verb;
console.log(part2);
