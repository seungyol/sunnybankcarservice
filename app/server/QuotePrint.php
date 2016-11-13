<?php
	include 'CustomerModel.php';
	include 'InvoicePDO.php';
	
	$ID =  $_GET["ID"];
	$CustomersID = $_GET["CustomersID"];
	$customer = Customers::selectOne($CustomersID);
	$custInvoices = null;
	$invoiceParts = null;
	$custInvoices = Invoices::selectInvoice($ID);
	$custCars = Customers::selectCar($custInvoices["CustomerCarsID"]);
	$invoiceParts = InvoiceParts::selectInvoiceParts($ID);
	$companiesID = $_GET["CompaniesID"];
	$users = Users::selectUsers($companiesID);
	$company = Companies::select($companiesID);
	
?>

<html>
	<head>
	<META charset="utf8">
	<style>
	body {width:700px;font-size:11pt;font-family: Arial, Helvetica, sans-serif !important;}
	img.logo {float:left;height:70px;}
	h1 {width:370px;margin-top:20px;text-align:center;float:left;font-size:20pt;}
	li.name1 {font-size:11pt;}
	li.address {font-size:8pt;}	
	li.customername {font-weight:bold;}
	li > label {font-weight:bold; width:100px;float:left;text-align:right; margin-right:7px;display:block;}
	li > label.short {width:80px;}
	li > span {width:120px;}
	li > span.short {width:100px;}
	.tdRight {text-align:right;}	
	ul {list-style-type:none;display:block;float:left;padding-left:10px;margin-top:5px;}
	ul.Car {margin-top:0px;}
	ul.Invoice > li {padding-top:20px;}
	ul.Invoice > li:nth-child(1) {padding-top:0px;}

	div {
        border: 1px solid  #AFAFAF;
        float:left;
        margin-top:10px;
    }
	div.divTop {width:691px;height:60px;border:0px}
	div.divTop ul {margin-top:0px;padding-left:10px;}div.divCustomer { 
        width:200px;
        height:120px;
        border: 0;
        clear: both;
        margin-top: 0;
    }
    .divCustomer li {
        margin-bottom: 3px;
    }        
	div.divCar { 
        width:470px;
        height:120px;
        border: 0;
        margin: 0 0 0 20px;
    }
	div.divInvoice { width:230px;height:140px;border-left:none;}

	table.parts {
        width:691px;height:460px;
        border: 1px solid #AFAFAF;
        table-layout: fixed;
    }
    table.parts th {
        border-bottom: 1px solid #AFAFAF;
        font-weight: normal;
        background-color: #EDEDED;
    }
    th.description {
        width: 60%;
    }
    th.qty {
        width: 10%;
    }
    th.unit {
        width: 15%;
        text-align: right;
    }
    th.total {
        width: 15%;
        text-align: right;
        padding-right:2px;
    }
    table.parts td {
        padding-top: 5px;
    }	
    div.box {
        border: 0;
        overflow: auto;
        width: 100%;
        margin: 0 0 3px 0;
    }
    .labelbox {
        display: block;
        float: left;
        margin-left: 480px;
        width: 85px;
    }
    .val-box {
        float: left;
        margin-left: 5px;
    }
    .short-label-box {
        width: 100px;
        display: block;
        float: left;
        text-align: right;     
        font-weight: bold;
    }
    .right {text-align: right;}
    .bold {font-weight: bold;}
    .header-box {
        background-color: #EDEDED;   
        border-color: #AFAFAF;
        width: 98%;
        padding-left: 10px;
    }	
table {width:664px;border-spacing:0px;margin-top:10px;display:block;float:left;}
    thead tr {margin:0px;padding:0px;height:30px;}
	tr {margin:0px;padding:0px;height:20px;}
	th {background-color:gray;border-bottom: 1px solid;padding:0px;}
	td {margin:0px;padding:0px;height:20px;padding:0px 5px 0px 5px;}
	span {display:block;float:left;border:0px;}
	.num {text-align:right;}
	.txt {text-align:left;}
	.description {width:390px;padding-left:20px;}
	.qty {width:47px;text-align:right;}
	.price {width:92px;text-align:right;}

	div.ResultNote {width:691px; height:240px;}
	div.ResultNote > span {width: 691px;display: block; bold;padding: 10px;}
	div.ResultNote > span > label {font-weight: bold;}
      
	</style>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>	
	<script>
		$(function(){
			window.print();
		});
	</script>
	</head>
	<body>
	<div class='divTop'>
		<img class='logo' src='/images/logo<?php echo $companiesID;?>.png'>
		<h1>Quotation</h1>

		<ul>
			<li class='name1'><?php echo $company["CompanyName"];?></li>
			<li class='address'>ABN <?php echo $company["ABN"];?></li>
			<li class='address'><?php echo $company["StreetAddress"] . ' ' . $company["suburb"] . ' ' . $company["state"] . ' ' . $company["postcode"];?></li>
			<li class='address'>Phone <?php echo $company["Phone"];?> Fax <?php echo $company["Fax"];?></li>
		</ul>
	</div>
	<div class='box'> 
			<div class='box'><label class='labelbox bold'>Quote No :</label><label class='val-box short'><?php echo $custInvoices["ID"];?></label></div>
			<div class='box'><label class='labelbox bold'>Date :</label><label class='val-box short'><?php echo $custInvoices["InvDate"];?></label></div>
	</div>
	
	<div class='divCustomer'>
		<div class='header-box'>Customer</div>
		<ul>
			<li class='customername'><?php echo $customer["Title"] . " " . $customer["FirstName"] . " " . $customer["LastName"]; ?></li>
			<li style='font-weight:normal;'><?php echo $customer["StreetAddress"]; ?></li>
			<li style='font-weight:normal;'><?php echo $customer["suburb"] . " " . $customer["state"] . " " . $customer["postcode"]; ?></li>
			<li class='mobile'><?php echo $customer["Mobile"];?></li>
		</ul>

	</div>
	<div class='divCar' style='border-left:none;'>
		<div class='header-box'>Car Details</div>
		<div class='Car box'>
				<div class='box'><label class='short-label-box'>Rego No :</label><label class='val-box'><?php echo $custCars["RegNo"];?></label></div>
				<div class='box'><label class='short-label-box'>Model :</label><label class='val-box'><?php echo $custCars["MakerName"] . " " . $custCars["ModelName"] . " (Year " . $custCars["Year"] . ")";?></label></div>
				<div class='box'><label class='short-label-box'>VIN :</label><label class='val-box'><?php if(empty($custCars["VIN"])) {echo "&nbsp;";}else {echo $custCars["VIN"];}?></label></div>
				<div class='box'><label class='short-label-box'>Odometer :</label><label class='val-box'><?php echo number_format($custInvoices["Odometer"]) . ' Km';?></label></div>
		</div>
	</div>			

	<table class='parts' cellpadding="0" cellspacing="0" border="0">
        <thead>
            <tr>
                <th class='description'>Description</th>
                <th class='qty'>Qty</th>
                <th class='unit'>Unit Price</th>
                <th class='total'>Line Total</th>
            </tr>
        </thead>
        <tbody>
		<?php
			foreach($invoiceParts as $part){
				echo "<tr>";
				echo "<td class='description'>" . $part->PartName . "</td>";
				echo "<td class='qty'>" . $part->Qty . "</td>";
				echo "<td class='price'>" . $part->UnitCost . "</td>";
				echo "<td class='price'>" . floor($part->LineTotal) . "</td>";
				echo "</tr>";
			}
		
		?>
       
            <tr>
                <td class='description'>Total</td>
                <td class='qty'></td>
                <td class='price'></td>
                <td class='price'><?php echo floor($custInvoices["TotalAmount"]);?></td>
            </tr>
            <tr>
                <td class='description'>GST</td>
                <td class='qty'></td>
                <td class='price'></td>
                <td class='price'><?php echo round($custInvoices["TotalAmount"] / 11, 2);?></td>
            </tr>  
        </tbody>
    </table>
        

	<div class='ResultNote'>
			<span><label>Description</label></span>
			<span><?php echo nl2br ($custInvoices["ResultNotes"]);?>
			</span>
	</div>

	</body>
</html>