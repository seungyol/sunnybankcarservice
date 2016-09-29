<?php
	include 'CustomerModel.php';
	
	$action= $_POST["action"];
	$customer = new Customers();
	$customer->ID = $_POST["CustomersID"];
	
	if($action == 'SAVE'){
      $customer->Title = $_POST["Title"];
      $customer->FirstName = $_POST["FirstName"];
      $customer->LastName = $_POST["LastName"];
      $customer->Phone = $_POST["Phone"];
      $customer->Mobile = $_POST["Mobile"];
      $customer->Email = $_POST["Email"];
      $customer->StreetAddress = $_POST["StreetAddress"];
      $customer->suburb = $_POST["suburb"];
      $customer->state = $_POST["state"];
      $customer->postcode = $_POST["postcode"];
      $customer->CompaniesID = $_POST["CompaniesID"];
      $customer->Notes = $_POST["Notes"];        
	  $result = $customer->save();
	}else {
	  $result = Customers::delete($customer->ID);
	}
	
	echo json_encode($result);
	
?> 