
class LogType {
  static ERROR = 'error'
  static LOG = 'log' 
}
/**
 * @description 一个日志类
 * @author 069810
 * @date 2018-10-30
 * @class LogRobot
 */
class LogRobot { 
  
  /**
   *Creates an instance of LogRobot.
   * @author 069810
   * @date 2018-11-08
   * @param {object} ops
   * @memberof LogRobot
   */
  constructor(ops) {
     
    this.ops = Object.assign({}, LogRobot.Default, ops)
    
    // 存储当前环境所有收集到的日志
    this._allInfos = [];

    this.add = function(ctx, info) {
      var item = { 
        context: ctx, 
        type: info.logType, // log | error
        env: {
          UA: navigator.userAgent,
          network: {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            onLine: navigator.onLine.toString(),
          },
          href: location.href,
          time: new Date().toLocaleString(),
          time: Date.now()
        },
        message: info.message,
        name: info.name,
        extraInfo: info.extraInfo
      }
      this.report(item);
    };

    this.report = function(item) {
      ops.uploader.post.call(this, item);
    };

    // 日志格式工厂
    this.formatter = { 
      // 端上H5的格式
      toOne: function(item) {
        var _default = {
          DeviceInfo: item.env.UA,
          UserAction: [],
          NetWorkInfo: item.env.network.onLine,
          CssPath: "",
          ScriptPath: "",
          ScriptFailPath: "",
          ScriptSuccessPath: "",
          Href: item.env.href,
          Error: item.name,
          ErrorFileName: item.message + "" + item.extraInfo.toString(),
          Time: item.env.time
        }; 
        return _default;
      },
      toDefault: function(item) {
        item.context = ""
        item.extraInfo.e = ""
        return JSON.stringify(item)
      }
    };
    
  }
}

LogRobot.Default = {
  
  uploader: {
    post: function(item) {
      console.log(this, item)
    }
  }
};

LogRobot.instance = new LogRobot({
  uploader: {
    domain: "*",
    target: window.parent,
    post: function (item){
      var data = {
        type: "errorInfo",
        data: this.formatter.toDefault.call(this, item)
      };
      console.log(this, data, item)
      this.ops.uploader.target.postMessage(data, this.ops.uploader.domain);
    }
  }
});
window.robot = LogRobot
console.log(LogRobot)
export { LogRobot };
