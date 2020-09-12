// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  
  try {

    return await db.collection('shopcart').add({
      //data: 需要添加的数据
      data: event
    });

  } catch (err) {
    console.log('云函数调用失败 err => ', err);
  }

}