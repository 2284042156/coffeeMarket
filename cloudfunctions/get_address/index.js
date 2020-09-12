// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取数据库引用
var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  var o = {};

  if (event.id) {
    //根据地址id查询地址数据
    o._id = event.id;
  } else {
    //根据用户查询所有地址
    o.userInfo = event.userInfo;
  }

  try {

    return await db.collection('address').where(o).get();

  } catch (err) {
    console.log('云函数调用失败 err ==> ', err);
  }
  
}