import axios from 'axios';
import Qs from 'qs';

var root = "http://127.0.0.1/web";   //正式环境
// var root = "http://192.168.0.107:8080/";   //测试环境内网

function apiAxios(method, url, token, params, success) {
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: true,  // cookie
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'token': token || '',
      Authorization: token
    },
    paramsSerializer: function (params) {
      return Qs.stringify(params, {arrayFormat: 'indices'});
    }
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
  get: function (url, token, params, success) {
    return apiAxios('GET', url, token, params, success);
  },
  // 修改
  post: function (url, token, params, success) {
    return apiAxios('POST', url, token, params, success);
  },
  // 更新
  put: function (url, token, parmas, success) {
    return apiAxios('PUT', url, token, parmas, success);
  },
  // 删除
  delete: function (url, token, params, success) {
    return apiAxios('DELETE', url, token, params, success);
  }
}
