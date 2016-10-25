<?php
	include 'InvoicePDO.php';
	$ID = trim(strip_tags($_GET["ID"]));
	// var_dump($ID);
	$invoiceParts = InvoiceParts::selectInvoiceParts($ID);
	// var_dump($invoiceParts);
	foreach($invoiceParts as $part){
//		$part->LineTotal = number_format(floor($part->LineTotal));
	}
	$php = json_encode($invoiceParts);
	echo $php;	
	// echo json_encode($invoiceParts);
	flush();
?>