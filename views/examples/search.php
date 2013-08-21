<div>
  <?=Controls::form('save', 'examples', 'GET')?>
    <h1 class="header">Search Customers</h1>
    <table>
      <tr>
        <td>Customer #</td>
        <td>
          <?=Controls::input_text("cust_num")?>
        </td>
      </tr>   
      <tr>
        <td>
          <?=Controls::input_submit("submit", array("value"=>"Search"))?>
        </td>
      </tr>  
    </table>
  <?=Controls::endform()?>
</div>
 


