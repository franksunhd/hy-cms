// 引入正则
import Api from '../../config/api';

// 校验不能为空
export function isNotNull(rule, value, callback) {
  if (value === '') {
    return callback(new Error('必填项不能为空'));
  }
  console.log()
  setTimeout(function () {
    if (value.toString().split(" ").join("").length == 0) {
      return callback(new Error('必填项不能为空'));
    } else {
      callback();
    }
  }, 0);
}

// 校验邮箱地址
export function isEmail(rule,value,callback) {
  if (!value) {
    return callback(new Error('必填项不能为空'));
  }
  setTimeout(function () {
    var reg = Api.emailRegular();
    if (reg.test(value) === false) {
      return callback(new Error('邮箱格式不正确'));
    } else {
      return callback();
    }
  });
}

// 校验手机号
export function isMobilePhone(rule,value,callback) {
  if (!value) {
    return callback(new Error('必填项不能为空'));
  }
  setTimeout(function () {
    if(value){
      if(!value.toString().match(Api.mobileRegular())){
        return callback(new Error('手机号格式不正确'));
      }else{
        return callback();
      }
    } else {
      return callback();
    }
  },0);
}

// 校验是否是数字
export function isNumber(rule,value,callback) {
  if (!value) {
    return callback(new Error('必填项不能为空'));
  }
  setTimeout(function () {
    var reg = Api.isNumber;
    if (reg.test(value) == false) {
      return callback(new Error('输入不正确只能输入数字!'));
    } else {
      return callback();
    }
  },0);
}

// 校验IP地址
export function isIpNumber(rule,value,callback) {
  if (!value) {
    return callback(new Error('必填项不能为空'));
  }
  setTimeout(function () {
    var reg = Api.isIpNumber();
    if (reg.test(value) == false) {
      return callback(new Error('IP格式不正确,请重新输入!'));
    } else {
      return callback();
    }
  },0);
}
