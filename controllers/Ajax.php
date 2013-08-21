<?php

/*************************************************************
 *
 *      A central location for anything AJAX
 *
 ************************************************************/
     
Class ajax extends Controller{
	function index(){

	}
	
	function sample_ajax(){
    $var = $_GET['var'];
    
	  render('sample_ajax', 'ajax', get_defined_vars(), array('partial'=>true));
 	}

}
?>

