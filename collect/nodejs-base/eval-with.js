/**
 * Created by xbh 2019-08-05
 * 欺骗词法作用域
 * 词法作用域由写代码期间函数所声明的位置来定义，
 * javascript有两种机制(eval()、with)在运行时来修改词法作用域，
 * 这样做通常会导致性能下降，内存泄漏问题。
 */

/**
 * eval调用的str相当于在test函数作用域内部声明了一个新的变量b，
 * 当console.log()在打印时会在foo函数内部找到a和b，
 * 将无法找到外部的a，因此最终输出结果是3和2，
 * 最外层a仍就输出是1，两者比较可以看到效果。
 * @param str
 * @param b
 */
function evalStr(str, b) {
    eval(str);
    console.log(a, b);
}

var a = 1;

evalStr('var a = 3', 2);//3  2

console.log(a); //1

/**
 * 以上示例中withObj(obj)函数接受一个obj参数，
 * 该参数是一个对象引用，执行了with，o1传进去，
 * a=2赋值操作找到了o1.a并将2赋值给它，o2传进去，
 * 因为o2没有a属性，就不会创建这个属性，o2.a保持undefined，
 * 这个时候就会创建一个新的全局变量a。
 * @param obj
 */
function withObj(obj) {
    with (obj) {
        a = 2;
    }
}

let one = {a: 1};

let two = {b: 2};

withObj(one);
console.log(one.a); //2

withObj(two);
console.log(two.a); //undefined
console.log(a); //2

/**
 * 对性能的影响
 * javascript引擎在编译阶段会进行性能优化，很多优化依赖于能够根据代码词法进行静态分析，
 * 预先确定了变量和函数的定义位置，才能快速找到标识符，
 * 但是在词法分析阶段遇到了with或eval无法明确知道它们会接收什么代码，
 * 也就无法判断标识符的位置，最简单的做法就是遇到with或eval不做任何优化，
 * 使用其中一个都会导致代码运行变慢，因此，请不要使用他们。
 */