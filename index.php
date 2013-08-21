<?php
  $pootyBase = 'websites/'.$_SERVER["SERVER_NAME"].'/pooty_core/3.1';
  
  // Include core libraries
  require("/$pootyBase/Security.php");
  require("/$pootyBase/Validate.php");
  require("/$pootyBase/Model.php");
  require("/$pootyBase/Controller.php");
  require("/$pootyBase/Controls.php");
  require("/$pootyBase/Error.php");
  require("/$pootyBase/helper_functions.php");
  require("application/helper_functions.php");

  define("PROJECT_NAME", "Example Proj");
  define("APPLICATION_NAME", "Change Me");

  //error_reporting(E_ALL);  //Uncomment for debugging in PRD.

	session_start();

  $_SESSION['securityAccess'.APPLICATION_NAME] = APPLICATION_NAME.".Access";
  $_SESSION['securityHeirarchy'.APPLICATION_NAME] = array();
  
  $default_controller = 'examples';
  $default_method = 'index';
  
	//first we get the controller we should be using
	$controller = (isset($_GET['c'])?ucwords(strtolower($_GET['c'])):$default_controller);
	$title = $controller;
	require("controllers\\$controller.php");
	$controller = new $controller();
	//then we check for the method we are meant to exec
	$method = isset($_GET['p'])?ucwords(strtolower($_GET['p'])):$default_method;
	//then we execute it
  $_SESSION['title'] = APPLICATION_NAME.': '.$method.' - '.$title;
  if (method_exists($controller,$method)) {
	  $controller->$method();
	} else {
	  print PootyError::Page();
  }
?>


