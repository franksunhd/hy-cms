//校验不能为空
export function isNotNull(rule, value, callback) {
  if (value === '') {
    return callback(new Error('必填项不能为空'));
  }
  setTimeout(function () {
    if (value.toString().split(" ").join("").length == 0) {
      return callback(new Error('必填项不能为空'));
    } else {
      callback();
    }
  }, 0);
}
