<?php

/**********************************************************
 *
 *      Sample model. To create a new one change class
 *      name, $table_name, $primary_key and save the 
 *      file as class_name.php   
 *
 *********************************************************/
   
Class Example extends Model {
  protected static $table_name = 'XTB_Example';
  protected static $primary_key = 'iEXAMPLE_ID';
  protected static $alias = 'Default';
  protected static $schema = 'dbo';
  protected static $audit_columns = array();

	public function __construct(){
      parent::__construct(self::$alias);
	}

  public function find($opts=array()) {
    return self::load($opts, self::$table_name, self::$primary_key, self::$alias, self::$schema);
  }

  public function modify($opts=array(), $columns=array()) {
    return self::update($opts, $columns, self::$table_name, self::$primary_key, self::$alias, self::$schema);
  }

  public function add($columns=array()) {
    return self::insert($columns, self::$table_name, self::$primary_key, self::$alias, self::$schema);
  }

  public function remove($opts=array()) {
    return self::delete($opts, self::$table_name, self::$primary_key, self::$alias, self::$schema);
  }

  public function table_details() {
    $table_desc = self::describe_table(self::$table_name, self::$alias, self::$schema);
    $columns = array();
    foreach($table_desc as $item) {
      $columns[$item['COLUMN_NAME']] = "";
    }
    return $columns;
  }

  public function audit($new, $orig, $id) {
    self::audit_details($new, $orig, $id, self::$audit_columns, self::$table_name);
  }
}
?>
