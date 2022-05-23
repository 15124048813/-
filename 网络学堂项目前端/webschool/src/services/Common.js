/**
 * @description Common 通用函数封装
 * 2022年1月14日10:29:35
 */
import {ajaxFile} from "@/services/ajax";
import {GET_FILE} from "@/conf/apis";

/**
 * 克隆
 * @param obj
 * @returns {{}}
 */
function cloneObj(obj){
  var newObj = {};
  if (obj instanceof Array) {
    newObj = [];
  }
  for (var key in obj) {
    var val = obj[key];
      //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
    newObj[key] = typeof val === 'object' ? cloneObj(val): val;
   // newObj[key] = typeof val === 'object' ? cloneObj(val): val;
  }
  return newObj;
}

/**
 * 判断相等
 * @param a
 * @param b
 */
function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    var propA = a[propName]
    var propB = b[propName]
    if ((typeof (propA) === 'object')) {
      if (this.isObjectValueEqual(propA, propB)) {
        return true
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    } else { }
  }
  return true
}

/**
 * 图片处理
 * 2022年1月14日18:07:41
 * @param blob ajaxFile的data
 * @param callBack
 */
function toImage(blob,callBack) {
  try {
    return new Promise(function(resolve){
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload =function(){
        resolve(this.result)
      }
    })
  }catch (err){
    throw Error(err)
  }
}

/**
 * blob转based64 字符串
 * 2022年1月16日12:13:09
 * @param blob
 * @param callBack
 */
function encodeBased64(blob,callBack){
  try {
    return new Promise(function(resolve){
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload =function(){
        const list = this.result.split(';base64,')
        resolve(list[1])
      }
    })
  }catch (err){
    throw Error(err)
  }
}

// /**
//  * 处理视频
//  * 2022年1月16日18:04:38
//  * @param blob
//  */
// function toVideo(blob,callBack){
//   try {
//     return new Promise(function(resolve){
//       const reader = new FileReader()
//       reader.readAsDataURL(blob)
//       reader.onload =function(){
//         const list = this.result.split(';base64,')
//         resolve(list[1])
//       }
//     })
//   }catch (err){
//     throw Error(err)
//   }
// }

/**
 * 获取图片
 * 2022年1月15日11:56:27
 * @param path
 */
async function getImageBypath(path){
  return new Promise(async function (resolve) {
    //var data = null
   // if(path!==''){
    try {
      const param = new URLSearchParams()
      if(path==='')
        param.append('fileName','-1')
      //const fileName = path||''
      else
        param.append('fileName', path)
      const data = toImage(await ajaxFile(GET_FILE, 'GET', {}, param))
      resolve(data)
    }catch (err){
      throw Error(err)
    }
   // }
  })
}

/**
 * 获取视频
 * 2022年1月15日12:44:51
 * @param path
 */
async function getVideoByPath(path){
    return new Promise(async function (resolve) {
      //var data = null
      if(path!==''){
        const param = new URLSearchParams()
        param.append('fileName', path)
        const data = await ajaxFile(GET_FILE, 'GET', {}, param)
        const url = URL.createObjectURL(data);
        resolve(url)
      }
    })
}

/**
 * 消息框提示  不好用
 * 2022年1月14日23:13:22
 * @param msg
 */
function popMsg(msg=''){
    alert(msg)
}

/**
 * based64转Blob
 * @param code
 * @returns {Blob}
 */
function base64ToBlob(code) {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: contentType});
}

/**
 * 时间规范化
 * 2022年1月17日16:10:14
 * @param value 秒
 * @param type 显示类型
 */
function formatSeconds(value,type=0){
  var secondTime = parseInt(value); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime >= 60) {
    minuteTime = parseInt(secondTime / 60);
    secondTime = parseInt(secondTime % 60);
    if (minuteTime >= 60) {
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result
  if(type===0) {
    result ="" +(parseInt(secondTime) < 10? "0" + parseInt(secondTime): parseInt(secondTime));
    result ="" + (parseInt(minuteTime) < 10? "0" + parseInt(minuteTime) : parseInt(minuteTime)) + ":" + result;
    result ="" + (parseInt(hourTime) < 10 ? "0" + parseInt(hourTime): parseInt(hourTime)) +":" + result;
  }
  else if(type===1){
    result ="" +(parseInt(secondTime) < 10? "0" + parseInt(secondTime): parseInt(secondTime)) +"s";
    if(minuteTime>0)
      result ="" + (parseInt(minuteTime) < 10? "0" + parseInt(minuteTime) : parseInt(minuteTime)) + "min" + result;
    if(hourTime>0)
      result ="" + (parseInt(hourTime) < 10 ? "0" + parseInt(hourTime): parseInt(hourTime)) +"h" + result;
  }
  return result;
}

export {
  cloneObj,
  isObjectValueEqual,
  toImage,
  popMsg,
  getImageBypath,
  getVideoByPath,
  encodeBased64,
  base64ToBlob,
  formatSeconds
}
