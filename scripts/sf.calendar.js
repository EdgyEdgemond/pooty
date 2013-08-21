//  els: A jQuery compatible selector string or element collection for elements in the DOM which will receive a calendar control.
// opts: An object of calendar options.


sf.Calendar = function(els,opts) {
	els = $(els);
	// Scoped variables.
	var cal = null; // The reference to the DOM object.
	var yesterday = new Date();
	yesterday.setTime(yesterday.getTime()-86400000);
	var date = {
		'day': (yesterday.getDate() < 10) ? '0'+yesterday.getDate() : yesterday.getDate(),
		'month': yesterday.getMonth(),
		'year': yesterday.getFullYear(),
		'hour': yesterday.getHours(),
		'minute': (yesterday.getMinutes() < 7) ? '00' : (yesterday.getMinutes() >= 7 && yesterday.getMinutes() < 22) ? '15' : (yesterday.getMinutes() >= 22 && yesterday.getMinutes() < 37) ? '30' : (yesterday.getMinutes() >= 37 && yesterday.getMinutes() < 52) ? '45' : '00',
		'second': yesterday.getSeconds()
	} // The date object used by the calendar object.
	var selected_date = date; //the date object that keeps what was originally in the input
	var table = ''; // The calendar table string. Using a string is faster than object manipulation.
	var element = false; //the current element that the calendar is associated with;
	
	// Create and insert the required DOM elements for the calendar object to manage.
	var attachCalendar = function() {
		cal = $('<div id="'+opts.calendar_id+'"></div>');
		cal.css({'position': 'absolute','top': '0px','left': '0px',display:'none','z-index':2});
		iframe = $('<iframe id="if" src=""></iframe>');
		iframe.css({'position': 'absolute','top': '0px','left': '0px',display:'none','z-index':1});
		$('body').append(cal);
		$('body').append(iframe);
		cal.click(function(e){e.stopPropagation();});
		$(document).click(function(e){hideCalendar();});
	}
	
	// Binds the click event to the calendar
	var bindClickEvent = function() {
		cal.click(function(e){
			var target = $(e.target);
			var new_day = target.html();
			if ($.nodeName(target[0],'td') && $.nodeName(target.parent().parent()[0],'TBODY') && new_day) { // Only the TDs in the TBODY are used.
				var target = $(e.target);
				if (new_day < 10) { new_day = '0'+new_day; }
				var new_date = new_day+'-'+opts.months[date.month]+'-'+date.year;
				var hours = date.hour;
				var minutes = date.minute;
				if (minutes < 10) { minutes = '0'+minutes; } 
				if (opts.show_time) {
					new_date += ' '+hours+':'+minutes;
				}
				// Set the date string of the element to the new date.
				element.val(new_date);
				hideCalendar();
				if($.isFunction(opts.on_select)){
					var date_obj = new Date();
					date_obj.setDate(new_day);
					date_obj.setMonth(date.month);
					date_obj.setFullYear(date.year);
					date_obj.setHours(hours);
					date_obj.setMinutes(date.minute);
					date_obj.setSeconds(date.second);
					date_obj.setMilliseconds(0);
					opts.on_select(new_date,date_obj); // Call the callback.
				}
			}
		});
	}
	
	// Parses the supplied string as a date or datetime and returns an appropriate date object to describe the results.
	var parseDateTime = function(str) {
		if (opts.show_time) {
		  if (opts.show_time == 12 ) {
			  var re = /^(\d{1,2})-([a-zA-Z]{3})-(\d{4}) (\d{1,2}):(\d{2}) (am|pm)?/;
			} else {
			  var re = /^(\d{1,2})-([a-zA-Z]{3})-(\d{4}) (\d{2}):(\d{2})?/;
			}
		} else {
			var re = /^(\d{1,2})-([a-zA-Z]{3})-(\d{4})/;
		}
		var parts = str.match(re);
		if (parts == null || parts.length <= 1) {
			//console.log('SF Calendar: Error parsing date string "'+str+'".');
		} else {
			date.day = parseInt(parts[1],10);
      parts[2] = parts[2].substr(0, 1).toUpperCase() +parts[2].substr(1).toLowerCase();
			date.month = parseInt(opts.months.indexOf(parts[2]),10);
			date.year = parseInt(parts[3],10);
			date.minute = (typeof(parts[5]) == 'undefined') ? 0 : parts[5];
						
			if(opts.show_time == 12){
				if(typeof(parts[4]) == 'undefined'){
					date.hour = '12am';
				} else{
					date.hour = (typeof(parts[6]) == 'undefined')?parts[4]+'am':parts[4]+parts[6]; 
				}
			} else{
				date.hour = typeof(parts[4]) == 'undefined'?0:parts[4];
			}

			selected_date = date;
		}
	}
	
	// Creates the raw calendar table based on the supplied date object.
	var createCalendarTable = function() {
		var m = []; // matrix
		var d = new Date(date.year, date.month, 1); // the first day of the month in question
		var d1 = d.getDay(); // d1 (dee one): first day of the week for this month
		d1 = (d1+6)%7; // damned americans
		var cd = 0; // current date: used to ensure no daylight savings dupes appear
		var x = 0; // temporary index
		for (var i=d.getTime(); d.setTime(i) && d.getMonth()==date.month; i+=86400000) {
			if (cd == d.getDate()) { continue; }
			m[x] = d.getTime();
			cd = d.getDate();
			if (x++ > 30) { break; } // just in case
		}
		
		// html time
		var t = new Date(); // today
		var c = ''; // the class for the date cells
		var h = '<table ><thead>'
    
    if (typeof(opts.numyears) != "undefined") {
      var numyears = opts.numyears     
    } else {
      var numyears = 2
    }
    
		years = []
		thisyear = new Date;
		for(var i=0-numyears;i<10000;i++){
		  years.push(date.year+i)
		  if (date.year+i == selected_date.year + 2) {
        break;
      } 
		}
		
		//create the selectors and things
		h += '<tr><th id="'+opts.last_month_id+'" colspan="2"><<</th><th id="'+opts.today_selector_id+'" colspan="3">Today</th><th id="'+opts.next_month_id+'" colspan="2">>></th></tr>';
		h += '<tr><th colspan="4">'+createSelectorString(opts.months,date.month,true,opts.month_selector_id)+'</th><th colspan="3">'+createSelectorString(years,numyears,false,opts.year_selector_id)+'</th></tr>';
		if(opts.show_time) h += '<tr><th colspan="3">Time:</th><th colspan="2">'+createSelectorString(opts.hours,opts.hours.indexOf(String(date.hour)),false,opts.hour_selector_id)+'</th><th colspan="2">'+createSelectorString(opts.minutes,opts.minutes.indexOf(String(date.minute)),false,opts.min_selector_id)+'</th></tr>';
		h +='<tr>';
		for(var i=0;i<7;i++){
			var weekend ='';
			if(i > 4){
				weekend = 'class="'+opts.weekend_class+'"';
			}
			h += '<th '+weekend+' >'+opts.weekdays[i]+'</th>';
		}
		h += '</tr></thead><tbody>';
		for (var j=0; j<d1; j++) { h += '<td class="'+opts.unselectable_class+'"></td>'; }
		for (var i=0; i<40; i++) {
			if (typeof(m[i]) == 'undefined') { h += '</tr>'; break; }
			d = new Date();
			d.setTime(m[i]);
			c = (d.getDay() == 0 || d.getDay() == 6) ? opts.weekend_class : '';
			if (d.getFullYear() == t.getFullYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate()) { c = opts.today_class; }
			if (d.getFullYear() == selected_date.year && d.getMonth() == selected_date.month && d.getDate() == selected_date.day) { c += ' '+opts.selected_day_class; }
			if ((opts.max_date && d.getTime() > opts.max_date.getTime()) || (opts.min_date && d.getTime() < opts.min_date.getTime())) { c += ' '+opts.unselectable_class; }
			h += '<td class="'+c+'">'+d.getDate()+'</td>';
			if ((i+d1+1)%7==0) { h += '</tr><tr>'; }
		}
		h += '</tbody></table>';
		table = $(h);
		
		//now that we have the table, we need to give some handlers to the date selectors
		table.find('#'+opts.month_selector_id).change(monthSelectorHandler);
		table.find('#'+opts.year_selector_id).change(yearSelectorHandler);
		table.find('#'+opts.hour_selector_id).change(hourSelectorHandler);
		table.find('#'+opts.min_selector_id).change(minSelectorHandler);
		table.find('#'+opts.today_selector_id).click(todaySelectorHandler);
		table.find('#'+opts.last_month_id).click(lastMonthSelectorHandler);
		table.find('#'+opts.next_month_id).click(nextMonthSelectorHandler);
	}
	
	//creates a selector in string form
	var createSelectorString = function(options,which_selected,pos_value,id){
		id = id ? 'id="'+id+'"':'';
		var select = '<select '+id+'>';
		for(var i=0;i<options.length;i++){
			var selected ='';
			if(i == which_selected) selected = 'selected="selected"';
			var value = (pos_value)?i:options[i];
			select += '<option value="'+value+'"'+selected+'>'+options[i]+'</option>';
		}
		return select+'</select>';
	}
	//below are a few handlers used in the selectors
	var monthSelectorHandler = function(e){
		var that = $(this);
		date.month = parseInt(that.attr('value'));
		createCalendarTable();
		drawCalendar();
	}
	var yearSelectorHandler = function(e){
		var that = $(this);
		date.year = parseInt(that.attr('value'));
		createCalendarTable();
		drawCalendar();
	}
	var hourSelectorHandler = function(e){
		var that = $(this);
		date.hour = that.attr('value');
		createCalendarTable();
		drawCalendar();
	}
	var minSelectorHandler = function(e){
		var that = $(this);
		date.minute = that.attr('value');
		createCalendarTable();
		drawCalendar();
	}
	var todaySelectorHandler = function(){
		var today = new Date();
		date.year = today.getFullYear();
		date.month = today.getMonth();
		date.day = today.getDate();
		createCalendarTable();
		drawCalendar();
	}
	var lastMonthSelectorHandler = function(){
		if(date.month == 0){
			date.month = 11;
			date.year--;
		} else{
			date.month--;	
		}
		createCalendarTable();
		drawCalendar();
	}
	var nextMonthSelectorHandler = function(){
		if(date.month == 11){
			date.month = 0;
			date.year++;
		} else{
			date.month++;	
		}
		createCalendarTable();
		drawCalendar();
	}
	
	// Draws the calendar into the DOM. This is used for redrawing also
	var drawCalendar = function() {
		cal.html(table);
		if(cal.css('display') == 'none') cal.hide();
	}
	
	//sets the position of the calendar around the passed in element;
	var positionCalendar = function(){
		var pos = sf.Utils.position(element);
		var viewport = sf.Utils.getViewportSize();
		var scroll = sf.Utils.getScroll();
		//need to unhide to get the size of the element
		cal.show();
		var cal_height = cal[0].offsetHeight;
		var cal_width = cal[0].offsetWidth;
		cal.hide();
		var y = 0;
		var x = 0;
		if(pos.y+element[0].offsetHeight+cal_height < viewport.y + scroll.y){
			y = pos.y+element[0].offsetHeight;
		} else{
			y = pos.y-cal_height;
		}
		if(pos.x+cal_width+30 < viewport.x + scroll.x){
			x = pos.x + 30;
		} else{
			x = pos.x-(cal_width-element[0].offsetWidth)+30; 	
		}
		
		iframe.css({'height':cal_height,'width':cal_width})
		sf.Utils.position(cal,x,y);
		sf.Utils.position(iframe,x,y);
	}
	
	// Reveals the calendar and protects it from crazy IE form bleeding.
	var showCalendar = function() {
    iframe.show();
    cal.show('fast');
	}
	
	// Hides the calendar.
	var hideCalendar = function() {
		cal.css({display:'none'});
		iframe.css({display:'none'});
	}
	
	// Initializes the opts variable.
	var init = function() {
		if (typeof(opts) == 'undefined') { opts = {} }
		opts.weekdays 			= typeof(opts.weekdays) != 'undefined' ? opts.weekdays : Array('Mon','Tue','Wed','Thu','Fri','Sat','Sun');
		opts.months 			= typeof(opts.months) != 'undefined' ? opts.months : Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
		opts.show_time			= typeof(opts.show_time) != 'undefined' ? opts.show_time : false;
		opts.minutes			= typeof(opts.minutes) != 'undefined' ? opts.minutes : ['00','15','30','45'];
		opts.meta 				= typeof(opts.meta) != 'undefined' ? opts.meta : {'id':'sf_calendar','class':'sf_calendar'};
		opts.max_date			= typeof(opts.max_date) != 'undefined' ? opts.max_date : false;
		opts.min_date			= typeof(opts.max_date) != 'undefined' ? opts.max_date : new Date(1970,0,1);
		
		if(typeof(opts.hours) == 'undefined' ){
			if(opts.show_time == 12){
				opts.hours		= ['01am','02am','03am','04am','05am','06am','07am','08am','09am','10am','11am','12pm','01pm','02pm','03pm','04pm','05pm','06pm','07pm','08pm','09pm','10pm','11pm','12am'];
			} else{
				opts.hours		= ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
			}
		}
		//ids and classes
		opts.calendar_id		= typeof(opts.calendar_id) != 'undefined' ? opts.calendar_id : 'sf_calendar_id';
		opts.min_selector_id	= typeof(opts.min_selector_id) != 'undefined' ? opts.min_selector_id : 'sf_min_selector';
		opts.hour_selector_id	= typeof(opts.hour_selector_id) != 'undefined' ? opts.hour_selector_id : 'sf_hour_selector';
		opts.month_selector_id	= typeof(opts.month_selector_id) != 'undefined' ? opts.month_selector_id : 'sf_month_selector';
		opts.year_selector_id	= typeof(opts.year_selector_id) != 'undefined' ? opts.year_selector_id : 'sf_year_selector';
		opts.today_selector_id	= typeof(opts.today_selector_id) != 'undefined' ? opts.today_selector_id : 'sf_today_selector';
		opts.last_month_id		= typeof(opts.last_month_id) != 'undefined' ? opts.last_month_id : 'sf_last_month';
		opts.next_month_id		= typeof(opts.next_month_id) != 'undefined' ? opts.next_month_id : 'sf_next_month';
		
		opts.weekend_class		= typeof(opts.weekend) != 'undefined' ? opts.weekend : 'sf_weekend';
		opts.today_class		= typeof(opts.today_class) != 'undefined' ? opts.today_class : 'sf_today';
		opts.selected_day_class	= typeof(opts.selected_day_class) != 'undefined' ? opts.selected_day_class : 'sf_selected_day';
		opts.unselectable_class = typeof(opts.unselectable_class) != 'undefined' ? opts.unselectable_class : 'sf_unselectable';
	}
	// Vroooom!
	init();
	attachCalendar();
	bindClickEvent();
	els.each(function(){
		if ($(this).val() == '') {
			//$(this).val(date.day+'-'+opts.months[date.month]+'-'+date.year);
		}
		$(this).click(function(e){
			element = $(this);
			e.stopPropagation();
			parseDateTime(element.val());
			createCalendarTable();
			drawCalendar();
			positionCalendar();
			showCalendar();
		});
	});
	
}
