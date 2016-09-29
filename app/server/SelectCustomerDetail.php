<?php
  include 'CustomerModel.php';
  include_once 'CarMakers.php';
        
  $ID = "";
  if(isset($_POST["ID"]) && !empty($_POST["ID"])){
	$ID =  $_POST["ID"];
  }
  $cust;
  $custCars = null ;
  $custInvoices = null ;
  if($ID > 0){
	$cust = Customers::selectOne($ID);
	$custCars = Customers::selectCars($ID);
	$custInvoices = Customers::selectInvoices($ID);
  }else {
	$cust = array("ID"=>"","Title"=>"","FirstName"=>"","LastName"=>"","Phone"=>"","Mobile"=>"",
                  "Email"=>"","StreetAddress"=>"","suburb"=>"","state"=>"","postcode"=>"","Notes"=>"");
  }
  $makers = CarMakers::selectAll($_POST["CompaniesID"],"");	
  $array = array(
    "cust" => $cust,
    "custCars" => $custCars,
    "custInvoices" => $custInvoices,
    "makers" => $makers
  );
  $php = json_encode($array);
  echo $php;	
	// echo json_encode($invoiceParts);
  flush();        
?>