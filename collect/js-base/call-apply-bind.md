## js的call、apply、bind深入理解

### 函数的三种角色
- 函数本身的属性:
    + ``length``：形参的个数
    + ``name``：函数名
    + ``prototype``：类的原型，在原型上定义的方法都是当前这个类的实例的公有方法
    + ``__proto__``：把函数当做一个普通对象，指向Function这个类的原型
```js
//1
function foo() {
    let num = 500;
    this.x = 100;
}

foo.prototype.getX = function () {
    console.log(this.x);
};

foo.aaa = 1000;
//2
var f = new foo;

f.num // undefined
f.aaa // undefined
//3
var res = foo(); 
```
+ 1、普通函数，对于``foo``而言，它本身是一个普通的函数，执行的时候会形成私有的作用域，然后进行形参赋值、预解析、代码执行、执行完成后内存销毁；

+ 2、类，它有自己的实例，``f``就是``foo``作为类而产生的一个实例，也有一个叫做``prototype``的属性是自己的原型，它的实例都可以指向自己的原型；

+ 3、普通对象，``foo``和`` var obj = {} ``中的 **obj** 一样，就是一个普通的对象（所有的函数都是Function的实例），它作为对象可以有一些自己的私有属性，也可以通过``__proto__``找到``Function.prototype``；

> 图例：

<img src="http://cdn.uzykj.com/2555024-95309047f0e9f13d.png" height="400" width="700"/>

### call

#### 1、介绍
> **MDN**关于的call介绍

>> `call() `方法使用一个指定的` this `值和单独给出的一个或多个参数来调用一个函数。

>> 注意：该方法的语法和作用与` apply() `方法类似，只有一个区别，就是` call() `方法接受的是一个参数列表，而` apply() `方法接受的是一个包含多个参数的数组。

```js
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
```

#### 2、call的基本使用
```js
var ary = [12, 23, 34];
ary.slice();
```

以上两行简单的代码的执行过程为：`ary`这个实例通过原型链的查找机制找到`Array.prototype`上的`slice`方法，让找到的`slice`方法执行，在执行`slice`方法的过程中才把`ary`数组进行了截取。

**注意**：`slice`方法执行之前有一个在原型上查找的过程（当前实例中没有找到，再根据原型链查找）。

```js
var obj = {name:'iceman'};
function fn() {
    console.log(this);
    console.log(this.name);
}
fn(); // this --> window
// obj.fn(); // Uncaught TypeError: obj.fn is not a function
fn.call(obj);
```
**call方法的作用**：首先寻找`call`方法，最后通过原型链在`Function`的原型中找到`call`方法，然后让`call`方法执行，在执行`call`方法的时候，让`fn`方法中的`this`变为第一个参数值`obj`，最后再把`fn`这个函数执行。

#### 3、call方法原理
模拟`Function`中内置的`call`方法，写一个`myCall`方法，探讨`call`方法的执行原理

```js
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

```

当 `fn.myCall(obj)`; 这行代码执行的时候，根据`this`的寻找规律，在`myCall`方法前面有"."，那么`myCall`中的`this`就是`fn`。
执行`myCall`的方法，在第一步会将方法体中`this`换为传入的对象，并且执行原来的`this`，  

**注意**：是执行原来的`this`，在本例中就是执行`fn`。

#### 4、call方法经典例子
```js
function fn1() {
    console.log(1);
}
function fn2() {
    console.log(2);
}
```

> 1、输出一

```js
fn1.call(fn2); // 1
```

首先`fn1`通过原型链查找机制找到`Function.prototype`上的`call`方法，
并且让`call`方法执行，此时`call`这个方法中的`this`就是要操作的fn1。
在`call`方法代码执行的过程过程中，首先让`fn1`中的“this关键字”变为`fn2`，然后再让`fn1`这个方法执行。

**注意**：在执行`call`方法的时候，`fn1`中的`this`的确会变为`fn2`，但是在`fn1`的方法体中输出的内容中并没有涉及到任何和`this`相关的内容，所以还是输出1.

> 2、输出二

```js
fn1.call.call(fn2); // 2
```

首先`fn1`通过原型链找到`Function.prototype`上的`call`方法，然后再让`call`方法通过原型再找到`Function`原型上的`call`（因为`call`本身的值也是一个函数，所以同样可以让`Function.prototype`），
在第二次找到`call`的时候再让方法执行，方法中的`this`是`fn1.call`，首先让这个方法中的`this`变为`fn2`，然后再让`fn1.call`执行。

这个例子有点绕了，不过一步一步来理解。在最开始的时候，`fn1.call.call(fn2)` 这行代码的最后一个`call`中的`this`是`fn1.call`，根据前面的理解可以知道 `fn1.call` 的原理大致为：

```js
Function.prototype.call = function (context) {
    // 改变fn中的this关键字
    // eval(....);
    
    // 让fn方法执行
    this(); // 此时的this就是fn1
};
```


将上面的代码写为另一种形式：

```js
Function.prototype.call = test1;
function test1 (context) {
    // 改变fn中的this关键字
    // eval(....);
    
    // 让fn方法执行
    this(); // 此时的this就是fn1
};
```

我们知道，这两种形式的写法的作用是一样的。那么此时可以将 `fn1.call.call(fn2)`  写成 `test1.call(fn2)` ，`call`中的的`this`就是`test1`：

```js
Function.prototype.call = function (context) {
    // 改变fn中的this关键字
    // eval(....);
    
    // 让fn方法执行
    this(); // 此时的this就是test1
};
```


**注意**：此时`call`中的的`this`就是`test1`。

然后再将`call`中`this`替换为`fn2`，那么`test1`方法变为：

```js
Function.prototype.call = function (context) {
    // 省略其他代码
    
    fn2(); 
};

```

所以最后是fn2执行，所以最后输出2。

### apply
> MDN apply的介绍

>> `apply()` 方法调用一个具有给定`this`值的函数，以及作为一个数组（或类似数组对象）提供的参数。

>> **注意**：`call()`方法的作用和 `apply()` 方法类似，区别就是`call()`方法接受的是参数列表，而`apply()`方法接受的是一个参数数组。

```js
var numbers = [5, 6, 2, 3, 7];

var max = Math.max.apply(null, numbers);

console.log(max);
// expected output: 7

var min = Math.min.apply(null, numbers);

console.log(min);
// expected output: 2
```
#### apply语法
```js
func.apply(thisArg, [argsArray])
```

#### 示例
```js
//用 apply 将数组添加到另一个数组
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

### bind
> MDN关于bind的介绍

>> `bind()`方法创建一个新的函数，在`bind()`被调用时，这个新函数的`this`被`bind`的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。

```js
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
```

#### bind 语法
```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

#### bind 示例
```js
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
```
### call、apply、bind的区别

首先补充严格模式这个概念，这是ES5中提出的，只要写上：

```js
"use strict"
```

就是告诉当前浏览器，接下来的JavaScript代码将按照严格模式进行编写。

```js
function fn() {
    console.log(this);
}
fn.call(); // 普通模式下this是window，在严格模式下this是undefined
fn.call(null); // 普通模式下this是window，在严格模式下this是null
fn.call(undefined); // 普通模式下this是window，在严格模式下this是undefined

//apply方法和call方法的作用是一模一样的，都是用来改变方法的this关键字，并且把方法执行，而且在严格模式下和非严格模式下，对于第一个参数是null/undefined这种情况规律也是一样的，只是传递函数的的参数的时候有区别。
function fn(num1, num2) {
    console.log(num1 + num2);
    console.log(this);
}
fn.call(obj , 100 , 200);
fn.apply(obj , [100, 200]); 

```

`call`在给`fn`传递参数的时候，是一个个的传递值的，而`apply`不是一个个传的，而是把要给`fn`传递的参数值同一个的放在一个数组中进行操作，也相当于一个个的给`fn`的形参赋值。
`bind`方法和`apply、call`稍有不同，`bind`方法是事先把`fn`的`this`改变为我们要想要的结果，并且把对应的参数值准备好，以后要用到了，直接的执行即可，也就是说`bind`同样可以改变`this`的指向，但和`apply、call`不同就是不会马上的执行。

```js
var tempFn = fn.bind(obj, 1, 2);
tempFn();
```

第一行代码只是改变了`fn`中的`this`为`obj`，并且给`fn`传递了两个参数值1、2，但是此时并没有把`fn`这个函数给执行，执行`bind`会有一个返回值，这个返回值`tempFn`就是把`fn`的`this`改变后的那个结果。

**注意**：`bind`这个方法在IE6~8下不兼容。

### 参考资料
[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

[深入call、apply、bind](https://www.jianshu.com/p/00dc4ad9b83f)
### 源码示例
[call-apply-bind](https://github.com/ghostxbh/nodejs-progress/blob/master/collect/js-base/call-apply-bind.js)