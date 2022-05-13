/**
 * author: lrx
 * name：遍历器
 * decription: 遍历的方式通过visitor访问ast上的每一个节点，然后根据正对不同的节点用相应的方法做出不同的转换
 * ast：节点对象
 * visitor：本质是一个挂载不同方法的JS对象
*/
export const traverser = (ast, visitor) => {
	// 如果节点是数组那么遍历数组
	const traverseArray = (array, parent) => {
		array.forEach((child) => {
			traverseNode(child, parent);
		});
	};

	// 遍历 ast 节点
	const traverseNode = (node, parent) => {
		const method = visitor[node.type];

		if (method) {
			method(node, parent);
		}

		switch (node.type) {
			case 'Program':
				traverseArray(node.body, node);
				break;

			case 'VariableDeclaration':
				traverseArray(node.init.params, node.init);
				break;

			case 'identifier':
				break;

			default:
				throw new TypeError(node.type);
		}
	};
	traverseNode(ast, null);
};
