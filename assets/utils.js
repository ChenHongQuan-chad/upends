function isPC(){  
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
  var flag = true;  
  for (var v = 0; v < Agents.length; v++) {  
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
  }  
  return flag;  
}
function isMobile(){
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag;
}
const isChinese = function (str) {
    return /^[\u4E00-\u9FA5]+$/.test(str)
}

const validSpecialCharacter = (str) => {
    const valid =
        str === '' ||
        /^[0-9a-z|A-Z|\u4E00-\u9FA5|?|\\|/|$|=|-|_|'|"]+$/.test(str)
    return valid
        ? undefined
        : '只允许大小写字母、中文、下划线、?、\\、/、$、=、-、\'、"'
}
//动态加载脚本
const loadScript = (url) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = url
        document.body.appendChild(script)
        if (script.readyState) {
            // IE
            script.onreadystatechange = function () {
                if (
                    script.readyState === 'loaded' ||
                    script.readyState === 'complete'
                ) {
                    script.onreadystatechange = null
                    resolve()
                } else {
                    reject(new Error('js文件加载失败...'))
                }
            }
        } else {
            // 其他浏览器
            script.onload = function () {
                resolve()
            }
        }
    })
}
/**
 * 给document添加请求资源的script
 * @param {String} url 请求地址
 */
const loadStyle = (url) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
}
Date.prototype.format = function (format) {
    let o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(), //day
        'h+': this.getHours(), //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
        S: this.getMilliseconds(), //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }
    return format
}
//身份证校验
function getIdCardInfo(cardNo) {
    /*
         isTrue: false, // 身份证号是否有效。默认为 false
         year: null,// 出生年。默认为null
         month: null,// 出生月。默认为null
         day: null,// 出生日。默认为null
         isMale: false,// 是否为男性。默认false
         isFemale: false // 是否为女性。默认false
     */
    let [isTrue, year, month, day, isMale, isFemale] = [
        false,
        null,
        null,
        null,
        false,
        false,
    ]

    if (cardNo) {
        const isEven = (n) => n % 2 === 0
        if (18 === cardNo.length) {
            ;[year, month, day] = [
                +cardNo.substring(6, 10),
                +cardNo.substring(10, 12),
                +cardNo.substring(12, 14),
            ]
            const birthday = new Date(year, month - 1, day)
            if (
                birthday.getFullYear() === year &&
                birthday.getMonth() === month - 1 &&
                birthday.getDate() === day
            ) {
                const Wi = [
                    7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1,
                ] // 加权因子
                const Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值.10代表X
                // 验证校验位
                let _cardNo = Array.from(cardNo) // reset: let _cardNo = [...cardNo];
                if (_cardNo[17].toLowerCase() === 'x') {
                    _cardNo[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
                }
                let sum = 0 // 声明加权求和变量
                for (let i = 0; i < 17; i++) {
                    sum += Wi[i] * _cardNo[i] // 加权求和
                }
                const i = sum % 11 // 得到验证码所位置
                if (+_cardNo[17] === Y[i]) {
                    isTrue = true
                    isEven(+cardNo.substring(16, 17))
                        ? (isFemale = true)
                        : (isMale = true)
                }
            }
        }
    }
    if (!isTrue) [year, month, day, isMale, isFemale] = []
    return {
        isTrue,
        year,
        month,
        day,
        isMale,
        isFemale,
    }
}
/**
 * 将各种格式的日期转换成js识别的时间
 * @param {*} time
 */
function parseDate(time) {
    if (!time) {
        return undefined
    }
    let date = null
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    return date
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function renderTime(time, cFormat) {
    let format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date = parseDate(time)
    if (!date) {
        return null
    }
    let formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    }
    let time_str = format.replace(
        /{(y|m|d|h|i|s|a)+}/g,
        function (result, key) {
            let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        }
    )
    return time_str
}
/**
 *
 * @param {String|Number} input 编码内容
 * @returns  编码之后的内容
 */

let keyStr =
    'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '='

function encodeBase64(input) {
    input = Utf8Encode(input)
    let output = ''
    let chr1,
        chr2,
        chr3 = ''
    let enc1,
        enc2,
        enc3,
        enc4 = ''
    let i = 0
    do {
        chr1 = input.charCodeAt(i++)
        chr2 = input.charCodeAt(i++)
        chr3 = input.charCodeAt(i++)
        enc1 = chr1 >> 2
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
        enc4 = chr3 & 63
        if (isNaN(chr2)) {
            enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
            enc4 = 64
        }
        output =
            output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4)
        chr1 = chr2 = chr3 = ''
        enc1 = enc2 = enc3 = enc4 = ''
    } while (i < input.length)

    return output
}
/**
 * 将输入的内容base64编码
 * @param {String} input abcd
 * @returns xxxxx
 */
function decodeBase64(input) {
    let output = ''
    let chr1,
        chr2,
        chr3 = ''
    let enc1,
        enc2,
        enc3,
        enc4 = ''
    let i = 0
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    let base64test = /[^A-Za-z0-9\+\/\=]/g
    if (base64test.exec(input)) {
        alert(
            'There were invalid base64 characters in the input text.\n' +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                'Expect errors in decoding.'
        )
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    do {
        enc1 = keyStr.indexOf(input.charAt(i++))
        enc2 = keyStr.indexOf(input.charAt(i++))
        enc3 = keyStr.indexOf(input.charAt(i++))
        enc4 = keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3)
        }
        chr1 = chr2 = chr3 = ''
        enc1 = enc2 = enc3 = enc4 = ''
    } while (i < input.length)
    return unescape(output)
}
/**
 * 将输入的内容utif8编码
 * @param {String} string abcd
 * @returns xxxxx
 */
function Utf8Encode(string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n)
        if (c < 128) {
            utftext += String.fromCharCode(c)
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192)
            utftext += String.fromCharCode((c & 63) | 128)
        } else {
            utftext += String.fromCharCode((c >> 12) | 224)
            utftext += String.fromCharCode(((c >> 6) & 63) | 128)
            utftext += String.fromCharCode((c & 63) | 128)
        }
    }
    return utftext
}
/**
 * 深拷贝
 * @param {Object} obj 对象
 * @returns 对象
 */
function deepClone(obj) {
    //如果是file，不克隆
    if (typeof obj !== 'object' || obj === null || obj instanceof File)
        return obj
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj) ? [] : {}
    //进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepClone(obj[key])
                } else {
                    objClone[key] = obj[key]
                }
            }
        }
    }
    return objClone
}
/**
 * 深冻结
 * @param {Object} obj 对象
 * @returns 对象
 */
function deepFreeze(obj) {
    // 获取所有属性
    var propNames = Object.getOwnPropertyNames(obj)

    // 遍历
    propNames.forEach((item) => {
        var prop = obj[item]
        // 如果某个属性的属性值是对象，则递归调用
        if (prop instanceof Object && prop !== null) {
            deepFreeze(prop)
        }
    })
    // 冻结自身
    return Object.freeze(obj)
}
/**
 * 数字加逗号处理 -----1,234,567,890.111 ---toThousands(1234567890.111)
 * @param {number}  num 需要处理的数字
 * @returns 处理好的字符串
 */
function toThousands(num) {
    num = (num || 0).toString()
    let re = /\d{3}$/,
        result = ''
    let point = ''
    if (num.indexOf('.') !== -1) {
        point = num.substring(num.indexOf('.'))
        num = parseInt(num)
    }
    while (re.test(num)) {
        result = RegExp.lastMatch + result
        if (num !== RegExp.lastMatch) {
            result = ',' + result
            num = RegExp.leftContext
        } else {
            num = ''
            break
        }
    }
    if (num) {
        result = num + result
    }

    function _(result) {
        return result.replace('-,', '-')
    }

    function __(result) {
        if (result[0] === ',') {
            result = result.substring(1)
        }
        return result
    }

    function ___(result) {
        if (result[0] === '.') {
            result = '0' + result
        }
        return result
    }
    return ___(__(_(result) + point))
}
//对访问路径进行封装 没有name
function getRootUrl() {
    //获取当前网址，如： http://localhost:8083/poseidon-web/demo
    let locationHref = window.document.location.href,
        //获取主机地址之后的目录，如：poseidon-web/demo
        pathName = window.document.location.pathname,
        pathNameInd = locationHref.indexOf(pathName),
        localhostPath = locationHref.substring(0, pathNameInd)
    //获取主机地址，如： http://localhost:9000/
    return `${localhostPath}/`
}
function getBaseUrl() {
    let curWwwPath = window.document.location.href
    let pathName = window.document.location.pathname
    return (
        curWwwPath.substring(0, curWwwPath.indexOf(pathName)) +
        pathName.substring(0, pathName.substr(1).indexOf('/') + 1) +
        '/'
    )
}
/**
 *
 * @param {String} name 参数名称
 * @returns 参数值
 */
function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg) //匹配目标参数
    if (r != null) {
        return unescape(r[2])
    } else {
        return null //返回参数值
    }
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
    function Rad(d) {
        //经纬度转换成三角函数中度分表形式。
        return (d * Math.PI) / 180.0
    }
    let radLat1 = Rad(lat1)
    let radLat2 = Rad(lat2)
    let a = radLat1 - radLat2
    let b = Rad(lng1) - Rad(lng2)
    let s =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) *
                        Math.cos(radLat2) *
                        Math.pow(Math.sin(b / 2), 2)
            )
        )
    s = s * 6378.137 // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 //输出为公里
    return s
}
/**
 * @param {Array} path [[lng,lat],[lng,lat]]二维坐标
 * @returns [lng,lat]中心点
 */
function getCenterPoint(path) {
    let x = 0.0
    let y = 0.0
    for (let i = 0; i < path.length; i++) {
        x = x + parseFloat(path[i][0])
        y = y + parseFloat(path[i][1])
    }
    x = x / path.length
    y = y / path.length
    return [x, y]
}
class OutShow {
    constructor(Vue, actionUrl, condition, formDataOption, total) {
        this.Vue = Vue
        this.actionUrl = actionUrl
        this.condition = condition
        this.formDataOption = formDataOption
        this.total = total
    }
    //通过form导出excel
    formDownload(params) {
        //params是post请求需要的参数，url是请求url地址
        //请求地址
        const form = document.createElement('form')
        form.style.display = 'none'
        form.action = this.actionUrl
        form.method = 'post'
        document.body.appendChild(form)
        for (let key in params) {
            let input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = params[key]
            form.appendChild(input)
        }
        form.submit()
        form.remove()
    }
    convertObjToUrlParam(obj, excludeValues) {
        // 将对象转换为请求路径参数
        let str = ''
        for (let key in obj) {
            if (
                obj[key] &&
                (excludeValues == '' || excludeValues.indexOf(key) == -1)
            ) {
                str += key + '=' + obj[key] + '&'
            }
        }
        return str
    }
    outShow() {
        let searchCondition = this.convertObjToUrlParam(
            this.condition,
            'pageSize'
        )
        if (!this.total) {
            // 当前页
            searchCondition += 'pageSize=' + this.condition.pageSize
        } else {
            // 所有页
            searchCondition += 'pageSize=' + this.total
        }
        let formData = {
            baseUrl: this.formDataOption.baseUrl, //获取待导出数据的请求全路径
            fileName: this.formDataOption.fileName, // 文件名不加后缀
            searchCondition: searchCondition, // 导出数据的查询条件（以请求链接的拼接形式：&xxx=yyy）
            columnsName: encodeURIComponent(this.formDataOption.columnsName), // excel的中文列名 解决特殊符号 % 乱码的问题
            columnsCode: this.formDataOption.columnsCode, // 导出数据中的英文字段名
            dataPath: this.formDataOption.dataPath || 'data-items', // 数据集合的层级路径用'-'分隔
        }
        this.formDownload(formData)
    }
}
//通过form导出excel
function formDownload(url, params) {
    //params是post请求需要的参数，url是请求url地址
    let form = document.createElement('form')
    form.style.display = 'none'
    form.action = url
    form.method = 'post'
    document.body.appendChild(form)
    for (let key in params) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = params[key]
        form.appendChild(input)
    }
    // return
    form.submit()
    form.remove()
}
/**
 *
 * @param {*} text '电费突增户'
 * @param {*} paddingLeftAndRight  文本div的左右padding
 * @param {*} paddingTopAndBottom  文本div的上下padding
 * @param {*} div 是否要指定div，比如指定font-size的div
 * @returns [width,height] // 文本div宽高
 */
function getTextWidthAndHeight(
    text,
    paddingLeftAndRight,
    paddingTopAndBottom,
    div
) {
    let dom = div || document.body,
        span = document.createElement('span')
    // 必须要添加到DOM树里面才有宽度，太狗了。所以对性能应该是有所影响的
    // 如果要优化肯定就在这里优化了，目前我还没有想到解决办法
    span.innerHTML = text
    dom.appendChild(span)
    let result = [
        span.offsetWidth + (paddingLeftAndRight || 0),
        span.offsetHeight + (paddingTopAndBottom || 0),
    ]
    dom.removeChild(span)
    return result
}
function getPIXYRadom(x, y, r, angle) {
    angle = 0 + angle
    const radian = (angle * Math.PI) / 180 //计算角度
    const a = Math.sin(radian) * r //根据三角函数公式计算
    const b = Math.cos(radian) * r //根据三角形函数公式计算
    return [x + a, y - b]
}
/**
 * @param {*} oldStr 旧的字符串
 * @param {*} addItem 需要添加的
 * @param {*} beforeWhich 再那个字符串之前添加
 * @param {*} afterWhich 再那个字符串之后
 * @returns
 */
function addStr(oldStr, addItem, beforeWhich, afterWhich) {
    // 在指定字符串后面添加指定字符串
    if (beforeWhich) {
        let pat = new RegExp(beforeWhich, 'g'),
            result
        while ((result = pat.exec(oldStr)) !== null) {
            oldStr =
                oldStr.slice(0, result.index) +
                addItem +
                oldStr.slice(result.index)
        }
    }
    if (afterWhich) {
        let pat = new RegExp(afterWhich, 'g')
        let result
        while ((result = pat.exec(oldStr)) !== null) {
            oldStr =
                oldStr.slice(0, result.index + result[0].length) +
                addItem +
                oldStr.slice(result.index + result[0].length)
        }
    }
    return oldStr
}
// 自动匹配单位
function unitConvert(num, baseUnit, isIn) {
    function strNumSize(tempNum) {
        var stringNum = tempNum.toString()
        var index = stringNum.indexOf('.')
        var newNum = stringNum
        if (index != -1) {
            newNum = stringNum.substring(0, index)
        }
        return newNum.length
    }
    var moneyUnits = [
        baseUnit,
        '万' + baseUnit,
        '亿' + baseUnit,
        '万亿' + baseUnit,
    ]
    var dividend = 10000
    var currentNum = num
    var currentUnit = moneyUnits[0]
    for (var i = 0; i < 2; i++) {
        currentUnit = moneyUnits[i]
        if (strNumSize(currentNum) < 5) {
            break
        }
    }
    currentNum = currentNum / dividend
    var m = { num: 0, unit: '' }
    if (isIn) {
        m.num = currentNum
        m.unit = currentUnit
    } else {
        m.num = currentNum.toFixed(4)
        m.unit = currentUnit
    }
    return m
}
//echarts双坐标轴对齐
function setAlign(option) {
    function setCeil(param) {
        let f = param >= 0 ? 1 : -1
        param = Math.round(Math.abs(param))
        if (param < 1) return 1 * f
        else if (param < 10) return 10 * f
        else {
            let num = Number((param + '').substring(0, 1))
            return (num + 1) * Math.pow(10, (param + '').length - 1) * f
        }
    }
    function getOnullData(arr) {
        return arr
            .filter(function (e) {
                if (e && typeof e === 'object')
                    return (e.value || e.value == 0) && e.value != '--'
                return e || e == 0
            })
            .map(function (el) {
                return el.value || el
            })
    }
    let options = deepClone(option)
    let fg = options.series.some(function (item) {
        return item.yAxisIndex == 1
    })
    if (fg) {
        let leftData = [],
            rightData = []
        leftData = options.series
            .filter(function (item) {
                return item.yAxisIndex != 1
            })
            .reduce(function (data, el) {
                let e = getOnullData(el.data)
                return [...data, ...e]
            }, [])
        rightData = options.series
            .filter(function (item) {
                return item.yAxisIndex == 1
            })
            .reduce(function (data, el) {
                let e = getOnullData(el.data)
                return [...data, ...e]
            }, [])
        options.yAxis[0].max =
            Math.ceil(setCeil(Math.max.apply(null, leftData)) / 5) * 5 <= 0
                ? 0
                : Math.ceil(setCeil(Math.max.apply(null, leftData)) / 5) * 5
        options.yAxis[0].min =
            Math.ceil(setCeil(Math.min.apply(null, leftData)) / 5) * 5 >= 0
                ? 0
                : Math.ceil(setCeil(Math.min.apply(null, leftData)) / 5) * 5
        options.yAxis[0].interval = Math.ceil(
            (options.yAxis[0].max - options.yAxis[0].min) / 5
        )
        options.yAxis[1].max =
            Math.ceil(setCeil(Math.max.apply(null, rightData)) / 5) * 5 <= 0
                ? 0
                : Math.ceil(setCeil(Math.max.apply(null, rightData)) / 5) * 5
        options.yAxis[1].min =
            Math.ceil(setCeil(Math.min.apply(null, rightData)) / 5) * 5 >= 0
                ? 0
                : Math.ceil(setCeil(Math.min.apply(null, rightData)) / 5) * 5
        options.yAxis[1].interval = Math.ceil(
            (options.yAxis[1].max - options.yAxis[1].min) / 5
        )
    }
    return options
}
//导出文件
const byteStreamFileDownload = (response, filename, type) => {
    // const fileName = decodeURI(response.headers['content-disposition'].split('filename = ')[1]) // 不同情况对应取值不同处理可能不同，以实际情况处理
    const blob = new Blob([response], {
        //默认'text/plain' 类型
        type: type || 'text/plain' + ';charset=utf-8',
    })
    const src = window.URL.createObjectURL(blob)
    if (src) {
        const a = document.createElement('a')
        a.setAttribute('href', src)
        // a.setAttribute('download', fileName)
        a.setAttribute('download', filename || '')
        const event = new MouseEvent('click')
        a.dispatchEvent(event)
    }
}
//导出链接文件
const aDownload = (src) => {
    if (src) {
        const a = document.createElement('a')
        a.setAttribute('href', src)
        // a.setAttribute('download', fileName)
        a.setAttribute('download', filename || '')
        const event = new MouseEvent('click')
        a.dispatchEvent(event)
    }
}
// 获取 function 里的变量
const getParameterNames = (fn) => {
    if (typeof fn !== 'function') return []
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
    var code = fn.toString().replace(COMMENTS, '')
    var result = code
        .slice(code.indexOf('(') + 1, code.indexOf(')'))
        .match(/([^\s,]+)/g)
    return result === null ? [] : result
}

//大小写 转换成 - 拼接
const wordsConcat = (str, concatStr) => {
    concatStr = concatStr || '-'
    let strArray = str.split('')
    let strArrayGet = []
    strArray.forEach((a) => {
        if (a.toUpperCase() === a) {
            console.log(a)
            strArrayGet.push(concatStr)
        }
        strArrayGet.push(a.toLowerCase())
    })
    return strArrayGet.join('')
}
/** - 拼接 转换成 大小写
 * datatag-server  转换  datatagServer
 * @param {String} str  datatag-server
 * @param {String} concatStr '-'
 * @returns  datatagServer
 */
const wordsCase = (str, concatStr) => {
    concatStr = concatStr || '-'
    let strArray = str.split('')
    let strArrayGet = []
    strArray.forEach((a, index) => {
        if (a === concatStr) {
            strArray[index + 1] = strArray[index + 1].toUpperCase()
        } else {
            strArrayGet.push(a)
        }
    })
    return strArrayGet.join('')
}
/**
 *
 * @param {String} val 没有中文
 * @returns true or false
 */
const hadNoChinese = (val) => {
    // 包含空格不全是中文
    if ((val + '').includes(' ')) return true
    let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    if (reg.test(val)) {
        return false
    } else {
        return true
    }
}
/**
 * 获取动态表格的label和prop
 */
function getLabelAndProp(headers) {
    let columnsArr = []
    headers.forEach((item) => {
        if (
            Object.prototype.hasOwnProperty.call(item, 'children') &&
            Array.isArray(item.children)
        ) {
            columnsArr = [...columnsArr, ...getLabelAndProp(item.children)]
        } else {
            columnsArr.push({
                label: item.label,
                prop: item.prop,
            })
        }
    })
    return columnsArr
}
//关闭通过js打开的浏览器页面
function closeWebPage() {
    if (navigator.userAgent.indexOf('MSIE') > 0) {
        if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
            window.opener = null
            window.close()
        } else {
            window.open('', '_top')
            window.top.close()
        }
    } else if (navigator.userAgent.indexOf('Firefox') > 0) {
        window.location.href = 'about:blank '
    } else {
        window.opener = null
        window.open('', '_self', '')
        window.close()
    }
}
