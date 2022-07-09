# Babel-plugin-exercise

更好的学习 Bable，学习理解：自动埋点、自动国际化、生成 API 文档等；

> 最后最终目标实现 手写 Babel 的底层实现：

- parser 篇
- traverse 篇
- generator 篇
- core 篇
- cli 篇

> Babel 的用途： **在 bable7 中，支持了 preset-env，可以指定 target 来进行按需转换**

1. 转译 esnext、typescript、flow 等到目标环境支持的 js；
2. 特定用途的代码转换：
   - babel 作为转译器对外暴露了 api 接口，通过 api 完成代码代 ast 的解析、转换、以及目标代码的生成；
   - 运用场景：函数插装（数据埋点）、自动国际化等等；
3. 代码的静态分析：对代码进行 parse 之后，通过 ast 的结构理解代码进行转换，同样可以用于分析代码的信息，进行检查；
   - linter 工具：分析 ast 结构，对代码规范进行检查；
   - api 文档自动生成工具，可以提取源码中的注释生成文档；
   - type checker：根据从 ast 中提取的或推到的类型信息，对 ast 进行类型检查，以减少运行时类型不一导致错误；
   - 压缩混淆工具：分析代码结构，进行删除死代码、变量混淆、常量折叠等各种编译优化，优化代码的体积和性能；
   - js 解释器：对 ast 的信息进行提取检查之外，可以直接解释执行 ast；

> 编译器和转译器：**一般编译器 Compiler 是之高级语言到低级语言的转换工具，高级语言平级的转换就被叫做：转换编译器（转译器 Transpiler）**

> babel 编译流程：source to source

1. parse：通过 parse 对源码进行 ast 的转换 （计算机并不认识有语法格式组成的字符串，所以理解作为转换的前提就有了第一步的编译）；
2. transform：遍历 ast，调用各种 transform 插件对 ast 进行增删改
3. generate：把转换后的 ast 打印成目标代码，并生成 sourcemap
