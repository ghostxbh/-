/**
 * Created by xbh 2019-07-31 函数编程基础
 */

//创建函数，x为形参
function demo(x) {
    console.log(x);
}
//调用函数，7为实参
demo(7);

/**
 * 普通函数:
 * 对于foo而言，它本身是一个普通的函数，执行的时候会形成私有的作用域，
 * 然后进行形参赋值、预解析、代码执行、执行完成后内存销毁；
 */
function foo() {
    let num = 500;
    this.x = 100;
}

foo.prototype.getX = function () {
    console.log(this.x);
};

foo.aaa = 1000;

/**
 * 类:
 * 它有自己的实例，f就是foo作为类而产生的一个实例，
 * 也有一个叫做prototype的属性是自己的原型，
 * 它的实例都可以指向自己的原型；
 */
var f = new foo;

f.num // undefined
f.aaa // undefined

/**
 * 普通对象:
 * foo和 var obj = {} 中的obj一样，
 * 就是一个普通的对象（所有的函数都是Function的实例），
 * 它作为对象可以有一些自己的私有属性，也可以通过__proto__找到Function.prototype；
 */
var res = foo(); // res是undefined  foo中的this是window

/**
 * call
 */

function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Food(name, price) {
    Product.call(this, name, price);
    this.category = 'food';
}

console.log(new Food('cheese', 5).name);
// expected output: "cheese"

// expected output: 2


/**
 * 深入call()
 * @type {{name: string}}
 */
var obj = {name:'iceman'};
function fn() {
    console.log(this);
    console.log(this.name);
}
fn(); // this --> window
// obj.fn(); // Uncaught TypeError: obj.fn is not a function
fn.call(obj);


function sum(){
    console.log(this);
}
function fn(){
    console.log(this);
}
var obj = {name:'iceman'};
Function.prototype.myCall = function (context) {
    // myCall方法中的this就是当前我要操作和改变其this关键字的那个函数名

    // 1、让fn中的this关键字变为context的值->obj
    // 让this这个函数中的"this关键字"变为context
    // eval(this.toString().replace("this","obj"));

    // 2、让fn方法在执行
    // this();
};
fn.myCall(obj);// myCall方法中原来的this是fn
sum.myCall(obj);// myCall方法中原来的this是sum


/**
 * apply
 */

var numbers = [5, 6, 2, 3, 7];

var max = Math.max.apply(null, numbers);

console.log(max);
// expected output: 7

var min = Math.min.apply(null, numbers);

console.log(min);
// expected output: 2



var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]


/**
 * bind
 */
var module = {
    x: 42,
    getX: function() {
        return this.x;
    }
}

var unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

var boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42

//创建绑定函数
this.x = 9;    // 在浏览器中，this指向全局的 "window" 对象
var module = {
    x: 81,
    getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();
// 返回9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81