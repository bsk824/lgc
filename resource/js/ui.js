"use strict";

var device = {
  agent: navigator.userAgent.toLocaleLowerCase(),
  os: null,
  ver: null,
  init: function init() {
    if (device.agent.indexOf('iphone') > -1 || device.agent.indexOf('ipad') > -1) {
      var str = device.agent.substring(device.agent.indexOf('os') + 3);
      var ver = str.substring(0, str.indexOf(' like'));
      device.os = 'ios';
      device.ver = device.os + ver;
    }

    if (device.agent.indexOf('android') > -1) {
      var _str = device.agent.substring(device.agent.indexOf('android') + 8);

      var strSub = _str.substring(0, _str.indexOf(';'));

      var _ver = strSub.replace(/[.]/gi, '_');

      device.os = 'android';
      device.ver = device.os + _ver;
    }

    device.set();
  },
  set: function set() {
    var html = document.querySelector('html');
    var htmlClass = html.getAttribute('class');
    var trash = '';
    if (device.agent.indexOf('samsung') > -1) trash += ' samsung';
    if (device.agent.indexOf('naver') > -1) trash += ' naver';
    htmlClass ? html.setAttribute('class', htmlClass + ' ' + device.ver + trash) : html.setAttribute('class', device.ver + trash);
  }
};
var findEl = {
  obj: null,
  parent: function parent(el, str) {
    var tag = el.parentNode.tagName.toLowerCase();
    var cls = el.parentNode.classList;
    var id = el.parentNode.getAttribute('id');
    findEl.obj = el.parentNode;

    if (str !== tag && !cls.contains(str) && str != id) {
      if (tag != 'body') {
        findEl.parent(findEl.obj, str);
      } else {
        findEl.obj = null;
      }
    }

    return findEl.obj;
  },
  child: function child(el, str) {
    var arr = [];
    [].forEach.call(el.childNodes, function (obj) {
      if (obj.nodeType == 1) {
        var tag = obj.tagName.toLowerCase();
        var cls = obj.classList;
        var id = obj.getAttribute('id');

        if (str === tag || cls.contains(str) || str === id) {
          arr.push(obj);
        }
      }
    });

    if (arr.length > 0) {
      return arr;
    } else {
      return null;
    }
  },
  prevNode: function prevNode(str) {
    if (str.previousSibling != null) {
      if (str.previousSibling.nodeType == 1) {
        findEl.obj = str.previousSibling;
      } else {
        findEl.prevNode(str.previousSibling);
      }

      return findEl.obj;
    }
  },
  nextNode: function nextNode(str) {
    if (str.nextSibling != null) {
      if (str.nextSibling.nodeType == 1) {
        findEl.obj = str.nextSibling;
      } else {
        findEl.nextNode(str.nextSibling);
      }

      return findEl.obj;
    }
  }
};

var getUrlParams = function getUrlParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = value;
  });
  return params;
};

var tab = {
  init: function init() {
    var tabList = document.querySelectorAll('.tabList');
    [].forEach.call(tabList, function (_this) {
      var tabLink = _this.querySelectorAll('a');

      tab.addEvent(tabLink);
    });
  },
  addEvent: function addEvent(obj) {
    [].forEach.call(obj, function (_this) {
      _this.addEventListener('click', function (e) {
        var btn = e.target;
        tab.active(obj, btn);
      });
    });
  },
  active: function active(list, btn) {
    if (!btn.parentNode.classList.contains('active')) {
      [].forEach.call(list, function (_this) {
        _this.parentNode.classList.remove('active');
      });
      btn.parentNode.classList.add('active');
    }
  }
};
var layer = {
  obj: {},
  open: function open(id) {
    var layerWrap = document.querySelector('#' + id);
    var none = true;
    layerWrap.classList.add('show');

    for (var key in layer.obj) {
      if (key == id) none = false;
    }

    if (none) {
      layerWrap.addEventListener('click', function () {
        if (event.target.classList.contains('layerPopup')) layer.close(id);
      });
    }

    layer.obj[id] = layerWrap;
    document.body.classList.add('scrollLock');
  },
  close: function close(id) {
    var target;

    if (id) {
      target = document.querySelector('#' + id);
    } else {
      target = findEl.parent(event.target, 'layerPopup');
    }

    target.classList.remove('show');
    document.body.classList.remove('scrollLock');
  }
};
var menu = {
  open: function open() {
    document.body.classList.add('menuShow');
  },
  close: function close() {
    document.body.classList.remove('menuShow');
  }
};
var slideOpt = {
  pageSlide: {
    speed: 500,
    loop: true,
    observer: true,
    navigation: {
      prevEl: '#pageSlide .btnPrev',
      nextEl: '#pageSlide .btnNext'
    }
  }
};
var slider = {
  obj: {},
  active: function active(id) {
    var sliderObj = '#' + id;
    var option = slideOpt[id];
    if (!option.on) option['on'] = {};

    option.on['init'] = function () {
      slider.obj[id] = this;
    };

    if (document.querySelector(sliderObj)) new Swiper(sliderObj, option);
  }
};
$.datepicker.setDefaults({
  dateFormat: 'yy-mm-dd',
  prevText: '이전 달',
  nextText: '다음 달',
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
  showMonthAfterYear: true,
  yearSuffix: '년'
});
window.addEventListener('DOMContentLoaded', function () {
  device.init();
  tab.init();
  $(".inputTxt.typeCal").datepicker();
});
//# sourceMappingURL=ui.js.map
