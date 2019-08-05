/**
 * Created by xbh 2019-08-05 数组去重
 */

/**
 * set去重 排序
 * @type {number[]}
 */
let arr = [1, 22, 5, 20, 5, 22, 44, 88, 23, 7, 60];
arr.sort((a, b) => {
    if (a < b) return -1;
    if (a === b) return 0;
    if (a > b) return 1;
});
console.log(...new Set(arr));//1 5 7 20 22 23 44 60 88

/**
 * reduce数组对象去重
 * reduce对数组中的每一个元素依次执行回调函数，不含数组中未赋值、被删除的元素，回调函数接收四个参数
    callback：执行数组中每个值的函数，包含四个参数
        previousValue AS p：上一次调用回调返回的值，或者是提供的初始值（initialValue）
        currentValue AS c：数组中当前被处理的元素
        index：当前元素在数组中的索引
        array：调用 reduce 的数组
    initialValue：可选，作为第一次调用 callback 的第一个参数。
 * @type {{}}
 */
let hash = {};
function dup(arr, initValue) {
    return arr.reduce(function (p, c, index, arr) {
        hash[c.name] ? '' : hash[c.name] = true && p.push(c);
        return p;
    }, initValue);
}

const dupArr = dup([{name:'zs',age:18},{name:'dd',age:19},{name:'zs'}],[]);

console.log(dupArr);//[ { name: 'zs', age: 18 }, { name: 'dd', age: 19 } ]

/**
 * 参考lodash
 */
//_.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
