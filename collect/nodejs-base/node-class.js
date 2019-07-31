/**
 * Created by xbh 2019-07-31 类
 */
//NodeClass 类
class NodeClass {

    //构造函数
    constructor(x, y) {
        //类变量
        this.x = x;
        this.y = y;
    }

    //自定义函数
    tostring() {
        return 'x:' + this.x + ',y:' + this.y;
    }

    //静态函数
    static say(name) {
        this.para = name;
        return 'Hello ' + name;
    }
}

//静态变量
NodeClass.para = 'developer';

module.exports = NodeClass;


let demo = new NodeClass(1, 6);
console.log(demo.tostring());
console.log(NodeClass.say('param'));
console.log(NodeClass.para);

/**
 x:1,y:6
 Hello param
 param
 */