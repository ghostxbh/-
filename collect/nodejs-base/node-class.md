## nodejs class
### 类的介绍

+ 创建类

```js
class NodeClass {}
```
+ 构造函数
```js
constructor(x, y) {
    //类变量
    this.x = x;
    this.y = y;
}
```
+ 自定义函数
```js
tostring() {
    return 'x:' + this.x + ',y:' + this.y;
}
```
+ 静态函数
```js
static say(name) {
    this.para = name;
    return 'Hello ' + name;
}
```
+ 静态变量
```js
NodeClass.para = 'developer';
```
+ 调用和输出
```js
//创建示例类demo
let demo = new NodeClass(1, 6);
//调用自定义类函数
console.log(demo.tostring());
//调用类级别下的静态函数
console.log(NodeClass.say('param'));
//调用类级别下的静态变量
console.log(NodeClass.para);

//输出
x:1,y:6
Hello param
param
```