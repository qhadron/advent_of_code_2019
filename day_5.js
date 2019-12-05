// get the input

const input = await fetch('https://adventofcode.com/2019/day/5/input')
	// convert to text
	.then(r => r.text())
	// convert to numbers (filter to remove empty values)
	.then(r => r.split(',').filter(x => x).map(Number));

// part 1
// idea: execute the program as the question specified
// note: the op code needs to be parsed differently

// decodes an integer instruction
function decode(instruction) {
	let result = {};

	// DE: right 2 digits
	result.op = instruction % 100;
	instruction = Math.floor(instruction / 100);

	// modes of the 3 parameters
	result.modes = [0, 0, 0];
	for (let i = 0; instruction > 0;) {
		result.modes[i] = instruction % 10;
		instruction = Math.floor(instruction / 10);
		i += 1;
	}

	return result;
}

// retrieves a value, given a mode
// mode 0 is position mode
// mode 1 is immediate mode
function retrieve(program, param, mode) {
	switch(mode) {
		case 0:
			return program[param];
		case 1:
			return param;
	}
	throw new Error(`Unknown mode ${mode}`);
}

// execute the program (without modification)
// input is an array of integers (the inputs)
function run(program, input) {
	// copy of the program
	let memory = Array.from(program);

	// outputs
	let output = [];

	// program counter
	let pc = 0;

	// used as parameter values
	let x, y, dest;

	while (true) {
		// decode instruction
		let {op, modes} = decode(memory[pc]);
		++pc;

		if (op == 99)
			break;

		// parse parameters
		switch (op) {
			// 3 argument instructions
			// addition, subtraction
			case 1:
			case 2:
				x = retrieve(memory, memory[pc++], modes[0]);
				y = retrieve(memory, memory[pc++], modes[1]);
				// retrieve destination address with immediate mode
				dest = retrieve(memory, memory[pc++], 1);
				break;
			// input instruction
			case 3:
				x = input.shift();
				// retrieve destination address with immediate mode
				dest = retrieve(memory, memory[pc++], 1);
				break;
			// output instruction
			case 4:
				x = retrieve(memory, memory[pc++], modes[0]);
				break;
			// 2 argument if instructions
			// jump-if-true, jump-if-false
			case 5:
			case 6:
				x = retrieve(memory, memory[pc++], modes[0]);
				y = retrieve(memory, memory[pc++], modes[1]);
				break;
			// 3 argument if instructions
			// less-than,equals
			case 7:
			case 8:
				x = retrieve(memory, memory[pc++], modes[0]);
				y = retrieve(memory, memory[pc++], modes[1]);
				// retrieve destination address with immediate mode
				dest = retrieve(memory, memory[pc++], 1);
				break;
			default:
				throw new Error(`Unknown op code ${op}`);
		}

		// execute instructions
		switch (op) {
			// addition
			case 1:
				memory[dest] = x + y;
				break;
			// subtraction
			case 2:
				memory[dest] = x * y;
				break;
			// read input
			case 3:
				memory[dest] = x;
				break;
			// output
			case 4:
				output.push(x);
				break;
			// jump-if-true
			case 5:
				if (x !== 0)
					pc = y;
				break;
			// jump-if-false
			case 6:
				if (x == 0)
					pc = y;
				break;
			// less than
			case 7:
				if (x < y)
					memory[dest] = 1;
				else
					memory[dest] = 0;
				break;
			// equals
			case 8:
				if (x == y)
					memory[dest] = 1;
				else
					memory[dest] = 0;
				break;
		}
	}
	return {output, memory};
}

// some tests
run([1101,100,-1,4,0], [1]);
run([1002,4,3,4,33], [1]);

// run program with input of single 1
const part1 = run(input, [1]).output.pop();
console.log(`Part 1: ${part1}`);

const part2 = run(input, [5]).output.pop();
console.log(`Part 2: ${part2}`);
