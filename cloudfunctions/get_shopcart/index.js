// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
 
  try {

    return await db.collection('shopcart').where({
      id: event.id,
      rule: event.rule,
      userInfo: event.userInfo
    }).get();

  } catch (err) {
    console.log('云函数调用失败 err ==> ', err);
  }
  
}