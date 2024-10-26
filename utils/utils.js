/**
 * 用途: 根据ua判断是否为微信环境
 * 返回值：true 是微信环境 false 不是微信环境
 */
const isWx = function () {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') > -1;
};

/**
 * 时间戳转换成日期工具函数
 * @param fmt 必填 目标日期显示格式
 * @param timestamp 必填 时间戳
 * @param type 选填 输出时间是否跟随当前时区，1表示输出结果为当前时区时间，2表示输出结果为北京时区时间， 默认值为1
 *
 * 示例:
 * 当前时区为GMT+0800 (中国标准时间)，format('yyyy-MM-dd hh:mm', 1537174760000) ---> 2018-09-17 16:59
 * 当前时区为GMT+0800 (中国标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000) ---> 2018-09-17 16:59:20
 * 当前时区为GMT+0900 (日本标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000) ---> 2018-09-17 17:59:20
 * 当前时区为GMT+0900 (日本标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000, 2) ---> 2018-09-17 16:59:20
 */
const format = function (fmt, timestamp, type = 1) {
    const t = type === 1 ? timestamp : timestamp + new Date().getTimezoneOffset() * 60000 + 8 * 3600000;
    const date2 = new Date(t);
    const o = {
        "M+": date2.getMonth() + 1,
        "d+": date2.getDate(),
        "h+": date2.getHours(),
        "m+": date2.getMinutes(),
        "s+": date2.getSeconds(),
        "q+": Math.floor((date2.getMonth() + 3) / 3),
        "S": date2.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${date2.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
        }
    }
    return fmt;
};

/**
 * 截取获得页面url特定参数的值
 * 示例: 如url为：xxx?id=12345
 * getUrlParamsString('xxx?id=12345','id') --> 12345
 */
const getUrlParamsString = function (url, name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
    try {
        let hash = new URL(url).hash;
        if (hash)
            url = url.replace(hash, "");
    }
    catch (e) {
    }
    const r = url
        .substring(url.lastIndexOf("?"))
        .substr(1)
        .match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

/**
 * 获取cookie的值，不存在时返回空字符串
 * @param cname
 * @returns {string}
 */
const getCookie = function (cname) {
    const strCookie = document.cookie;
    const arrCookie = strCookie.split("; ");
    for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split("=");
        if (cname === arr[0]) {
            return arr[1];
        }
    }
    return "";
};


/**
 * 生成uuid
 * @returns {String}
 */
const uuid = function () {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    return s.join("");
};
/**
 * 16进制转rgba
 * @param hex 16进制颜色
 * @param opacity 透明度
 * @param output 输出模式，默认string，obj为返回对象结构
 *  */
const hexToRgba = (hex, opacity, output = "string") => {
    let red = parseInt("0x" + hex.slice(1, 3));
    let green = parseInt("0x" + hex.slice(3, 5));
    let blue = parseInt("0x" + hex.slice(5, 7));
    if (output === "string") {
        return `rgba(${red},${green},${blue},${opacity})`;
    }
    else {
        return { red, green, blue, alpha: opacity * 255 };
    }
};

export { isWx, format, getUrlParamsString, getCookie, uuid, hexToRgba };
