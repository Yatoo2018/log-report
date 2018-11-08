# 前端错误监控

> 如果debug是移除bug的流程，那么编程就一定是将bug放进去的流程。
> 如果没有用户反馈问题，那就代表我们的产品棒棒哒，对不对？

## 前端异常类型(Execption)

### [WebIDL](https://heycam.github.io/webidl/#idl-exceptions)和[ecma-262](https://tc39.github.io/ecma262/#sec-native-error-types-used-in-this-standard)中的错误类型

- [ECMAScript exceptions](https://tc39.github.io/ecma262/#sec-native-error-types-used-in-this-standard)  <==> [IDL 的简单异常](https://heycam.github.io/webidl/#dfn-simple-exception)
  
  当脚本代码运行时发生的错误，会创建Error对象，并将其抛出，除了通用的Error构造函数外，以下是另外几个ECMAScript 2015中定义的错误构造函数。
  - __EvalError__ eval错误
  - __RangeError__ 范围错误
  - __ReferenceError__ 引用错误
  - __TypeError__ 类型错误
  - __URIError__ URI错误
  - __SyntaxError__ 语法错误 (这个错误WebIDL中故意省略，保留给ES解析器使用)
  - __Error__ 通用错误 （这个错误WebIDL中故意省略，保留给开发者使用使用）
  
- [DOMException](https://heycam.github.io/webidl/#idl-DOMException) 最新的DOM规范定义的的错误类型集，兼容旧浏览的DOMError接口, 完善和规范化DOM错误类型。
  - __IndexSizeError__ 索引不在允许的范围内
  - __HierarchyRequestError__ 节点树层次结构是不正确的。
  - __WrongDocumentError__ 对象是错误的
  - __InvalidCharacterError__ 字符串包含无效字符。
  - __NoModificationAllowedError__ 对象不能被修改。
  - __NotFoundError__ 对象不能在这里被找到。
  - __NotSupportedError__ 不支持的操作
  - __InvalidStateError__ 对象是一个无效的状态。
  - __SyntaxError__ 字符串不匹配预期的模式
  - __InvalidModificationError__ 对象不能以这种方式被修改
  - __NamespaceError__ 操作在XML命名空间内是不被允许的
  - __InvalidAccessError__ 对象不支持这种操作或参数。
  - __TypeMismatchError__ 对象的类型不匹配预期的类型。
  - __SecurityError__ 此操作是不安全的。
  - __NetworkError__ 发生网络错误
  - __AbortError__ 操作被中止
  - __URLMismatchError__ 给定的URL不匹配另一个URL。
  - __QuotaExceededError__ 已经超过给定配额。
  - __TimeoutError__ 操作超时。
  - __InvalidNodeTypeError__ 这个操作的 节点或节点祖先 是不正确的
  - __DataCloneError__ 对象不能克隆。

## 前端错误异常按照捕获方式分类

- [x] 运行时错误
  - 语法错误
- [x] 资源加载错误
  - img
  - script
  - link
  - audio
  - video
  - iframe
  - ...外链资源的DOM元素
- [x] 异步请求错误
  - XMLHttpRequest
  - fetch
- [x] Promise错误
- [ ] ~~CSS中资源错误~~
  - @font-face
  - background-image
  - ...暂时无法捕获

## 前端错误异常的捕获方式

- try-catch (ES提供基本的错误捕获语法)
  - 只能捕获同步代码的异常
  - ~~回调~~
  - ~~setTimeout~~
  - ~~promise~~
- window.onerror = cb (DOM0)
  - img
  - script
  - link
- window.addEventListener('error', cb, true) (DOM2)
- window.addEventListener("unhandledrejection", cb) (DOM4)
- Promise.then().catch(cb)
- 封装XMLHttpRequest&fetch | 覆写请求接口对象

### try-catch-finally

将能引发错误的代码块放到try中，并对应一个响应，然后有异常会被捕获
```JavaScript
  try {
    // 模拟一段可能有错误的代码
    throw new Error("会有错误的代码块")
  } catch(e){
    // 捕获到try中代码块的错误得到一个错误对象e，进行处理分析
    report(e)
  } finally {
    console.log("finally")
  }
```

### onerror事件

#### window.onerror

当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的事件，并执行window.onerror()

```js
/**
 * @description 运行时错误处理器
 * @param {string} message 错误信息
 * @param {string} source 发生错误的脚本URL
 * @param {number} lineno 发生错误的行号
 * @param {number} colno 发生错误的列号
 * @param {object} error Error对象
 */
function err(message,source,lineno,colno,error) {...}
window.onerror = err
```

#### element.onerror

当一项资源（如`<img>`或`<script>`）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。

```js
element.onerror = function(event) { ... } //注意和window.onerror的参数不同
```

注意：这些error事件不会向上冒泡到window，不过能被单一的window.addEventListener捕获。

#### window.addEventListener

#### addEventListener相关的一些内容

W3C DOM2 [Events](http://www.w3.org/TR/DOM-Level-2-Events)规范中提供的注册事件监听器的方法, 在这之前均使用
`el.onclick`的形式（DOM0 规范的基本内容，几乎所有浏览器都支持）。

注意： [接口的几种语法](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

#### error事件捕获资源加载错误

资源加载失败，不会冒泡，但是会被addEventListener捕获，所以我们可以指定在加载失败事件的捕获阶段捕获该错误。

注意: 接口同时也能捕获运行时错误。

```js
window.addEventListener("error", function(e) {
    var eventType = [].toString.call(e, e);
    if (eventType === "[object Event]") { // 过滤掉运行时错误
      // 上报加载错误
      report(e)
    }
  },
  true
);
```

#### unhandledrejection事件捕获Promise异常

最新的规范中定义了 unhandledrejection事件用于全局捕获promise对象没有rejection处理器时异常情况。

```js
window.addEventListener("unhandledrejection", function (event) {
    // ...your code here to handle the unhandled rejection...

    // Prevent the default handling (error in console)
    event.preventDefault();
});
```

### Promise.then().catch(cb).finally()

Promise中的错误会被Promise.prototype.catch捕获，所以我们通过这种方式捕获错误，这包括一些不支持unhandledrejection事件的环境中promisede polyfill实现。

```js
new Promise(function(resolve, reject) {
  throw 'Uncaught Exception!';
}).catch(function(e) {
  console.log(e); // Uncaught Exception!
});
```

### 封装XMLHttpRequest&fetch | 覆写请求接口对象

```js
// 覆写XMLHttpRequest API
if(!window.XMLHttpRequest) return;
  var xmlhttp = window.XMLHttpRequest;
  var _oldSend = xmlhttp.prototype.send;
  var _handleEvent = function (event) {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        report(event)
      }
  }
  xmlhttp.prototype.send = function () {
      if (this['addEventListener']) {
          this['addEventListener']('error', _handleEvent);
          this['addEventListener']('load', _handleEvent);
          this['addEventListener']('abort', _handleEvent);
          this['addEventListener']('close', _handleEvent);
      } else {
          var _oldStateChange = this['onreadystatechange'];
          this['onreadystatechange'] = function (event) {
              if (this.readyState === 4) {
                  _handleEvent(event);
              }
              _oldStateChange && _oldStateChange.apply(this, arguments);
          };
      }
      return _oldSend.apply(this, arguments);
  }

// 覆写fetch API
if (!window.fetch) return;
var _oldFetch = window.fetch;
window.fetch = function() {
  return _oldFetch
    .apply(this, arguments)
    .then(function(res){
      if (!res.ok) {
        // True if status is HTTP 2xx
        report(res)
      }
      return res;
    })
    .catch(function(error){
      report(res)
    });
}

```

## 错误上报的方式

- 异步请求上报, 后端提供接口，或者直接发到日志服务器
- img请求上报, url参数带上错误信息
  - `eg:(new Image()).src = 'http://baidu.com/tesjk?r=tksjk'`

### 注意跨源脚本错误

当加载自不同域的脚本中发生语法错误时，为避免信息泄露，语法错误的细节将不会报告，而代之简单的 "Script error."

由于同源策略影响，浏览器限制跨源脚本的错误访问，这样跨源脚本错误报错信息如下图：

![跨源的脚本的错误](https://segmentfault.com/img/bV7tjY?w=372&h=126)

在H5的规定中，只要满足下面俩个条件，是允许获取跨源脚本的错误信息的。

1. 客户端在script标签上增加crossorigin属性；
2. 服务端设置js资源响应头Access-Control-Origin:*（或者是域名）。

## 业界已经有的监控平台

- Sentry开源
- 阿里的ARMS
- fundebug
- FrontJS

## 扩展阅读

- 如何保证大家提交的代码是符合预期的？ 如何了解前端项目的运行是否正常，是否存在错误？

  代码质量体系控制和错误监控以及性能分析

- 如果用户使用网页，发现白屏，现在联系上了你们，你们会向他询问什么信息呢？先想一下为什么会白屏？

  我们以用户访问页面的过程为顺序，大致排查一下
  1. 用户没打开网络
  2. DNS域名劫持
  3. http劫持
  4. cdn或是其他资源文件访问出错
  5. 服务器错误
  6. 前端代码错误
  7. 前端兼容性问题
  8. 用户操作出错

  通过以上可能发生错误的环节，我们需要向用户手机一下以下的用户信息
  1. 当前的网络状态
  2. 运营商
  3. 地理位置
  4. 访问时间
  5. 客户端的版本(如果是通过客户端访问)
  6. 系统版本
  7. 浏览器信息
  8. 设备分辨率
  9. 页面的来源
  10. 用户的账号信息
  11. 通过performance API收集用户各个页面访问流程所消耗的时间
  12. 收集用户js代码报错的信息

- 如果我们使用了脚本代码压缩，然而我们又不想将sourcemap文件发布到线上，我们怎么捕获到错误的具体信息？

- CSS文件中也存在引用资源，@font-face, background-image ...等这些请求错误该如何进行错误捕获？
