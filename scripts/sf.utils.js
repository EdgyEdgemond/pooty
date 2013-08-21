sf = {}
sf.Utils = {}

// set or discover the position of an element
sf.Utils.position = function(el,x,y) {
	el = $(el)[0];
	if (typeof(x) == 'undefined' && typeof(y) == 'undefined') {
		var x = 0;
		var y = 0;
	} else {
		$(el).css({'position':'absolute','left':x+'px','top':y+'px'});
		return true;
	}
	do {
		x += el.offsetLeft;
		y += el.offsetTop;
	} while (el = el.offsetParent);
	
	return {x:x,y:y};
}

// get or set the opacity of an element
sf.Utils.opacity = function(el, opacity) {
	el = $(el);
	if (typeof(opacity) == 'undefined') {
		return el.css('opacity') ? el.css('opacity') * 100 : 100; // FIXME: IE not yet supported
	} else {
		if ($.browser.mozilla) {
			if (opacity == 100) { opacity = 99.9999; }
		}
		el.css('filter','alpha(opacity='+opacity+')');
		el.css('opacity',(opacity/100));
	}
}

// create an iframe under an element (IE only)
sf.Utils.Shield = function() {
	if ($.browser.msie) {
		var id = 'sfc_shield_'+new Date().getTime();
		var shield = $('<iframe id="'+id+'" style="display:none;left:0px;top:0px;position:absolute;" src="about:blank" scrolling="no" frameborder="0"></iframe>');
		$('body').append(shield);
		this.protect = function(el) {
			el = $(el);
			var pos = sf.Utils.position(el);
			shield.css({'top':pos[1]+'px','left':pos[0]+'px','width':el[0].offsetWidth,'height':el[0].offsetHeight,'display':'block'});
		}
		this.unProtect = function(destroy) {
			if (destroy) {
				shield.css({'display':'none'});
			} else {
				shield.remove();
			}
		}
		this.move = function(x,y) {
			shield.css({'top':y+'px','left':x+'px'});
		}
	} else {
		this.protect = function() {
			return true;
		}
		this.unProtect = function() {
			return true;
		}
	}
}

// Returns the size of the viewport as an array of w,h.
sf.Utils.getViewportSize = function() {
	if (window.innerWidth) {
		// standards complient browsers
		return {x:window.innerWidth,y:window.innerHeight};
	} else if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientWidth !=0) {
		// ie6 in standards compliant mode
		return {x:document.documentElement.clientWidth,y:document.documentElement.clientHeight};
	} else {
		// older versions of ie etc
		return {x:$('body').clientWidth,y:$('body').clientHeight};
	}
	return {x:0,y:0};
}

// Changes CSS rules for the supplied class to the supplied rules.
// The supplied rules must be a dictionary of 'property': 'setting'.
sf.Utils.changeCSS = function(css_class,css_rules){
	var found = false;
	var old_css = {};
	if (document.styleSheets[0].rules) {
		rules = 'rules';
	} else if (document.styleSheets[0].cssRules) {
		rules = 'cssRules';
	}
	all_sheets = document.styleSheets;
	for (var sheet=0;sheet<all_sheets.length;sheet++) {
		this_sheet_rules = all_sheets[sheet][rules];
		for (var rule=0;rule<this_sheet_rules.length;rule++) {
			this_rule = this_sheet_rules[rule];
			if (this_rule.selectorText == css_class) {
				for (rule_name in css_rules) {
					var rule_name_array = rule_name.split('-');
					var css_rule = rule_name_array[0];
					for (var i=1;i<rule_name_array.length;i++) {
						css_rule += rule_name_array[i].slice(0,1).toUpperCase()+rule_name_array[i].slice(1);
					}
					if (this_rule.style[css_rule]) {
						old_css[rule_name] = this_rule.style[css_rule]
					} else {
						old_css[rule_name] = '';
					}
					this_rule.style[css_rule] = css_rules[rule_name];
					
				}
				found = true;
			}
		}
	}
	if (!found) {
		//then add it into the last sheet
		sheet = all_sheets[sheet-1];
		var rules = false;
		if(sheet.addRule){
			for(i in css_rules){
				if(!rules){
					rules = i+':'+css_rules[i];
				} else{
					rules += ';'+i+':'+css_rules[i];
				}
			}
			sheet.addRule(css_class,rules,rule);
		} else{
			for(rule_name in css_rules){
				if(!rules){
					rules = css_class+' {'+rule_name+':'+css_rules[rule_name];
				} else{
					rules += ';'+rule_name+':'+css_rules[rule_name];
				}
			}
			rules +='}'
			sheet.insertRule(rules,rule);
		}
		return {}
	} else{
		return old_css;
	}
}

// Returns scroll distance as an array of x,y.
sf.Utils.getScroll = function() {
	if (typeof(window.pageYOffset) == 'number') {
		// Netscape
		return {x:window.pageXOffset,y:window.pageYOffset};
	} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
		// DOM
		return {x:document.body.scrollLeft,y:document.body.scrollTop};
	} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
		// IE6
		return {x:document.documentElement.scrollLeft,y:document.documentElement.scrollTop};
	}
	return {x:0,y:0};
}

// Adds indexOf to browsers which are crippled (i.e., IE).
if (!Array.indexOf) {
	Array.prototype.indexOf = function(o){
		for(var i=0;i<this.length;i++){
			if (this[i] == o) { return i; }
		}
		return -1;
	}
}

// Adds a trim() method to String objects
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
}

// Console for IE
if (typeof(console) == 'undefined') {
	console = {}
	console.log = function(msg) { alert(msg); }
}
