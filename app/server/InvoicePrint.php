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
	body {width:700px;font-size:11pt;font-family: Trebuchet MS, Verdana, Arial, Helvetica, sans-serif !important;}
	img.logo {float:left;height:70px;}
	h1 {width:370px;margin-top:20px;text-align:center;float:left;font-size:20pt;}
	li.name1 {font-size:11pt;}
	li.address {font-size:8pt;}
	
	li.customername {font-weight:bold;}
	li > label {font-weight:bold; width:100px;float:left;text-align:right; margin-right:7px;display:block;}
	li > label.short {width:90px;}
	li > span {width:120px;}
	li > span.short {width:100px;}
	.tdRight {text-align:right;}
	ul {list-style-type:none;display:block;float:left;padding-left:10px;margin-top:5px;}
	div {border: 1px solid;float:left;margin-top:10px;}
	div {border: 1px solid;float:left;margin-top:10px;}
	div.divTop {width:691px;height:60px;border:0px}
	div.divTop ul {margin-top:0px;}
	div.divCustomer { width:200px;height:120px;}
	div.divCar { width:260px;height:120px;}
	div.divInvoice { width:230px;height:120px;border-left:none;}
	div.divPartsHeader {width:681px;height:20px;background-color:gray;padding:5px;}
	div.divPartsDetails {width:691px;height:460px;}
	table {width:664px;border-spacing:0px;margin-top:10px;display:block;float:left;}
	tr {margin:0px;padding:0px;height:20px;}
	th {background-color:gray;border-bottom: 1px solid;padding:0px;}
	td {margin:0px;padding:0px;height:20px;padding:0px 5px 0px 5px;}
	span {display:block;float:left;border:0px;}
	.num {text-align:right;}
	.txt {text-align:left;}
	.description {width:390px;padding-left:20px;}
	.qty {width:47px;text-align:right;}
	.price {width:92px;text-align:right;}
	div.ResultNote {width:460px; height:240px;}
	div.ResultNote > span {width: 460px;display: block; bold;padding: 10px 0px 0px 10px;}
	div.ResultNote > span > label {font-weight: bold;}
	div.InvoiceTotal {width:230px; height:240px;border-left:0px;}
	ul {padding-left:10px;}
	ul.Car {margin-top:0px;}
	ul.Invoice > li {padding-top:20px;}
	ul.Invoice > li:nth-child(1) {padding-top:0px;}
	div.InvoiceTotal > ul > li {padding-top:20px;}
	div.InvoiceTotal > ul > li > label {width:110px;float:left;}
	div.InvoiceTotal > ul > li > span {width:80px;text-align:right;}
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
		<h1>TAX INVOICE</h1>

		<ul>
			<li class='name1'><?php echo $company["CompanyName"];?></li>
			<li class='address'>ABN <?php echo $company["ABN"];?></li>
			<li class='address'><?php echo $company["StreetAddress"] . ' ' . $company["suburb"] . ' ' . $company["state"] . ' ' . $company["postcode"];?></li>
			<li class='address'>Phone <?php echo $company["Phone"];?> Fax <?php echo $company["Fax"];?></li>
		</ul>
	</div>
	<div class='divCustomer'>
		<span>
			<ul>
				<li class='customername'><?php echo $customer["Title"] . " " . $customer["FirstName"] . " " . $customer["LastName"]; ?></li>
				<li style='font-weight:normal;'><?php echo $customer["StreetAddress"]; ?></li>
				<li style='font-weight:normal;'><?php echo $customer["suburb"] . " " . $customer["state"] . " " . $customer["postcode"]; ?></li>
				<li class='mobile'><?php echo $customer["Mobile"];?></li>
			</ul>
		</span>
	</div>
	<div class='divCar' style='border-left:none;'>
		<span>
			<ul class='Car'>
				<li><label class='short'>Rego No :</label><span><?php echo $custCars["RegNo"];?></span></li>
				<li><label class='short'>Make :</label><span><?php echo $custCars["MakerName"];?></span></li>
				<li><label class='short'>Model :</label><span><?php echo $custCars["ModelName"];?></span></li>
				<li><label class='short'>Year :</label><span><?php echo $custCars["Year"];?></span></li>
				<li><label class='short'>VIN :</label><span><?php if(empty($custCars["VIN"])) {echo "&nbsp;";}else {echo $custCars["VIN"];}?></span></li>
				<li><label class='short'>Odometer :</label><span><?php echo number_format($custInvoices["Odometer"]) . ' Km';?></span></li>
			</ul>
		</span>
	</div>	
	<div class='divInvoice' =''>
		<span>
			<ul class='Invoice'>
				<li><label>Date :</label><span class='short'><?php echo $custInvoices["InvDate"];?></span></li>
				<li><label>Invoice No :</label><span class='short'><?php echo $custInvoices["ID"];?></span></li>
				<li><label>Customer No :</label><span class='short'><?php echo $CustomersID;?></span></li>
			</ul>
		</span>
	</div>	
	<div class='divPartsHeader'>
		<span class='description'>Description</span>
		<span class='qty'>Qty</span>
		<span class='price'>Unit Price</span>
		<span class='price'>Line Total</span>
	</div>
	<div class='divPartsDetails' style='margin-top:0px;border-top:0px;'>
		<table class='parts'>
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
		</table>	
	</div>	

	<div class='ResultNote' style='position:relative;'>
			<span><label>Report</label></span>
			<span><?php echo nl2br ($custInvoices["ResultNotes"]);?>
			</span>
                        <span style='position:absolute;bottom:0;'>
<?php echo $company["BankNm"];?>, <?php echo $company["BsbNo"];?>, <?php echo $company["AccNo"];?>, <?php echo $company["AccNm"];?><br>
</span>
	</div>
	<div class='InvoiceTotal'>
			<ul>
				<li><label>Invoice Total</label><span><?php echo floor($custInvoices["TotalAmount"]);?></span></li>
				<li><label>GST in Total</label><span><?php echo round($custInvoices["TotalAmount"] / 11, 2);?></span></li>
				<li><label>Total Paid</label><span><?php echo floor($custInvoices["PaidAmount"]);?></span></li>
			</ul>		
	</div>
	</body>
</html>