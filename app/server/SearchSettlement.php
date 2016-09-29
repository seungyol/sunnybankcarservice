<?php
	include 'InvoicePDO.php';
	$param = array("InvDateFrom" => $_POST["InvDateFrom"],
						"InvDateTo" => $_POST["InvDateTo"],
						"QuotationYN" => $_POST["QuotationYN"],
						"PreviousYN" => $_POST["PreviousYN"],
						"PayMethodCd" => $_POST["PayMethodCd"],
						"CompaniesID" => $_POST["CompaniesID"]);

	//var_dump($param);
	$totalAmount = Invoices::getTotalAmount($param);
	$paidAmount = Invoices::getPaidAmount($param);

	$result = array("TotalAmount" => $totalAmount["TotalAmount"], "PaidAmount" => $paidAmount["PaidAmount"]);
	echo json_encode($result);
	flush();
?>