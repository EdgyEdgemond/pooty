// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

  getViewportSize = function() {
    if (window.innerWidth) {
      // standards complient browsers
      return {x:window.innerWidth,y:window.innerHeight};
    } else if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientWidth !=0) {
      // ie6 in standards compliant mode
      return {x:document.documentElement.clientWidth,y:document.documentElement.clientHeight};
    } else {
      // older versions of ie etc
      return {x:document.body.clientWidth,y:document.body.clientHeight};
    }
    return {x:0,y:0};
  }	

  function setBannerCss() {
    $('#banner').css({'left': (getViewportSize().x - 200) + 'px'});
  }
  
  function limit_chars(textarea, limit) {
      var text = textarea.value
      var textlength = text.length
  
      if (textlength > limit) {
          textarea.value = text.substr(0,limit)
      }
  }  

  
  // Copyright 2006-2007 javascript-array.com
  
  var timeout	= 500;
  var closetimer	= 0;
  var ddmenuitem	= 0;
  
  // open hidden layer
  function mopen(id)
  {	
  	// cancel close timer
  	mcancelclosetime();
  
  	// close old layer
  	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
  
  	// get new layer and show it
  	ddmenuitem = document.getElementById(id);
  	ddmenuitem.style.visibility = 'visible';
  
  }
  // close showed layer
  function mclose()
  {
  	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
  }
  
  // go close timer
  function mclosetime()
  {
  	closetimer = window.setTimeout(mclose, timeout);
  }
  
  // cancel close timer
  function mcancelclosetime()
  {
  	if(closetimer)
  	{
  		window.clearTimeout(closetimer);
  		closetimer = null;
  	}
  }
  
  // close layer when click-out
  document.onclick = mclose;     
  /*********************************************************************
   *
   *     Your application wide javascript file.
   *     setBannerCss() is handy for dev/tst/prd differentiation.
   *     
   **********************************************************************/              
