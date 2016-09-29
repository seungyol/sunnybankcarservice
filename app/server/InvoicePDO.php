<?php

date_default_timezone_set('Australia/Queensland');
class Invoices {
	public $ID;
	public $Odometer;
	public $InvDate;
	public $JobDescription;
	public $ResultNotes;
	public $QuotationYN;
	public $FullyPaidYN;
	public $TotalAmount;
	public $PaidAmount;
	public $PayMethodCd;
	public $PayDate;
	public $CustomerCarsID;
	public $UsersID;
	public $PreviousYN;
	
	public static function getTotalAmount($param){
		include 'DBConstant.php';		
		//$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$invoice = null;
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = " SELECT SUM(FLOOR(inp.Qty * inp.UnitCost)) as TotalAmount " .
					 " FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " . 
					 "		INNER JOIN InvoiceParts inp ON inv.ID = inp.InvoicesID  " .
					 "		INNER JOIN Customers cu ON cc.CustomersID = cu.ID  " .
					 " WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL  ";
			if(strlen($param["PayMethodCd"]) > 0){
				$sql = $sql . " AND inv.PayMethodCd = '" . $param["PayMethodCd"] . "'";
			}
			
			if($param["QuotationYN"] == "N"){
				$sql = $sql . " AND inv.QuotationYN IS NULL ";
			}else if ($param["QuotationYN"] == "Y"){
				$sql = $sql . " AND inv.QuotationYN = 'Y' ";
			}
			if($param["PreviousYN"] == "N"){
				$sql = $sql . " AND inv.PreviousYN IS NULL ";
			}else if ($param["PreviousYN"] == "Y"){
				$sql = $sql . " AND inv.PreviousYN = 'Y' ";
			}

			$sql = $sql . " AND STR_TO_DATE(InvDate, '%d/%m/%Y') between STR_TO_DATE(:FromDate, '%d/%m/%Y')
                     and STR_TO_DATE(:ToDate, '%d/%m/%Y') ";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$param["CompaniesID"]);
			$stmt->bindParam(':FromDate',$param["InvDateFrom"]);
			$stmt->bindParam(':ToDate',$param["InvDateTo"]);
			
			$stmt->execute();
			$invoice = $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "Error!: " . $e->getMessage() . "<br/>";
			print "SQL: " . $sql;
			die();		
		}
		return $invoice;
	}	
	
	
	public static function getPaidAmount($param){
		include 'DBConstant.php';		
		//$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$invoice = null;
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = " SELECT SUM(inv.PaidAmount) as PaidAmount
					 FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID 
					 		INNER JOIN Customers cu ON cc.CustomersID = cu.ID 
					 WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL ";
			if($param["PayMethodCd"] != ""){
				$sql = $sql . " AND inv.PayMethodCd = '" . $param["PayMethodCd"] . "'";
			}
			if($param["QuotationYN"] == "N"){
				$sql = $sql . " AND inv.QuotationYN IS NULL ";
			}else if ($param["QuotationYN"] == "Y"){
				$sql = $sql . " AND inv.QuotationYN ='Y' ";
			}
			if($param["PreviousYN"] == "N"){
				$sql = $sql . " AND inv.PreviousYN IS NULL ";
			}else if ($param["PreviousYN"] == "Y"){
				$sql = $sql . " AND inv.PreviousYN = 'Y' ";
			}
			
			$sql = $sql . " AND STR_TO_DATE(InvDate, '%d/%m/%Y') between STR_TO_DATE(:FromDate, '%d/%m/%Y')
                     and STR_TO_DATE(:ToDate, '%d/%m/%Y') ";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$param["CompaniesID"]);
			$stmt->bindParam(':FromDate',$param["InvDateFrom"]);
			$stmt->bindParam(':ToDate',$param["InvDateTo"]);
			
			$stmt->execute();
			$invoice = $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "Error!: " . $e->getMessage() . "<br/>";
			print "SQL: " . $sql;
			die();		
		}
		return $invoice;
	}	

	
	/**
	 * Get the invoice details with ID
	 *
	 * @return invoice object
	 */
	public static function selectInvoice($id){
		include 'DBConstant.php';		
		//$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$invoice = null;
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT inv.ID,cc.CustomersID as CustomersID, inv.InvDate as InvDate, inv.Odometer, inv.JobDescription, inv.ResultNotes, inv.QuotationYN, inv.PreviousYN, inv.FullyPaidYN,inv.CustomerCarsID, " .
					"		SUM(floor(inp.Qty * inp.UnitCost)) as TotalAmount, inv.PaidAmount, inv.PayMethodCd, inv.PayDate, Users.ID as UsersID " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .
					" 		LEFT OUTER JOIN InvoiceParts inp ON inv.ID = inp.InvoicesID " .
					" WHERE inv.ID =:ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':ID',$id);
			$stmt->execute();
			$invoice = $stmt->fetch(PDO::FETCH_ASSOC);
            $invoice["PayMethodCd"] = $invoice["PayMethodCd"];
			$invoice["TotalAmount"] =  $invoice["TotalAmount"];
		}catch(PDOException $e){
			print "Error!: " . $e->getMessage() . "<br/>";
			print "SQL: " . $sql;
			die();		
		}
		return $invoice;
	}	
	
	public static function selectAllInvoices($CompaniesID){
		include 'DBConstant.php';	
		
		$invoices = array();
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT inv.ID,inv.InvDate as InvDate, CONCAT(cu.FirstName ,' ', cu.LastName) as CustomerName, " .
					" 		cc.RegNo, inv.PaidAmount, SUM(inp.Qty * inp.UnitCost) as TotalAmount, " .
					"		CONCAT(Users.FirstName , ' ' , Users.LastName) as Technician,cu.ID as CustomersID, inv.CustomerCarsID  " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .
					" 		LEFT OUTER JOIN InvoiceParts inp ON inv.ID = inp.InvoicesID " .
					" 		INNER JOIN Customers cu ON cc.CustomersID = cu.ID " .
					" WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL" . 
					" GROUP BY inv.ID";
			
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			$invoices = $stmt->fetchAll();
			
		
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();
		}
		return $invoices;	
	}

	public static function selectInvoicesByType($CompaniesID, $type){
		include 'DBConstant.php';		
		
		$sql = null;
		$invoices = array();
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT inv.ID,inv.InvDate as InvDate, CONCAT(cu.FirstName ,' ', cu.LastName) as CustomerName, " .
					" 		cc.RegNo, inv.PaidAmount, inv.TotalAmount, " .
					"		CONCAT(Users.FirstName , ' ' , Users.LastName) as Technician,cu.ID as CustomersID, inv.CustomerCarsID  " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .					
					" 		INNER JOIN Customers cu ON cc.CustomersID = cu.ID " .
					" WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL";
			if($type== 'Q'){
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN = 'Y' ";
			}else if($type=='P'){
				$sql = $sql . " and  inv.PreviousYN = 'Y' ";
			}else {
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN is NULL ";
			}
			
			$sql = $sql . " GROUP BY inv.ID";
			
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			
			$invoices = $stmt->fetchAll();

		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		
		return $invoices;	
	}

	public static function selectPaginatedInvoicesByType($CompaniesID, $type, $search,$start,$length){
		include 'DBConstant.php';		
		
		$sql = null;
		$invoices = array();
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

            $sql = "SELECT * FROM (" .
			$sql = "SELECT inv.ID,inv.InvDate as InvDate, CONCAT(cu.FirstName ,' ', cu.LastName) as CustomerName, " .
					" 		cc.RegNo, inv.PaidAmount, inv.TotalAmount, " .
					"		CONCAT(Users.FirstName , ' ' , Users.LastName) as Technician,cu.ID as CustomersID, inv.CustomerCarsID  " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .					
					" 		INNER JOIN Customers cu ON cc.CustomersID = cu.ID " .
					" WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL";
			if($type== 'Q'){
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN = 'Y' ";
			}else if($type=='P'){
				$sql = $sql . " and  inv.PreviousYN = 'Y' ";
			}else {
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN is NULL ";
			}
			
			$sql = $sql . " GROUP BY inv.ID" .
                    ") AAA " . 
                    " WHERE CONCAT(ID, InvDate, CustomerName, RegNo) like '%" . $search . "%'" .
                    " ORDER BY AAA.ID DESC " .
                    " limit  " . $start . " , " . $length;    			
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			
			$invoices = $stmt->fetchAll();

		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		
		return $invoices;	
	}    
	public static function selectInvoiceCountByType($CompaniesID, $type, $search) {
		include 'DBConstant.php';		
		
		$sql = null;
		$invoices = array();
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

            $sql = "SELECT count(*) FROM (" .
			$sql = "SELECT inv.ID,inv.InvDate as InvDate, CONCAT(cu.FirstName ,' ', cu.LastName) as CustomerName, " .
					" 		cc.RegNo, inv.PaidAmount, inv.TotalAmount, " .
					"		CONCAT(Users.FirstName , ' ' , Users.LastName) as Technician,cu.ID as CustomersID, inv.CustomerCarsID  " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .					
					" 		INNER JOIN Customers cu ON cc.CustomersID = cu.ID " .
					" WHERE cu.CompaniesID = :CompaniesID AND inv.Deleted is NULL";
			if($type== 'Q'){
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN = 'Y' ";
			}else if($type=='P'){
				$sql = $sql . " and  inv.PreviousYN = 'Y' ";
			}else {
				$sql = $sql . " and  inv.PreviousYN is NULL and  inv.QuotationYN is NULL ";
			}
			
			$sql = $sql . " GROUP BY inv.ID" .
                    ") AAA " . 
                    " WHERE CONCAT(ID, InvDate, CustomerName, RegNo) like '%" . $search . "%'";
                    		
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			
			$rows = $stmt->fetch(PDO::FETCH_NUM);

		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		
		return $rows[0];	        
    }
	//Insert a record into Invoices and return ID value
	public function insertInvoice(){
		include 'DBConstant.php';		
		$sql = null;
		$ID = -1;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));


			$sql = "INSERT INTO Invoices (Odometer, InvDate, JobDescription, ResultNotes, " .
						" QuotationYN, PreviousYN, FullyPaidYN, " .
						" TotalAmount, PaidAmount, PayMethodCd, PayDate, CustomerCarsID, UsersID) " . 
						" values (:Odometer, :InvDate, :JobDescription, :ResultNotes, :QuotationYN, :PreviousYN, :FullyPaidYN, " .
						":TotalAmount, :PaidAmount, :PayMethodCd, :PayDate, :CustomerCarsID, :UsersID)";				
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':Odometer',$this->Odometer);
			$stmt->bindParam(':InvDate',$this->InvDate);
			$stmt->bindParam(':JobDescription',$this->JobDescription);
			$stmt->bindParam(':ResultNotes',$this->ResultNotes);
			$stmt->bindParam(':QuotationYN',$this->QuotationYN);
			$stmt->bindParam(':PreviousYN',$this->PreviousYN);
			$stmt->bindParam(':FullyPaidYN',$this->FullyPaidYN);
			$stmt->bindParam(':TotalAmount',$this->TotalAmount);
			$stmt->bindParam(':PaidAmount',$this->PaidAmount);
			$stmt->bindParam(':PayMethodCd',$this->PayMethodCd);
			$stmt->bindParam(':PayDate',$this->PayDate);
			$stmt->bindParam(':CustomerCarsID',$this->CustomerCarsID);
			$stmt->bindParam(':UsersID',$this->UsersID);
			$stmt->execute();
			$affectedRows = $stmt->rowCount();
			
			if($affectedRows == 1){
				$ID = $dbc->lastInsertId();
			}
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		
		return $ID;	
	}
	
	public function updateInvoice(){
		include 'DBConstant.php';	
		
		$sql = null;
		$affectedRows = -1;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "UPDATE Invoices SET " ;
            if($this->Odometer != ""){
				$sql = $sql . " Odometer = " . $this->Odometer . ", ";
            }
            if($this->TotalAmount != ""){
				$sql = $sql . " TotalAmount = " . $this->TotalAmount . ", ";
            }   
            if($this->PaidAmount != ""){
				$sql = $sql . " PaidAmount = " . $this->PaidAmount . ", ";
            }  
            if($this->UsersID != ""){
				$sql = $sql . " UsersID = " . $this->UsersID . ", ";
            }              
            
            if($this->JobDescription != ""){
				$sql = $sql . " JobDescription = '" . $this->JobDescription . "', ";
            }              
            if($this->ResultNotes != ""){
				$sql = $sql . " ResultNotes = '" . $this->ResultNotes . "', ";
            }              
            if($this->QuotationYN != ""){
				$sql = $sql . " QuotationYN = '" . $this->QuotationYN . "', ";
            }              
            if($this->PreviousYN != ""){
				$sql = $sql . " PreviousYN = '" . $this->PreviousYN . "', ";
            }              
            if($this->FullyPaidYN != ""){
				$sql = $sql . " FullyPaidYN = '" . $this->FullyPaidYN . "', ";
            }              
            if($this->PayMethodCd != ""){
				$sql = $sql . " PayMethodCd = '" . $this->PayMethodCd . "', ";
            }              
            if($this->PayDate != ""){
				$sql = $sql . " PayDate = '" . $this->PayDate . "', ";
            }              
                        
            $sql = $sql . " InvDate = '" . $this->InvDate . "' ";
            $sql = $sql . " WHERE ID = " . $this->ID;
             
             
//			$sql = $sql . " InvDate = :InvDate, " .
//							" JobDescription = :JobDescription, " .
//							" ResultNotes = :ResultNotes, " .
//							" QuotationYN = :QuotationYN, " .
//							" PreviousYN = :PreviousYN, " .
//							" FullyPaidYN = :FullyPaidYN, " .
//							" PayMethodCd = :PayMethodCd, " .
//							" PayDate = :PayDate, " .
//						" WHERE ID = :ID";
		  
			$stmt = $dbc->prepare($sql);
//			$stmt->bindParam(':InvDate',$this->InvDate, PDO::PARAM_STR,10);
//			$stmt->bindParam(':JobDescription',$this->JobDescription);
//			$stmt->bindParam(':ResultNotes',$this->ResultNotes);
//			$stmt->bindParam(':QuotationYN',$this->QuotationYN, PDO::PARAM_STR,1);
//			$stmt->bindParam(':PreviousYN',$this->PreviousYN, PDO::PARAM_STR,1);
//			$stmt->bindParam(':FullyPaidYN',$this->FullyPaidYN, PDO::PARAM_STR,1);
//			$stmt->bindParam(':PayMethodCd',$this->PayMethodCd, PDO::PARAM_STR,2);
//			$stmt->bindParam(':PayDate',$this->PayDate, PDO::PARAM_STR,10);
//			$stmt->bindParam(':ID',$this->ID, PDO::PARAM_INT,11);
			
            $stmt->execute();
            $affectedRows = $stmt->rowCount();
//            echo $sql;
//echo $this->Odometer . '\n';
//			echo $this->InvDate . '\n';
//			echo $this->JobDescription . '\n';
//			echo $this->ResultNotes . '\n';
//			echo $this->QuotationYN . '\n';
//			echo $this->PreviousYN . '\n';
//			echo $this->FullyPaidYN . '\n';
//			echo $this->TotalAmount . '\n';
//			echo $this->PaidAmount . '\n';
//			echo $this->PayMethodCd . '\n';
//			echo $this->PayDate . '\n';
//			echo $this->UsersID . '\n';
//			echo $this->ID . '\n';
		}catch(PDOException $e){
            echo "ERROR" . $e;
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		
		return $affectedRows;	
	}	
	
	public static function deleteInvoice($ID) {
		include 'DBConstant.php';	
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
		
			$sql = "UPDATE Invoices SET Deleted='Y' WHERE ID = :ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':ID',$ID);
			$stmt->execute();
            $affectedRows = $stmt->rowCount();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
        return $affectedRows;
	}
	
}
class PayMethods {

	public static function selectAll(){
		include 'DBConstant.php';
		$sql = null;
		$paymethods = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
		
			$sql = "SELECT * FROM PayMethods";
			$stmt = $dbc->prepare($sql);
			$stmt->execute();

			$paymethods =$stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}
		return $paymethods;
	}
}

class InvoiceParts {
	public $ID;
	public $InvoicesID;
	public $PartsID;
	public $Qty;
	public $UnitCost;
	
	public static function selectInvoiceParts($InvoicesID){
		include 'DBConstant.php';	
		$sql = null;
		$partList = array();
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
		
			$sql = "SELECT ip.ID, ip.PartsID, pa.PartName, ip.Qty, ip.UnitCost, (ip.Qty * ip.UnitCost) as LineTotal " .
					" FROM InvoiceParts ip INNER JOIN Parts pa ON ip.PartsID = pa.ID WHERE ip.InvoicesID = :InvoicesID" ;
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':InvoicesID',$InvoicesID);
			$stmt->execute();
			
			while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				$partRow = new InvoiceParts;
				$partRow->ID = $row["ID"];
				$partRow->PartsID = $row["PartsID"];
				$partRow->PartName = $row["PartName"];
				$partRow->Qty = $row["Qty"];
				$partRow->UnitCost = $row["UnitCost"];
				$partRow->LineTotal =sprintf('%0.2f',$row["LineTotal"]);
				
				array_push($partList, $partRow);
			}
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}		
		return $partList;		
	}
	
	public function insert(){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "INSERT INTO InvoiceParts (InvoicesID, PartsID, Qty, UnitCost)  " .
					" values ('$this->InvoicesID', '$this->PartsID','$this->Qty', '$this->UnitCost')";				

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);
		$ID = -1;
		if($affectedRows == 1){
			$ID = mysqli_insert_id($dbc);
		}
		mysqli_close($dbc);
		
		return $ID;		
	}
	
	public function update(){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "Update InvoiceParts SET InvoicesID = '$this->InvoicesID'," .
						" PartsID =  '$this->PartsID', " .
						" Qty = '$this->Qty', " .
						" UnitCost = '$this->UnitCost' " .
					" WHERE ID = '$this->ID'";				

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);
		mysqli_close($dbc);
		
		return $affectedRows;		
	
	}
	
	public static function delete($ID){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "DELETE FROM InvoiceParts " .
					" WHERE ID = '$ID'";				

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);
		mysqli_close($dbc);
		
		return $affectedRows;		
		
	}
}

class Parts{
	public $ID;
	public $PartName;
	public $CompaniesID;
	
	public static function selectAll($CompaniesID,$term){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		//$query = "SELECT ID, PartName FROM Parts WHERE PartName like '%$term%' and CompaniesID = '$CompaniesID'";
		$query = "SELECT part.ID, part.PartName, inp.UnitCost " . 
					" FROM ( " .
					"	SELECT pa.ID, PartName, MAX( ip.ID ) inpID " . 
					"	FROM Parts pa LEFT JOIN InvoiceParts ip ON pa.ID = ip.PartsID " . 
					"	WHERE pa.PartName LIKE  '%$term%' " . 
					"		AND pa.CompaniesID ='$CompaniesID' " . 
					"	GROUP BY pa.ID, PartName " . 
					"	) part LEFT JOIN InvoiceParts inp ON part.inpID = inp.ID";

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$partList = array();
		$partRow = array();
		while($row = mysqli_fetch_assoc($result)){
			if($row["UnitCost"] > 0){
				$partRow["label"] = $row["PartName"] . " , $" . $row["UnitCost"];
			}else {
				$partRow["label"] = $row["PartName"];
			}
			$partRow["value"] = $row["ID"] . "|" . $row["PartName"] . "|" . $row["UnitCost"];
			array_push($partList, $partRow);
		}
		$result->free();
		mysqli_close($dbc);
		
		return $partList;				
	
	}
	public static function selectIDByName($PartName, $CompaniesID){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "SELECT ID FROM Parts WHERE Lower(PartName) = Lower('$PartName') and CompaniesID = '$CompaniesID'";
		
		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$ID = mysqli_fetch_assoc($result);
		$partID = null;
		if($ID != null){
			$partID = $ID["ID"];
		}
		$result->free();
		mysqli_close($dbc);
		
		return $partID;				
	}
	public static function insert($PartName, $CompaniesID){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "INSERT INTO Parts (PartName,CompaniesID) values ('$PartName','$CompaniesID')";

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);
		$ID = 0;
		if($affectedRows == 1){
			$ID = mysqli_insert_id($dbc);
		}
		mysqli_close($dbc);
		
		return $ID;				
	}
	
	public static function delete($ID){
		include 'DBConstant.php';	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "DELETE FROM Parts WHERE ID = '$ID'";

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);	
		
		return $affectedRows;
	}
}

?>
