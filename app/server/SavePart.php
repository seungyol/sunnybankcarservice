<?php
	include 'InvoicePDO.php';
	$action= $_POST["partaction"];
	$invoiceParts = new InvoiceParts();
	$invoiceParts->ID = $_POST["InvoicePartsID"];
	$invoiceParts->InvoicesID = $_POST["InvoicesID"];
	$invoiceParts->PartsID = $_POST["PartsID"];
	$invoiceParts->PartName = $_POST["PartName"];
	$invoiceParts->Qty = $_POST["Qty"];
	$invoiceParts->UnitCost = $_POST["UnitCost"];
	$invoiceParts->CompaniesID = $_POST["CompaniesID"];
	
	//No PartsID 
	if($invoiceParts->PartsID == null){
		//Check Parts with the Part Name
		$partsid = Parts::selectIDByName($invoiceParts->PartName, $invoiceParts->CompaniesID);
		//If no parts , create a new one
		if($partsid == null){
			$partsid = Parts::insert($invoiceParts->PartName, $invoiceParts->CompaniesID);
		}
		
		$invoiceParts->PartsID = $partsid;
	}
	$newID = 0;
    $affectedRow = 0;
	if($action == 'SAVE'){
		if($invoiceParts->ID == ""){
			$newID = $invoiceParts->insert();
            $affectedRow = 1;
		}else {
			$affectedRow = $invoiceParts->update();
		}
	}else {
		$affectedRow = $invoiceParts->delete($invoiceParts->ID);
	}
    //Update total amount of Invoices table
    Invoices::updateInvoiceTotalAmount($invoiceParts->InvoicesID);

    $result = array(
        "affectedRows" => $affectedRow,
        "ID" => $newID
    );
          
	echo json_encode($result);
	
?> 