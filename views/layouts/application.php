<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>
      <?=$_SESSION['title']?>
    </title>
    <link rel="stylesheet" type="text/css" href="styles/style.css">
    <script src="scripts/application.js" type="text/javascript"></script>
    <script src="scripts/jquery-1.2.6.min.js" type="text/javascript"></script>
    <script src="scripts/sf.utils.js" type="text/javascript"></script>
    <script src="scripts/sf.calendar.js" type="text/javascript"></script>  
    <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->      
    <!--[if lt IE 7]>
    <style>
    html* #banner {
      position:absolute;
    }
    html* .version {
      position:absolute;
    }
    .Main
    {
    	height: 550px;
    }
    </style>
    <![endif]-->         
  </head>
  <body>
<!--    <div id="version" class="version" style="cursor:default">
      Ver. <?=CURRENT_ALFRED_VERSION?>
    </div>-->
<!--    
  Uncomment the below block if this application has been added to The Brain
-->
<!--
    <div id="faq" class="faq" style="cursor:pointer">
      F.A.Q
    </div>
-->
    <div id="banner" class="banner">
      <?if (ENVIRONMENT!="PRD") {?><img src="images/banner_<?=ENVIRONMENT?>.gif"><?}?>
    </div>   
    <div id="container">        
      <a href="" style="text-decoration:none;">                 
        <div id="header" class="header"><h1><?=APPLICATION_NAME?></h1></div>
      </a>                       
      <div id="link_list" class="link_list"> 
        <?include("link_list.php");?>                                       
      </div> 
      <div class="Main" style="text-align:center">           
        <?if (count_messages() > 0) {
          $messages = get_messages();
          foreach($messages as $key => $value){
            $class=$value['type']=="message"?"main_message":"main_error";
          ?>
            <div class="<?=$class?>">  
            	<div class="<?=$class?>_message"><?print $value['message'];?></div>
            	<div class="<?=$class?>_right"></div>
            </div>
          <?}?>
        <?}?>
        <div style="float:left;width:100%;">
				<?php include($view); ?>
        </div>            
      </div>                                                                 
    </div>
    <?print display_debugs();?>      
  </body>
</html>
<script>
  sf.Calendar('.date');
  window.onresize = function (){
   setBannerCss();
  }
  setBannerCss();
  $('.version').click(function() {
    $.ajax({
      url: '?c=ajax&p=reset_user',
      type: 'GET',
      dataType: 'html',
      success: function() {
        var sURL = unescape(window.location.pathname);
        window.location.href = sURL; 
      }       
    });    
  });
  $('.faq').click(function() {
    window.open('http://'+window.location.hostname+'/thebrain/index.php?c=questions&p=you&name=<?=APPLICATION_NAME?>');        
  });   
</script>
