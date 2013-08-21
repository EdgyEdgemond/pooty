<?php
Class Examples extends Controller{
	
  function index(){
		$this->search();
	}
   	
  function search(){
    
    //$var = Example::find(array("select"=>"TOP 10 iEXAMPLE_ID", "where"=>"vcEXAMPLE like '%blah%'")); 
    // the above will give you
    // SELECT TOP 10 iEXAMPLE_ID FROM XTB_Example WHERE vcEXAMPLE like '%blah%'
    
    render('search','examples',get_defined_vars()); 
                                      
  }
 	
}
?>
