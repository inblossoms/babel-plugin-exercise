/**
 * author: lrx
 * name: 代码生成器
 * decription: 根据转换后的ast来生成新的代码
*/
export const generator = (node) => {
	switch (node.type) {
		// 如果是 `Program` 结点，那么我们会遍历它的 `body` 属性中的每一个结点，并且递归地
		// 对这些结点再次调用 codeGenerator，再把结果打印进入新的一行中。
		case 'Program':
			return node.body.map(generator)
				.join('\n');

		// 如果是FunctionDeclaration我们分别遍历调用其参数数组以及调用其 body 的属性
		case 'FunctionDeclaration':
			return 'function' + ' ' + node.identifierName + '(' + node.params.map(generator) + ')' + ' ' + generator(node.body);

		// 对于 `Identifiers` 我们只是返回 `node` 的 identifierName
		case 'identifier':
			return node.identifierName;

		// 如果是BlockStatement我们遍历调用其body数组
		case 'BlockStatement':
			return '{' + node.body.map(generator) + '}';

		// 如果是ReturnStatement我们调用其 argument 的属性
		case 'ReturnStatement':
			return 'return' + ' ' + generator(node.argument);

		// 如果是ReturnStatement我们调用其左右节点并拼接
		case 'BinaryExpression':
			return generator(node.left) + ' ' + node.operator + ' ' + generator(node.right);

		// 没有符合的则报错
		default:
			throw new TypeError(node.type);

	}
};

