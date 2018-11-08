

/**
 * @description 一个日志类
 * @author 069810
 * @date 2018-10-30
 * @class LogRobot
 */


 
class LogRobot{ 

  constructor(ops) {

  }
  // 收集日志信息
  this.infos = [];

  // 收集到的所有日志信息
  this.allInfos = [];

  
  this.add = function(ctx, info) {
    this.infos.push({
      context: ctx,
      level: info.type,
      info: info.extraInfo
    });
    this.report();
  };
  this.report = function() {
    var info = this.infos.shift();
    var data = {
      type: "errorInfo",
      data: this.formatter.toThem.call(this, info)
    };
    window.parent.postMessage(data, "*");
  };
  this.formatter = {
    // 日志格式工厂
    toThem: function(info) {
      // 端上的格式
      var _default = {
        DeviceInfo: navigator.userAgent, // 取navigator.userAgent的值即可
        UserAction: [], // 用户点击次数的字段，课件不传
        NetWorkInfo: navigator.onLine.toString(), // 是否联网,boolean, 取navigator.onLine值即可
        CssPath: "", // 所有css路径 [端上的字段，课件不传]
        ScriptPath: "", // 页面中非监控的js [端上的字段，课件不传]
        ScriptFailPath: "", // 监控加载失败的js [端上的字段，课件不传]
        ScriptSuccessPath: "", // 监控加载成功的js [端上的字段，课件不传]
        Href: window.location.href, // 页面url  取location.href值即可
        Error: "load error", // 只捕获静态资源加载错误，取"load error"
        ErrorFileName: "", // 端上的字段，课件传错误详细信息，可能为错误堆栈信息，错误元素或者错误对象，一般取捕获到的错误事件中event.srcElement对象中的可定位问题字段转为字符串，拼接起来(可定位问题的字段，包括，引起错误对象的类型，比如script,link 以及 XMLHttpRequest中的请求地址，响应码，状态值等)
        Time: new Date().toLocaleString() // 时间
      };

      _default.ErrorFileName = this.getMessage(info);
      _default.Error = info.level;
      return _default;
    }
  };

  this.getMessage = function(info) {
    var msg = "";
    switch (info.level) {
      case "DOM load error":
        msg = [
          "URL: " + info.info.target.src,
          "Error object: " + info.info.target.outerHTML
        ].join("-");
        break;
      case "XMLHttpRequest error":
        msg = [
          "Type: " + info.info.type,
          "URL: " + info.info.target.responseURL,
          "Status: " + info.info.target.status,
          "Status Text: " + info.info.target.statusText
        ].join("-");
        break;
      case "log":
        msg = info.info.type;
        break;
      default:
        msg = typeof info.info === "object" ? info.info.message : info.info;
    }

    return msg;
  };
}
LogRobot.instance = new LogRobot();
// 监测dom资源加载错误
window.addEventListener(
  "error",
  function(e) {
    var eventType = [].toString.call(e, e);
    if (eventType === "[object Event]") {
      LogRobot.instance.add(this, { type: "DOM load error", extraInfo: e });
    }
  },
  true
);
window.onerror = function(msg, url, lineNo, columnNo, error) {
  var string = msg.toLowerCase();
  var substring = "script error";
  var message = [
    "Message: " + msg,
    "URL: " + url,
    "Line: " + lineNo,
    "Column: " + columnNo,
    "Error object: " + JSON.stringify(error)
  ].join(" - ");
  LogRobot.instance.add(this, { type: "runtime error", extraInfo: message });

  return false;
};
document.addEventListener("DOMContentLoaded", function(e) {
  LogRobot.instance.add(this, { type: "log", extraInfo: e });
});
window.onload = function(e) {
  LogRobot.instance.add(this, { type: "log", extraInfo: e });
};
