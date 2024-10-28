/**
 * 用途: 根据ua判断是否为微信环境
 * 返回值：true 是微信环境 false 不是微信环境
 */
export const isWx = (): boolean => {
    const ua: string = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') > -1;
};

/**
 * 高亮标题
 * @param content 必填 需要高亮的文本
 * @param highLight 必填 需要高亮的内容
 * @param color 必填 高亮的颜色 支持16进制、rgb、rgba、英文
 * 示例:
 * <div v-html="highLightTitle('123456', '123', 'red')"></div>
 */
export const highLightTitle = (content: string, highLight: string, color: string): string => {
    const reg = new RegExp(`${highLight}`, 'g');
    return content.replace(reg, `<span style="color:${color}">${highLight}</span>`);
};

/**
 * 获取当月、当年每天的时间戳
 * @param timestamp 必填 时间戳
 * @param unit 选填 输出时间当月or年，year表示输出结果为年份，month表示输出结果为月份
 * 示例:
 * getTimestamps(1727712000000, 'year'); [1727712000000,... ,1727712000000] // 返回当月or年每天的时间戳
 */
export function getTimestamps(timestamp: number, unit: 'year' | 'month' = 'month'): number[] {
    const date = new Date(timestamp);
    let startDate: Date, endDate: Date;
    
    if (unit === 'year') {
        startDate = new Date(date.getFullYear(), 0, 1);
        endDate = new Date(date.getFullYear() + 1, 0, 1);
    } else {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    
    const timestamps: number[] = [];
    for (let d = startDate; d < endDate; d.setDate(d.getDate() + 1)) {
        timestamps.push(d.getTime());
    }
    return timestamps;
}

/**
 * 时间戳转换成日期工具函数
 * @param fmt 必填 目标日期显示格式
 * @param timestamp 必填 时间戳
 * @param type 选填 输出时间是否跟随当前时区，1表示输出结果为当前时区时间，2表示输出结果为北京时区时间
 *  示例:
 * 当前时区为GMT+0800 (中国标准时间)，format('yyyy-MM-dd hh:mm', 1537174760000) ---> 2018-09-17 16:59
 * 当前时区为GMT+0800 (中国标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000) ---> 2018-09-17 16:59:20
 * 当前时区为GMT+0900 (日本标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000) ---> 2018-09-17 17:59:20
 * 当前时区为GMT+0900 (日本标准时间)，format('yyyy-MM-dd hh:mm:ss', 1537174760000, 2) ---> 2018-09-17 16:59:20
 */
export const format = (fmt: string, timestamp: number, type: 1 | 2 = 1): string => {
    const t: number = type === 1 ? timestamp : timestamp + new Date().getTimezoneOffset() * 60000 + 8 * 3600000;
    const date2 = new Date(t);
    
    interface IDateFormat {
        [key: string]: number;
    }
    
    const o: IDateFormat = {
        "M+": date2.getMonth() + 1,
        "d+": date2.getDate(),
        "h+": date2.getHours(),
        "m+": date2.getMinutes(),
        "s+": date2.getSeconds(),
        "q+": Math.floor((date2.getMonth() + 3) / 3),
        "S": date2.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${date2.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? String(o[k]) : (`00${o[k]}`).substr((`${o[k]}`).length)
            );
        }
    }
    return fmt;
};

/**
 * 截取获得页面url特定参数的值
 * 示例: 如url为：xxx?id=12345
 * getUrlParamsString('xxx?id=12345','id') --> 12345
 */
export const getUrlParamsString = (url: string, name: string): string | null => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
    try {
        let hash = new URL(url).hash;
        if (hash) {
            url = url.replace(hash, "");
        }
    } catch (e) {
        // URL parsing error handling
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
 */
export const getCookie = (cname: string): string => {
    const strCookie: string = document.cookie;
    const arrCookie: string[] = strCookie.split("; ");
    
    for (let i = 0; i < arrCookie.length; i++) {
        const arr: string[] = arrCookie[i].split("=");
        if (cname === arr[0]) {
            return arr[1];
        }
    }
    return "";
};

/**
 * 生成uuid
 */
export const uuid = (): string => {
    const s: string[] = [];
    const hexDigits: string = "0123456789abcdef";
    
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((parseInt(s[19], 16) & 0x3) | 0x8, 1);
    
    return s.join("");
};

/**
 * 16进制转rgba
 */
interface RgbaObject {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export const hexToRgba = (
    hex: string,
    opacity: number,
    output: "string" | "obj" = "string"
): string | RgbaObject => {
    const red: number = parseInt("0x" + hex.slice(1, 3));
    const green: number = parseInt("0x" + hex.slice(3, 5));
    const blue: number = parseInt("0x" + hex.slice(5, 7));
    
    if (output === "string") {
        return `rgba(${red},${green},${blue},${opacity})`;
    } else {
        return { red, green, blue, alpha: opacity * 255 };
    }
};