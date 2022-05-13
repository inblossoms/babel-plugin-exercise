/**
 * author lrx
 * name: parser
 * description: 解析生成ast
*/
export const parser = tokens => {
	// 声明一个全时指针，它会一直存在
	let current = -1;

	// 声明一个暂存栈,用于存放临时指针
	const tem = [];

	// 指针指向的当前token
	let token = tokens[current];

	const parseDeclarations = () => {

		// 暂存当前指针
		setTem();

		// 指针后移
		next();

		// 如果字符为'const'可见是一个声明
		if (token.type === 'identifier' && token.value === 'const') {
			const declarations = {
				type: 'VariableDeclaration',
				kind: token.value
			};

			next();

			// const 后面要跟变量的,如果不是则报错
			if (token.type !== 'identifier') {
				throw new Error('Expected Variable after const');
			}

			// 我们获取到了变量名称
			declarations.identifierName = token.value;

			next();

			// 如果跟着 '=' 那么后面应该是个表达式或者常量之类的,额外判断的代码就忽略了,直接解析函数表达式
			if (token.type === 'operator' && token.value === '=') {
				declarations.init = parseFunctionExpression();
			}

			return declarations;
		}
	};

	const parseFunctionExpression = () => {
		next();

		let init;
		// 如果 '=' 后面跟着括号或者字符那基本判断是一个表达式
		if (
			(token.type === 'parens' && token.value === '(') ||
			token.type === 'identifier'
		) {
			setTem();
			next();
			while (token.type === 'identifier' || token.type === ',') {
				next();
			}

			// 如果括号后跟着箭头,那么判断是箭头函数表达式
			if (token.type === 'parens' && token.value === ')') {
				next();
				if (token.type === 'ArrowFunctionExpression') {
					init = {
						type: 'ArrowFunctionExpression',
						params: [],
						body: {}
					};

					backTem();

					// 解析箭头函数的参数
					init.params = parseParams();

					// 解析箭头函数的函数主体
					init.body = parseExpression();
				} else {
					backTem();
				}
			}
		}

		return init;
	};

	const parseParams = () => {
		const params = [];
		if (token.type === 'parens' && token.value === '(') {
			next();
			while (token.type !== 'parens' && token.value !== ')') {
				if (token.type === 'identifier') {
					params.push({
						type: token.type,
						identifierName: token.value
					});
				}
				next();
			}
		}

		return params;
	};

	const parseExpression = () => {
		next();
		let body;
		while (token.type === 'ArrowFunctionExpression') {
			next();
		}

		// 如果以(开头或者变量开头说明不是 BlockStatement,我们以二元表达式来解析
		if (token.type === 'identifier') {
			body = {
				type: 'BinaryExpression',
				left: {
					type: 'identifier',
					identifierName: token.value
				},
				operator: '',
				right: {
					type: '',
					identifierName: ''
				}
			};
			next();

			if (token.type === 'operator') {
				body.operator = token.value;
			}

			next();

			if (token.type === 'identifier') {
				body.right = {
					type: 'identifier',
					identifierName: token.value
				};
			}
		}

		return body;
	};

	// 指针后移的函数
	const next = () => {
		do {
			++current;
			token = tokens[current]
				? tokens[current]
				: { type: 'eof', value: '' };
		} while (token.type === 'whitespace');
	};

	// 指针暂存的函数
	const setTem = () => {
		tem.push(current);
	};

	// 指针回退的函数
	const backTem = () => {
		current = tem.pop();
		token = tokens[current];
	};

	const ast = {
		type: 'Program',
		body: []
	};

	while (current < tokens.length) {
		const statement = parseDeclarations();
		if (!statement) {
			break;
		}
		ast.body.push(statement);
	}
	return ast;
};


