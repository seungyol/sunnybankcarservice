<?php
	include 'CustomerModel.php';
	
	 $partID = $_POST["partID"];
	
	$rows = Customers::deletePart($partID);
	echo $rows;
?>
