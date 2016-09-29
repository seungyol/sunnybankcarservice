<?php
    include_once 'InvoicePDO.php';
	$type = $_GET['type'];
	$start = trim(strip_tags($_GET["start"]));
    $length = trim(strip_tags($_GET["length"]));
    $search = $_GET["search"]["value"];
	$pagination = Invoices::selectPaginatedInvoicesByType($_GET["CompaniesID"], $type, $search, $start,$length);
	$cnt = Invoices::selectInvoiceCountByType($_GET["CompaniesID"],$type, $search);
//	foreach ($invoiceList as $invoice){
//			echo '<tr>';
//			echo	'<td>' . $invoice["ID"] . '</td>';
//			echo	"<td class='InvDate' data-customersid='" . $invoice["CustomersID"] . "' data-customercarsid='" . $invoice["CustomerCarsID"] . "' data-id='" . $invoice["ID"] . "'>" . $invoice["InvDate"] . '</td>';
//			echo	'<td class="tdLeft">' . $invoice["CustomerName"] . '</td>';
//			echo	'<td>' . $invoice["RegNo"] . '</td>';
//			echo	'<td class="tdRight">$' . number_format(floor($invoice["TotalAmount"])) . '</td>';
//			echo	'<td class="tdRight">$' . number_format(floor($invoice["PaidAmount"])) . '</td>';
//			echo	'<td>' . $invoice["Technician"] . '</td>';
//			echo '</tr>';
//	}

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
	// echo json_encode($invoiceParts);
	flush();        
?>