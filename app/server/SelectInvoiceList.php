<?php
    include_once 'InvoicePDO.php';
	$type = $_GET['type'];
	$start = trim(strip_tags($_GET["start"]));
    $length = trim(strip_tags($_GET["length"]));
    $search = $_GET["search"]["value"];
	$pagination = Invoices::selectPaginatedInvoicesByType($_GET["CompaniesID"], $type, $search, $start,$length);
	$cnt = Invoices::selectInvoiceCountByType($_GET["CompaniesID"],$type, $search);
   //print_r($_GET);
	// var_dump($search);
	//print "customers count" . count($customers);
    $array = array(
        "recordsFiltered" => $cnt,
        "recordsTotal" => $cnt,
        "data" => $pagination,
    );
	$php = json_encode($array);
	echo $php;	
	flush();        
?>