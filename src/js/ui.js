const device = {
	agent : navigator.userAgent.toLocaleLowerCase(),
	os : null,
	ver : null,
	init : () => {
		if(device.agent.indexOf('iphone') > -1 || device.agent.indexOf('ipad') > -1) {
			let str = device.agent.substring(device.agent.indexOf('os') + 3);
			let ver = str.substring(0, str.indexOf(' like'));
			device.os = 'ios';
			device.ver = device.os + ver;
		}
		if(device.agent.indexOf('android') > -1) {
			let str = device.agent.substring(device.agent.indexOf('android') + 8);
			let strSub = str.substring(0, str.indexOf(';'));
			let ver = strSub.replace(/[.]/gi,'_');
			device.os = 'android';
			device.ver = device.os + ver;
		}
		device.set();
	},
	set : () => {
		let html = document.querySelector('html');
		let htmlClass = html.getAttribute('class');
		let trash = '';
		if(device.agent.indexOf('samsung') > -1) trash += ' samsung';
		if(device.agent.indexOf('naver') > -1) trash += ' naver';
		(htmlClass) ? html.setAttribute('class', htmlClass+' '+device.ver+trash) : html.setAttribute('class', device.ver+trash);
	}
}
const findEl = {
	obj: null,
	parent: (el, str) => {
		let tag = el.parentNode.tagName.toLowerCase();
		let cls = el.parentNode.classList;
		let id = el.parentNode.getAttribute('id');
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
	child: (el, str) => {
		let arr = [];
		[].forEach.call(el.childNodes, function (obj) {
			if (obj.nodeType == 1) {
				let tag = obj.tagName.toLowerCase();
				let cls = obj.classList;
				let id = obj.getAttribute('id');
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
	prevNode: (str) => {
		if (str.previousSibling != null) {
			if (str.previousSibling.nodeType == 1) {
				findEl.obj = str.previousSibling;
			} else {
				findEl.prevNode(str.previousSibling);
			}
			return findEl.obj;
		}
	},
	nextNode: (str) => {
		if (str.nextSibling != null) {
			if (str.nextSibling.nodeType == 1) {
				findEl.obj = str.nextSibling;
			} else {
				findEl.nextNode(str.nextSibling);
			}
			return findEl.obj;
		}
	}
}
const getUrlParams = () => {
	let params = {}
	window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => { params[key] = value });
	return params;
}

const tab = {
	init: () => {
		let tabList = document.querySelectorAll('.tabList');
		[].forEach.call(tabList, _this => {
			let tabLink = _this.querySelectorAll('a');
			tab.addEvent(tabLink);
		});
	},
	addEvent: (obj) => {
		[].forEach.call(obj, _this => {
			_this.addEventListener('click', e => {
				let btn = e.target;
				tab.active(obj, btn);
			});
		});
	},
	active: (list, btn) => {
		if(!btn.parentNode.classList.contains('active')) {
			[].forEach.call(list, _this => {
				_this.parentNode.classList.remove('active');
			});
			btn.parentNode.classList.add('active');
		}
	}
}

const layer = {
	obj : {},
	open : (id) => {
		let layerWrap = document.querySelector('#'+id);
		let none = true;
		layerWrap.classList.add('show');
		for (let key in layer.obj) {
			if(key == id) none = false;
		}
		if(none) {
			layerWrap.addEventListener('click', function(){
				if(event.target.classList.contains('layerPopup')) layer.close(id);
			});
		}
		layer.obj[id] = layerWrap;
	},
	close : (id) => {
		let target;
		if(id) {
			target = document.querySelector('#'+id);
		} else {
			target = findEl.parent(event.target, 'layerPopup');
		}
		target.classList.remove('show');
	}
}
window.addEventListener('DOMContentLoaded', () => {
	device.init();
	tab.init();
});