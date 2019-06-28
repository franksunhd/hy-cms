// 引入正则
import Api from '../../config/api';
import lang from '../../page/lang/index';

// 校验不能为空
export function isNotNull(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value === '') {
		return callback(new Error(languageNameArr.public.isNotNull));
	}
	setTimeout(function () {
		if (value.toString().split(" ").join("").length == 0) {
			return callback(new Error(languageNameArr.public.isNotNull));
		} else {
			callback();
		}
	}, 0);
}

// 校验不能为空
export function isNotNullVal(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value === '' || value === null) {
		return callback(new Error(languageNameArr.public.isNotNull));
	}
	setTimeout(function () {
		if (value.toString().split(" ").join("").length == 0) {
			return callback(new Error(languageNameArr.public.isNotNull));
		} else {
			callback();
		}
	}, 0);
}

// 校验邮箱地址
export function isEmail(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value === null) {
		return callback();
	}
	if (typeof value === 'string' && value.trim() === '') {
		return callback();
	}
	setTimeout(function () {
		var reg = Api.emailRegular();
		if (reg.test(value) === false) {
			return callback(new Error(languageNameArr.public.emailFormatTip));
		} else {
			return callback();
		}
	});
}

// 校验手机号
export function isMobilePhone(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value === null) {
		return callback();
	}
	if (typeof value === 'string' && value.trim() === '') {
		return callback();
	}
	setTimeout(function () {
		if (value) {
			if (!value.toString().match(Api.mobileRegular())) {
				return callback(new Error(languageNameArr.public.mobileFormatTip));
			} else {
				return callback();
			}
		} else {
			return callback();
		}
	}, 0);
}

// 校验是否是数字
export function isNumber(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (!value) {
		return callback(new Error(languageNameArr.public.isNotNull));
	}
	setTimeout(function () {
		var reg = Api.isNumber();
		if (reg.test(value) == false) {
			return callback(new Error(languageNameArr.public.isNumberFormat));
		} else {
			return callback();
		}
	}, 0);
}

// 校验IP地址
export function isIpNumber(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (!value) {
		return callback(new Error(languageNameArr.public.isNotNull));
	}
	setTimeout(function () {
		var reg = Api.isIpNumber();
		if (reg.test(value) == false) {
			return callback(new Error(languageNameArr.public.ipFormatTip));
		} else {
			return callback();
		}
	}, 0);
}

// 校验IP地址可为空
export function isIpNumbers(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	setTimeout(function () {
		var reg = Api.isIpNumber();
		if (reg.test(value) == false) {
			return callback(new Error(languageNameArr.public.ipFormatTip));
		} else {
			return callback();
		}
	}, 0);
}

// 校验菜单路径
export function isMenuHref(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (!value) {
		return callback(new Error(languageNameArr.public.isNotNull));
	}
	setTimeout(function () {
		var reg = Api.menuHref();
		if (reg.test(value) == false) {
			return callback(new Error(languageNameArr.public.formatTip));
		} else {
			return callback();
		}
	}, 0);
}

// 校验输入的数字是否整型
export function isIntNumber(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value !== null && value.trim() !== '') {
		setTimeout(function () {
			var reg = Api.isNumber();
			if (reg.test(value.trim()) === false) {
				return callback(new Error(languageNameArr.public.isIntegerNumber));
			} else {
				return callback();
			}
		}, 0);
	} else {
		return callback();
	}
}

// 校验输入的数字是否double类型
export function isDoubleNumber(rule, value, callback) {
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value !== null && value.trim() !== '') {
		setTimeout(function () {
			var reg = Api.isDouble();
			if (reg.test(value.trim()) === false) {
				return callback(new Error(languageNameArr.public.isDoubleNumber));
			} else {
				return callback();
			}
		}, 0);
	} else {
		return callback();
	}
}

// 校验金钱
export function isMoneyRule(rule,value,callback) {
	//
	// 获取当前系统的语言
	var language = localStorage.getItem('hy-language');
	var languageNameArr = lang.messages[language];
	if (value !== null && value.trim() !== '') {
		setTimeout(function () {
			var reg =  /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/;
			if (reg.test(value.trim()) === false) {
				return callback(new Error(languageNameArr.public.formatTip));
			} else {
				return callback();
			}
		}, 0);
	} else {
		return callback();
	}
}
