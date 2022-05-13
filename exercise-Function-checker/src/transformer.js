import { traverser } from './traverser.js';
/**
 *  author: lrx
 *  name: 实现代码转换器
*/
export const transformer = (ast) => {

	// 新 ast
	const newAst = {
		type: 'Program',
		body: []
	};

	// 在老 ast 上加一个指针指向新 ast
	ast._context = newAst.body;

	traverser(ast, {
		// 对于变量声明的处理方法
		VariableDeclaration: (node, parent) => {
			let functionDeclaration = {
				params: []
			};
			if (node.init.type === 'ArrowFunctionExpression') {
				functionDeclaration.type = 'FunctionDeclaration';
				functionDeclaration.identifierName = node.identifierName;
			}


			if (node.init.body.type === 'BinaryExpression') {
				functionDeclaration.body = {
					type: 'BlockStatement',
					body: [{
						type: 'ReturnStatement',
						argument: node.init.body
					}],
				};
			}

			parent._context.push(functionDeclaration);
		},

		//对于字符的处理方法
		identifier: (node, parent) => {
			if (parent.type === 'ArrowFunctionExpression') {
				// 忽略我这暴力的操作....领略大意即可..
				ast._context[0].params.push({
					type: 'identifier',
					identifierName: node.identifierName
				});
			}
		}
	});

	return newAst;
};

