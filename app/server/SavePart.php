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
	
	if($action == 'SAVE'){
		if($invoiceParts->ID == ""){
			$affectedRow = $invoiceParts->insert();
		}else {
			$affectedRow = $invoiceParts->update();
		}
	}else {
		$affectedRow = $invoiceParts->delete($invoiceParts->ID);
	}
    //Update total amount of Invoices table
    Invoices::updateInvoiceTotalAmount($invoiceParts->InvoicesID);
	echo $affectedRow;
	
?> 