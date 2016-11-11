<?php
	include 'InvoicePDO.php';
	$action= $_POST["partaction"];
	$invoiceParts = new InvoiceParts();
    if(isset($_POST["id"])){
	   $invoiceParts->ID = $_POST["id"];
    }else {
        $invoiceParts->ID = "";
    }
	$invoiceParts->InvoicesID = $_POST["InvoicesID"];
    if(isset($_POST["partsid"])){
        $invoiceParts->PartsID = $_POST["partsid"];
    }else {
        $invoiceParts->PartsID = "";
    }
	
	$invoiceParts->PartName = $_POST["partname"];
	$invoiceParts->Qty = $_POST["qty"];
	$invoiceParts->UnitCost = $_POST["unitcost"];
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