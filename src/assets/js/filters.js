/*全局过滤时间戳*/
const dateFilter = (time) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D, h, m, s] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
			dateNumFun(date.getHours()),
			dateNumFun(date.getMinutes()),
			dateNumFun(date.getSeconds())
		]
		return `${Y}-${M}-${D} ${h}:${m}:${s}` // 一定要注意是反引号，否则无效。
	}
};

// time 时间戳 day 明天 +1 昨天 -1 isTime 是否显示 时分秒
const dateFilterChangeDay = (time, day) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		if (day) {
			date.setDate(date.getDate() + day); //day为负表示传入时间之前几天，day为正表示传入时间之后几天
		}
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D, h, m, s] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
			dateNumFun(date.getHours()),
			dateNumFun(date.getMinutes()),
			dateNumFun(date.getSeconds())
		];
		return `${Y}-${M}-${D}` // 一定要注意是反引号，否则无效。
	}
};

const dateFilterChangeHour = (time, hour) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		if (hour) {
			date.setHours(date.getHours() + hour); //hour为负表示传入时间之前几个小时，hour为正表示传入时间之后几个小时
		}
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D, h, m, s] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
			dateNumFun(date.getHours()),
			dateNumFun(date.getMinutes()),
			dateNumFun(date.getSeconds())
		]
		return `${Y}-${M}-${D} ${h}:${m}:${s}` // 一定要注意是反引号，否则无效。
	}
};

const dateFilterSeconds = (time) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D, h, m, s] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
			dateNumFun(date.getHours()),
			dateNumFun(date.getMinutes()),
			dateNumFun(date.getSeconds())
		];
		return `${Y}年${M}月${D}日 ${h}时${m}分${s}秒` // 一定要注意是反引号，否则无效。
	}
};

const dateFilterMinute = (time) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D, h, m] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
			dateNumFun(date.getHours()),
			dateNumFun(date.getMinutes()),
		];
		return `${Y}年${M}月${D}日 ${h}:${m}` // 一定要注意是反引号，否则无效。
	}
};

const dateFilterDay = (time) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
		];
		return `${Y}-${M}-${D}` // 一定要注意是反引号，否则无效。
	}
};

const dateFilterDayCN = (time) => {
	if (!time) { // 当时间是null或者无效格式时我们返回空
		return '';
	} else {
		const date = new Date(time); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		const dateNumFun = (num) => num < 10 ? `0${num}` : num; // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
		// 这是es6的解构赋值。
		const [Y, M, D] = [
			date.getFullYear(),
			dateNumFun(date.getMonth() + 1),
			dateNumFun(date.getDate()),
		];
		return `${Y}年${M}月${D}日` // 一定要注意是反引号，否则无效。
	}
};

// 过滤 所有字符全部替换为 *
const passWordString = (str) => {
	if (str.length > 0) {
		return str.replace(/./gi, '*');
	}
};

export {
	dateFilter,
	dateFilterChangeDay,
	dateFilterChangeHour,
	dateFilterMinute,
	dateFilterSeconds,
	dateFilterDay,
	dateFilterDayCN,
	passWordString
};
