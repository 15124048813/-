import {Message} from "element-ui";
/**
 * 消息弹窗函数
 * @param msg
 * @param type
 */
function popMsg (msg='',type=''){
  if(type===''){
    Message(msg)
  }
  else if(type==='error'){
    Message.error(msg)
  }
  else {
    Message({
      message:msg,
      type:type
    })
  }
}

/**
 *
 */

export default {
  popMsg
}
