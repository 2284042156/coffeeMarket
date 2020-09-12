// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log('event => ', event);

  try {
    //await: 等待结果返回，必须配合async使用
    //[event.key]: 对象的动态键名
    return await db.collection('product').where({
      [event.key]: event.value
    }).get();
    
  } catch (err) {
    console.log('err ==> ', err);
  }
}