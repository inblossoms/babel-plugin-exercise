/**
 * author: lrx
 * name: tokenizer
 * decription: 词法分析器，接收字符串返回的token数组
*/

// 词法分析器,接收字符串返回token数组
export const tokenizer = (code) => {

	// 储存 token 的数组
	const tokens = [];

	// 指针
	let current = 0;

	while (current < code.length) {
		// 获取指针指向的字符
		const char = code[current];

		// 我们先处理单字符的语法单元 类似于`;` `(` `)`等等这种
		if (char === '(' || char === ')') {
			tokens.push({
				type: 'parens',
				value: char,
			});

			current++;

			continue;
		}

		// 我们接着处理标识符,标识符一般为以字母、_、$开头的连续字符
		if (/[a-zA-Z\$\_]/.test(char)) {
			let value = '';
			value += char;
			current++;

			// 如果是连续字那么将其拼接在一起,随后指针后移
			while (/[a-zA-Z0-9\$\_]/.test(code[current]) && current < code.length) {
				value += code[current];
				current++;
			}

			tokens.push({
				type: 'identifier',
				value,
			});

			continue;
		}


		// 处理空白字符
		if (/\s/.test(char)) {
			let value = '';
			value += char;
			current++;

			//道理同上
			while (/\s]/.test(code[current]) && current < code.length) {
				value += code[current];
				current++;
			}

			tokens.push({
				type: 'whitespace',
				value,
			});

			continue;
		}


		// 处理逗号分隔符
		if (/,/.test(char)) {

			tokens.push({
				type: ',',
				value: ',',
			});

			current++;
			continue;
		}

		// 处理运算符
		if (/=|\+|>/.test(char)) {
			let value = '';
			value += char;
			current++;

			while (/=|\+|>/.test(code[current])) {
				value += code[current];
				current++;
			}

			// 当 = 后面有 > 时为箭头函数而非运算符
			if (value === '=>') {
				tokens.push({
					type: 'ArrowFunctionExpression',
					value,
				});
				continue;
			}

			tokens.push({
				type: 'operator',
				value,
			});

			continue;
		}

		// 如果碰到我们词法分析器以外的字符,则报错
		throw new TypeError('I dont know what this character is: ' + char);
	}

	return tokens;
};

