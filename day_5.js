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

		if (op == 99)
			break;

		// parse parameters
		switch (op) {
			// 3 argument instructions
			// addition, subtraction
			case 1:
			case 2:
				x = retrieve(memory, memory[pc+1], modes[0]);
				y = retrieve(memory, memory[pc+2], modes[1]);
				// retrieve destination address with immediate mode
				dest = retrieve(memory, memory[pc+3], 1);
				break;
			// input instruction
			case 3:
				// retrieve destination address with immediate mode
				dest = retrieve(memory, memory[pc+1], 1);
				x = input.shift();
				break;
			// output instruction
			case 4:
				x = retrieve(memory, memory[pc+1], modes[0]);
				break;
			default:
				throw new Error(`Unknown op code ${op}`);
		}

		// execute instructions
		switch (op) {
			case 1:
				memory[dest] = x + y;
				pc += 4;
				break;
			case 2:
				memory[dest] = x * y;
				pc += 4;
				break;
			case 3:
				memory[dest] = x;
				pc += 2;
				break;
			case 4:
				output.push(x);
				pc += 2;
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
console.log(part1);
