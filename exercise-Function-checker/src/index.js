import { tokenizer } from './tokenizer.js';
import { parser } from './parser.js';
import { transformer } from './transformer.js';
import { generator } from './generator.js';

const compiler = (input) => {
	const tokens = tokenizer(input);
	const ast = parser(tokens);
	const newAst = transformer(ast);
	const output = generator(newAst);

	return output;
};

const str = 'const add = (a, b) => a + b';

const result = compiler(str);

console.log(result);
// function add(a,b) {return a + b}

