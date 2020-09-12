// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  try {

    //添加收藏商品数据
    return await db.collection('like').add({

      //data: 添加的数据
      data: event
    });

  } catch (err) {
    console.log('云函数调用失败 err ==> ', err);
  }
}