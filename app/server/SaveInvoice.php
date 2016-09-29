<?php
	include 'InvoicePDO.php';
	
	$action= $_POST["action"];
	$invoice = new Invoices();
	$invoice->ID = $_POST["InvoicesID"];
	
	$result = 0;
	if($action == 'SAVE'){
        $invoice->Odometer = $_POST["Odometer"];
        $invoice->InvDate = $_POST["InvDate"];
        $invoice->JobDescription = $_POST["JobDescription"];
        $invoice->ResultNotes = $_POST["ResultNotes"];
        if(isset($_POST["PreviousYN"])){
            $invoice->PreviousYN = $_POST["PreviousYN"];
        }
        if(isset($_POST["QuotationYN"])){
            $invoice->QuotationYN = $_POST["QuotationYN"];
        }
        if(isset($_POST["FullyPaidYN"])){
            $invoice->FullyPaidYN = $_POST["FullyPaidYN"];
        }
        $invoice->TotalAmount = $_POST["amount"];
        $invoice->PaidAmount = $_POST["PaidAmount"];
        $invoice->PayMethodCd = $_POST["PayMethodCd"];
        $invoice->PayDate = $_POST["PayDate"];
        $invoice->CustomerCarsID = $_POST["CustomerCarsID"];
        if($_POST["technician"] != ""){
            $invoice->UsersID = $_POST["technician"];   
        }
        
        
		if($invoice->ID > 0){
			$result = $invoice->updateInvoice();
		}else {
			$result = $invoice->insertInvoice();
		}
	}else {
		$result = Invoices::deleteInvoice($invoice->ID);
	}
	
	echo $result;
	
?> 