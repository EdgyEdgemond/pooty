<?if (Security::has_permission(APPLICATION_NAME.".Admin", PROJECT_NAME)) {?>
  <a href="<?=link_to('search', 'sales')?>">Contract Search</a> |
  <a href="<?=link_to('add', 'sales')?>">Add Missing Sale</a> |   
  <a href="http://<?=$_SERVER["SERVER_NAME"]?>/macgyver13" target="new">Administer Contractors</a>
<?} else {?>
  <a href="<?=link_to('search', 'sales')?>">Contract Search</a>                       
<?}?>    
