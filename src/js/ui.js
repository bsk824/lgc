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
	obj : {},
	init: () => {
		let tabs = document.querySelectorAll('.tab');
		[].forEach.call(tabs, (_this, idx) => {
			tab.obj['tab'+idx] = {};
			let tabObj = tab.obj['tab'+idx];
			tabObj['list'] = _this.querySelector('.tabList');
			tabObj['menu'] = tabObj['list'].querySelectorAll('a');
			tabObj['contents'] = findEl.child(_this, 'box');
			tab.addEvent(tabObj['menu'], tabObj);
		});
	},
	addEvent: (menu, tabObj) => {
		[].forEach.call(menu, (_this, idx) => {
			_this.addEventListener('click', () => {
				if(_this.getAttribute('href') === '#') event.preventDefault();
				tab.active(tabObj, idx);
			});
		});
	},
	active: (obj, idx) => {
		[].forEach.call(obj.menu, _this => {
			_this.parentNode.classList.remove('active');
		});
		obj.menu[idx].parentNode.classList.add('active');

		[].forEach.call(obj.contents, _this => {
			_this.classList.remove('active');
		});
		obj.contents[idx].classList.add('active');
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
		layer.obj[id] = layerWrap;
		document.body.classList.add('scrollLock');
	},
	close : (id) => {
		let target;
		if(id) {
			target = document.querySelector('#'+id);
		} else {
			target = findEl.parent(event.target, 'layerPopup');
		}
		target.classList.remove('show');
		document.body.classList.remove('scrollLock');
	}
}

const menu = {
	open : () => {
		document.body.classList.add('menuShow');
	},
	close : () => {
		document.body.classList.remove('menuShow');
	}
}

const slideOpt = {
	pageSlide: {
		speed: 500,
		loop: true,
		observer: true,
		observeParents: true,
		navigation : {
			prevEl: '#pageSlide .btnPrev',
			nextEl: '#pageSlide .btnNext',
		}
	},
}

const slider = {
	obj : {},
	active : (id) => {
		let sliderObj = '#'+id;
		let option = slideOpt[id];
		if(!option.on) option['on'] = {};
		option.on['init'] = function(){
			slider.obj[id] = this;
		}
		if(document.querySelector(sliderObj)) new Swiper(sliderObj, option);
	}
}

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
	yearSuffix: '년',
});

window.addEventListener('DOMContentLoaded', () => {
	device.init();
	tab.init();
	$(".inputTxt.typeCal").datepicker();
});
