<?php
	include 'InvoicePDO.php';
	$term = trim(strip_tags($_GET["term"]));
	$CompaniesID = $_GET["CompaniesID"];
	
	$partList = Parts::selectAll($CompaniesID, $term);
	echo json_encode($partList);
	flush();
?>