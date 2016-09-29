<?php
	include_once 'CustomerModel.php';
	include_once 'InvoicePDO.php';
	
    $ID =  0;
	if(isset($_GET["ID"])){
		$ID = $_GET["ID"];		
	}
	$CustomersID = 0;
	$CustomerCarsID = 0;
	if(isset($_GET["CustomersID"])){
		$CustomersID = $_GET["CustomersID"];
	}
	if(isset($_GET["CustomerCarsID"])){
		$CustomerCarsID= $_GET["CustomerCarsID"];
	}
	
	if($CustomersID>0){
		$customer = Customers::selectOne($CustomersID);
	}else if ($ID > 0){		
		$customer = Customers::selectCustomerWithInvNo($ID);
	}
	$custInvoices = null;
	$users = Users::selectUserIDName($_GET["CompaniesID"]);
	$paymethods = PayMethods::selectAll();
	
	if($ID > 0){
      $custInvoices = Invoices::selectInvoice($ID);
	  $custCars = Customers::selectCar($custInvoices["CustomerCarsID"]);

      $array = array(
        "customer" => $customer,
        "invoice" => $custInvoices,
        "car" => $custCars,
        "users" => $users,
        "paymethods" => $paymethods 
      );
      echo  json_encode($array);
	}else {
		$custCars = Customers::selectCar($CustomerCarsID);
		$invoice = new Invoices();
		$invoice->CustomerCarsID = $CustomerCarsID;
		$invoice->InvDate = date('d/m/Y');
		$ID = $invoice->insertInvoice();
		$custInvoices = Invoices::selectInvoice($ID);
		
//		$URL="/invoice-edit?CustomersID=" . $CustomersID . "&CustomerCarsID=" . $CustomerCarsID . "&ID=" . $ID;
//		echo '<script>location.href="' . $URL . '";</script>';
        $array = array(
          "ID" => $ID
        );
        echo  json_encode($array);        
	}
	
?>