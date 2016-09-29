<?php
	include_once 'InvoicePDO.php';

	$paymethods = PayMethods::selectAll();
    echo json_encode($paymethods);
?>