<?php 
	include_once 'CustomerModel.php';


	$rolename = $_GET["RoleName"];
	
	if($rolename != "Director" && $rolename != "Super User"){
		echo "<script>alert('You are not allowed to access this page. Please log on as Director'); location.href='Login.php';</script>";
	
	}
	$parts = Customers::selectPartInvoiceList($_GET["CompaniesID"]);
    $result = array(
        'data'=> $parts
    );
    echo json_encode($result);
?>