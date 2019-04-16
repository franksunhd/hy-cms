import axios from 'axios';

var root = "http://127.0.0.1/web";   //正式环境
// var root = "http://192.168.0.9/webapi";   //测试环境内网

function apiAxios(method, url, params, success) {
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,  // cookie
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'token': localStorage.getItem('hy-token') || '',
    },
  }).then(function(res) {
    if (success) {
      success(res.data);
    }
  }).catch(function(err) {
    // alert(err);
    return;
  });
}

// 返回在vue模板中的调用接口
export default {
  // 查询
  get: function (url, params, success) {
    return apiAxios('GET', url, params, success);
  },
  // 修改
  post: function (url, params, success) {
    return apiAxios('POST', url, params, success);
  },
  // 更新
  put: function (url, parmas, success) {
    return apiAxios('PUT', url, parmas, success);
  },
  // 删除
  delete: function (url, params, success) {
    return apiAxios('DELETE', url, params, success);
  }
}
