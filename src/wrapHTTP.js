(function() {
  if(!window.XMLHttpRequest) return;
  var xmlhttp = window.XMLHttpRequest;
  var _oldSend = xmlhttp.prototype.send;
  var _handleEvent = function (event) {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        robot.instance.add(this, {
          type: "XMLHttpRequest error",
          extraInfo: event
        });
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


  if (!window.fetch) return;
  var _oldFetch = window.fetch;
  window.fetch = function() {
    return _oldFetch
      .apply(this, arguments)
      .then(function(res){
        console.log("fetch ====", res)
        if (!res.ok) {

          // True if status is HTTP 2xx
          // 上报错误
          robot.instance.add(this, {
            type: "fetch error",
            extraInfo: res
          });
        }
        return res;
      })
      .catch(function(error){

        console.log("fetch ====error",res)
        // 上报错误
        rebot.instance.add(this, {
          type: "fetch error",
          extraInfo: error
        });
        throw error;
      });
  }
})()
