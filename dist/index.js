(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MyLibrary"] = factory();
	else
		root["MyLibrary"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.esm.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.esm.js":
/*!**************************!*\
  !*** ./src/index.esm.js ***!
  \**************************/
/*! exports provided: LogRobot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogRobot", function() { return LogRobot; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LogType = function LogType() {
  _classCallCheck(this, LogType);
};
/**
 * @description 一个日志类
 * @author 069810
 * @date 2018-10-30
 * @class LogRobot
 */


_defineProperty(LogType, "ERROR", 'error');

_defineProperty(LogType, "LOG", 'log');

var LogRobot =
/**
 *Creates an instance of LogRobot.
 * @author 069810
 * @date 2018-11-08
 * @param {object} ops
 * @memberof LogRobot
 */
function LogRobot(ops) {
  _classCallCheck(this, LogRobot);

  this.ops = Object.assign({}, LogRobot.Default, ops); // 存储当前环境所有收集到的日志

  this._allInfos = [];

  this.add = function (ctx, info) {
    var item = {
      context: ctx,
      type: info.logType,
      // log | error
      env: _defineProperty({
        UA: navigator.userAgent,
        network: {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          onLine: navigator.onLine.toString()
        },
        href: location.href,
        time: new Date().toLocaleString()
      }, "time", Date.now()),
      message: info.message,
      name: info.name,
      extraInfo: info.extraInfo
    };
    this.report(item);
  };

  this.report = function (item) {
    ops.uploader.post.call(this, item);
  }; // 日志格式工厂


  this.formatter = {
    // 端上H5的格式
    toOne: function toOne(item) {
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
    toDefault: function toDefault(item) {
      item.context = "";
      item.extraInfo.e = "";
      return JSON.stringify(item);
    }
  };
};

LogRobot.Default = {
  uploader: {
    post: function post(item) {
      console.log(this, item);
    }
  }
};
LogRobot.instance = new LogRobot({
  uploader: {
    domain: "*",
    target: window.parent,
    post: function post(item) {
      var data = {
        type: "errorInfo",
        data: this.formatter.toDefault.call(this, item)
      };
      console.log(this, data, item);
      this.ops.uploader.target.postMessage(data, this.ops.uploader.domain);
    }
  }
});
window.robot = LogRobot;
console.log(LogRobot);


/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map