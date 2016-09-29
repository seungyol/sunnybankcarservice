<?php
    include 'CustomerModel.php';
        
	$start = trim(strip_tags($_GET["start"]));
    $length = trim(strip_tags($_GET["length"]));
    $search = $_GET["search"]["value"];
   //print_r($_GET);
	// var_dump($search);
	$pagination = Customers::selectPaginationListWithModel($_GET["CompaniesID"], $search,$start,$length);
    $cnt = Customers::selectPaginationCount($_GET["CompaniesID"], $search);
	//print "customers count" . count($customers);
    $array = array(
        "recordsFiltered" => $cnt,
        "recordsTotal" => $cnt,
        "data" => $pagination,
    );
	$php = json_encode($array);
	echo $php;	
	// echo json_encode($invoiceParts);
	flush();        
?>