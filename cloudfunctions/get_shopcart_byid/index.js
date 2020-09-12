// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

//获取查询指令引用
var _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  
  try {

    return await db.collection('shopcart').where({
      _id: _.in(event.ids)
    }).get();

  } catch (err) {
    console.log('云函数调用失败 err ==> ', err);
  }

}