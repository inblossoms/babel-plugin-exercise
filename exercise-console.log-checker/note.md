> 在实现接下来的案例前，我们来了解一下前置知识：

AST 是有标准的，JS parser 的 AST 大多是 estree 标准。
AST 是对源码的抽象，字面量、标识符、表达式、语句、语法模块、class 语法都有搁置的 AST。

1. literal：字面量（字面意义）。
   编码中的字面量很多编辑 .vscode/launch.json 配置，babel 便是通过...Literal 来抽象这部分内容的。

   - 'asdf'：StringLiteral
   - `asdf`：TemplateLiteral
   - 1234：NumberLiteral
   - /^[a-z]+/：RegExpLiteral
   - True：BooleanLiteral
   - 1.43252345n：BigintLiteral
   - null：NullLiteral
   - ...

2. Identifier：标识符。
   变量名、属性名、参数名等各种声明和引用的名字，都是属于 identifier。

   - `const name = 'asdfasf'`中，name 是变量名；
   - `function say(name){ console.log(name) }`中，say 是函数声明，（）中的 name 是参数名，函数体内部的语句`console.log(name)`也属于标识符；
   - `const obj = {name: 'asdfasdf'}`

3. Statement：语句（代码是由语句组成的）。
   一般通过 ；进行间隔来表示一条语句的结束，常见的执行、循环语句，声明语句、表达式语句等。

   - break;
   - continue;
   - return;
   - debugger;
   - throw Error();
   - {}：`BlockStatement`
   - try {} catch(e) {} finally{}
   - for (let key in obj) {}
   - for (let i = 0;i < 10;i ++) {}
   - while (true) {}
   - do {} while (true)
   - switch (v){case 1: break;default:;}
   - label: console.log(); `LabelStatement`
   - with (a){i} `WithStatement`

4. Declaration：声明语句。
   它的执行逻辑是在作用域中声明一个变量、函数、class、import、export 等。

   - const a = 1;
   - function b(){}
   - class C {}
   - import d from 'e';
   - export default e = 1;
   - export {e};
   - export \* from 'e';

5. Expression：表达式。
   相对于和语句的区别在于，表达式再执行后会有返回值。

   - [1, 2, 3]
   - a = 1
   - 1 + 2 二元表达式
   - -1;
   - function(){};
   - () => {};
   - class{};
   - a;
   - this;
   - super; Super：super
   - a::b; BindExpression：绑定表达式

6. Tip

   1. 作为语句执行的表达式：
      `eg：a = 1`，表达式作为语句执行时，解析出的 AST 会被包裹一层 ExpressionStatement 节点，代表这个表达式是被当成语句执行的。
      ExpressionStatement - AssignmentExpression - Identifier - NumberLiteral。
   2. Class 具有独有的 AST 解析节点。整个 class 的内容是 ClassBody，属性是 ClassProperty，方法是 ClassMethod（通过 kind 属性来区分是 constructor 还是 method）。

7. 模块化语法：
   1. Modules 语法级别的模块化规范，具有独有的 AST 节点；
   2. import 导入有三种语法规则：3 种语法都对应 ImportDeclaration 节点，但是 specifiers 属性不同，分别对应 ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier。
      - named import: `import { c, d } form 'c.file'`
      - default import: `import defaultName form 'target.file`
      - namespaced import: `import * as namespaced form 'target.file'`
   3. export 导出的三种语法规范：3 种语法都对应 ExportSpecifler 节点，但是 specifiers 属性不同，分别对应 ExportNamedDeclaration、ExportDefaultDeclaration、ExportAllDeclaration 的 AST。
      - named export: `export {x, y}`
      - default export: `export default a`
      - all export: `export * from 'f.file'`
   4. Program & Directive：program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放 Directive 节点，比如"use strict" 这种指令会使用 Directive 节点表示。**Program 是包裹具体执行语句的节点，而 Directive 则是代码中的指令部分。**
   5. File & Comment：babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。

> **AST 的公共属性**

每一种 AST 都有自己的属性，但是他们也有一些公共的属性

1. `type`：AST 节点的类型；
2. `start end loc`：start、end 代表接地那在源码中的开始和结束下标。loc 属性是一个对象，有 line、column 属性分别近路开始和借宿的行列号
3. `leadingComment innerComment trailingComments`：表示开始、中间、结尾的注释，每一个 AST 节点中都可能存在注释，且可能在这三种中不同的位置，我们通过这三个属性拿到 AST 的注释。
4. `extra`：记录一些额外的信息，用于处理特殊情况。例如 StringLiteral 的 value 只是值的修改，而修改 `extra.raw` 则可以连同引号一起修改。
