<?php
class Pagination {
    
    public $Total;
    public $Data = array();
}
class Companies {

	public static function select($id){
		include 'DBConstant.php';		
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
	
		$sql = "SELECT * FROM Companies WHERE ID = $id";

		$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
		$row = mysqli_fetch_assoc($result);
		 /* free result set */
		 $result->free();

		/* close connection */
		mysqli_close($dbc);
		
		return $row;	
	}
    
    public static function updateCompanyName($id, $name) {
        include 'DBConstant.php';		
        $query = "";
        $result = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));


			if($id > 0 && $name != ""){
                
				$query = "UPDATE Companies SET " .
								" CompanyName = :CompanyName " . 
							" WHERE ID = :ID";
			}
					
			$stmt = $dbc->prepare($query);
            $stmt->bindParam(':CompanyName',$name);
            $stmt->bindParam(':ID',$id,PDO::PARAM_INT);
			$stmt->execute();
			$affectedRows = $stmt->rowCount();

          $result = array(
            "affectedRows" => $affectedRows
          );
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $query;
			die();		
		}
		
		return $result;        
        
    }
}

class Person {
	public $ID;
	public $Title;
	public $FirstName;
	public $LastName;
	public $Phone;
	public $Mobile;
	public $Email;
	public $StreetAddress;
	public $suburb;
	public $state;
	public $postcode;
	public $Deleted;
	public $CompaniesID;
}

class Customers extends Person {
	public $Notes;
	public static function selectInvoices($id){
		include 'DBConstant.php';	
		$sql = null;
		$invoices = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT inv.ID, inv.InvDate, cc.RegNo, inv.PaidAmount, Users.FirstName , Users.LastName,inv.FullyPaidYN, cc.ID CustomerCarsID, cc.CustomersID, " .
					"		SUM(floor(inp.Qty * inp.UnitCost)) as TotalAmount " .
					" FROM CustomerCars cc INNER JOIN Invoices inv ON cc.ID = inv.CustomerCarsID " .
					"		LEFT OUTER JOIN Users ON inv.UsersID = Users.ID " .
					" 		LEFT OUTER JOIN InvoiceParts inp ON inv.ID = inp.InvoicesID " .
					" WHERE cc.CustomersID =:id and cc.Deleted is NULL and inv.Deleted is NULL" .
					" GROUP BY inv.ID, inv.InvDate, cc.RegNo, inv.PaidAmount, Users.FirstName, Users.LastName" .
					" ORDER BY STR_TO_DATE( inv.InvDate,  '%d/%m/%Y' ) DESC";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':id',$id);
			$stmt->execute();
			$invoices = $stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}			
		
		return $invoices;

		
	}
	public static function selectCars($id){
		include 'DBConstant.php';		
		$sql = null;
		$customers = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cc.ID, cmk.MakerName, cm.ModelName,cc.RegNo, cc.Year,cc.VIN, cc.EngineNo,cc.ManualTransmissionYN, if(cc.ManualTransmissionYN = 'Y','Manual','Auto') as Transmission, cc.CarModelsID, cm.CarMakersID, max(iv.ID) MaxINV " . 
					" FROM CustomerCars cc INNER JOIN CarModels cm ON cc.CarModelsID = cm.ID " .
					" INNER JOIN CarMakers cmk ON cm.CarMakersID = cmk.ID " . 
                    " LEFT OUTER JOIN Invoices iv on cc.ID = iv.customercarsid " . 
					" WHERE cc.CustomersID = :id and cc.Deleted is NULL " . 
                    " GROUP BY  cc.ID, cmk.MakerName, cm.ModelName,cc.RegNo, cc.Year,cc.VIN, cc.EngineNo, " .
                    " cc.ManualTransmissionYN, Transmission, cc.CarModelsID, cm.CarMakersID " . 
                    " ORDER BY cc.ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':id',$id);
			$stmt->execute();
			$customers = $stmt->fetchAll();

		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}		
		return $customers;
	
	}

	public static function selectCar($CustomerCarsID){
		include 'DBConstant.php';		
		$sql = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cc.ID, cmk.MakerName, cm.ModelName,cc.RegNo, cc.Year,cc.VIN, cc.EngineNo, if(cc.ManualTransmissionYN = 'Y','Manual','Auto') as Transmission, cc.CarModelsID, cm.CarMakersID " . 
					" FROM CustomerCars cc INNER JOIN CarModels cm ON cc.CarModelsID = cm.ID " .
					" INNER JOIN CarMakers cmk ON cm.CarMakersID = cmk.ID " . 
					" WHERE cc.ID = :CustomerCarsID ORDER BY cc.ID";

			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CustomerCarsID',$CustomerCarsID);
			$stmt->execute();
			$customercar =  $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "Error!: " . $e->getMessage() . "<br/>";
			print "SQL: " . $sql;
			die();		
		}		
		
		return $customercar;
	
	}

	
	public static function selectOne($id){
		include 'DBConstant.php';		
		$sql = null;
		$customer = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cu.ID, cu.Title, cu.FirstName, cu.LastName, cu.Phone, cu.Mobile, cu.Email, cu.StreetAddress, cu.suburb, cu.state, cu.postcode, cu.Notes" . 
					" FROM  Customers cu WHERE cu.ID = :id";

			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':id',$id);
			$stmt->execute();
			$customer = $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}			
		return $customer;
	
	}

	public function save(){
		include 'DBConstant.php';	
		$query = "";
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			if($this->postcode == NULL || $this->postcode == ""){
				$this->postcode = "NULL";
			}
			if($this->ID > 0){
				$query = "UPDATE Customers SET " .
								" Title = :Title, " .
								" FirstName = :FirstName, " .
								" LastName = :LastName, " .
								" Phone = :Phone, " .
								" Mobile = :Mobile, " .
								" Email = :Email, " .
								" StreetAddress = :StreetAddress, " .
								" suburb = :suburb, " .
								" state = :state, " .
								" postcode = :postcode, " .
								" Notes = :Notes" . 
							" WHERE ID = :ID";
			}else {
				$query = "INSERT INTO Customers (Title,FirstName, LastName, Phone, Mobile, Email, StreetAddress, " .
							" suburb, state, postcode, Notes, CompaniesID) " . 
							" values (:Title,:FirstName, :LastName,:Phone, :Mobile, :Email, :StreetAddress, " .
							" :suburb, :state, :postcode, :Notes, :CompaniesID)";				
			}
					
			$stmt = $dbc->prepare($query);
			$stmt->bindParam(':Title',$this->Title);
			$stmt->bindParam(':FirstName',$this->FirstName);
			$stmt->bindParam(':LastName',$this->LastName);
			$stmt->bindParam(':Phone',$this->Phone);
			$stmt->bindParam(':Mobile',$this->Mobile);
			$stmt->bindParam(':Email',$this->Email);
			$stmt->bindParam(':StreetAddress',$this->StreetAddress);
			$stmt->bindParam(':suburb',$this->suburb);
			$stmt->bindParam(':state',$this->state);
			if($this->postcode == "NULL"){
				$this->postcode = NULL;
			}
			$stmt->bindParam(':postcode',$this->postcode);
			$stmt->bindParam(':Notes',$this->Notes);
			if($this->ID > 0){
				$stmt->bindParam(':ID',$this->ID,PDO::PARAM_INT);
			}else {
				$stmt->bindParam(':CompaniesID',$this->CompaniesID,PDO::PARAM_INT);
			}
//			var_dump($query);
//			var_dump($this);
//			var_dump($this->postcode);
			$stmt->execute();
			$affectedRows = $stmt->rowCount();
//			if($affectedRows == 1 && $this->ID == NULL){
//				$affectedRows = $dbc->lastInsertId();
//			}
          $result = array(
            "affectedRows" => $affectedRows,
            "ID" => $dbc->lastInsertId()
          );
          if($result["ID"] == "0") {
              $result["ID"] = $this->ID;
          }
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $query;
			die();		
		}
		
		return $result;
	}
	public static function deletePart($partID){
		include 'DBConstant.php';		
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$query = "DELETE FROM Parts where ID='$partID'";
		$result = mysqli_query($dbc,$query);	
		$affectedRows = mysqli_affected_rows($dbc);
		mysqli_close($dbc);
		
		return $affectedRows;
	}
		
	
	public static function delete($id){
		include 'DBConstant.php';		
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$query = "UPDATE Customers SET Deleted = 'Y' where ID='$id'";
		$result = mysqli_query($dbc,$query);	
		$affectedRows = mysqli_affected_rows($dbc);
		mysqli_close($dbc);
        $result = array(
            "affectedRows" => $affectedRows
        );		
		return $result;
	}
	
	public static function selectList($CompaniesID){
		include 'DBConstant.php';		
		
		$sql = null;
		$customers = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cu.ID, cu.FirstName, cu.LastName,  cu.Phone, cu.Mobile,  group_concat(cc.RegNo) as RegNo " . 
					" FROM `Customers`  cu LEFT OUTER JOIN CustomerCars cc ON cu.ID = cc.CustomersID " .
					" WHERE CompaniesID = :CompaniesID and cu.Deleted is NULL and cc.Deleted is NULL " .
					" Group by cu.ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			$customers = $stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $customers;
	
	}
	
	public static function selectPartInvoiceList($CompaniesID){
		include 'DBConstant.php';		
		
		$sql = null;
		$parts = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT pt.ID,pt.PartName, group_concat(ip.InvoicesID) InvoiceNos FROM `Parts` pt LEFT OUTER join InvoiceParts ip on pt.ID = ip.PartsID " .
					" WHERE pt.CompaniesID = :CompaniesID " .
					" Group by pt.ID ORDER BY pt.PartName";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			$parts = $stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $parts;
	}
	
	public static function selectCustomerWithInvNo($InvNo){
		include 'DBConstant.php';		
		
		$sql = null;
		$customer = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cu.ID, cu.Title, cu.FirstName, cu.LastName, cu.Phone, cu.Mobile, cu.Email, cu.StreetAddress, cu.suburb, cu.state, cu.postcode, cu.Notes " .
				   "	FROM Invoices iv " .
				   "	inner join CustomerCars cc ON iv.CustomerCarsID = cc.ID " .
				   "	inner join Customers cu ON cc.CustomersID = cu.ID " .
				   "	WHERE iv.ID = :InvNo ";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':InvNo',$InvNo);
			$stmt->execute();
			$customer = $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $customer;		
		
	}

	public static function selectListWithModel($CompaniesID){
		include 'DBConstant.php';		
		
		$sql = null;
		$customers = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT cu.ID, cu.FirstName, cu.LastName,  cu.Phone, cu.Mobile,  group_concat(cc.RegNo) as RegNo, GROUP_CONCAT( cm.ModelName ) AS ModelNames " . 
					" FROM `Customers`  cu LEFT OUTER JOIN CustomerCars cc ON cu.ID = cc.CustomersID " .
					" 	LEFT OUTER JOIN CarModels cm ON cc.CarModelsID = cm.ID " .
					" WHERE cu.CompaniesID = :CompaniesID and cu.Deleted is NULL and cc.Deleted is NULL " .
					" Group by cu.ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':CompaniesID',$CompaniesID);
			$stmt->execute();
			$customers = $stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $customers;
	
	}

	public static function selectPaginationListWithModel($CompaniesID, $search,$start,$length){
		include 'DBConstant.php';		
        
		$sql = null;
		$customers = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT * FROM (" .
                        "SELECT cu.ID, CONCAT(cu.FirstName, ' ', cu.LastName) as FullName,  cu.Phone, cu.Mobile,  group_concat(cc.RegNo) as RegNo, GROUP_CONCAT( cm.ModelName ) AS ModelNames " . 
					   " FROM `Customers`  cu LEFT OUTER JOIN CustomerCars cc ON cu.ID = cc.CustomersID " .
					   " 	LEFT OUTER JOIN CarModels cm ON cc.CarModelsID = cm.ID " .
					   " WHERE cu.CompaniesID = " . $CompaniesID . " and cu.Deleted is NULL and cc.Deleted is NULL " .
					   " Group by cu.ID" .
                    ") AAA " . 
                    " WHERE CONCAT(ID, FullName,Phone, Mobile, coalesce(RegNo,''),coalesce(ModelNames,'')) like '%" . $search . "%'" .
                    " ORDER BY AAA.ID DESC " .
                    " limit  " . $start . " , " . $length;                
                ;
//            print "SQL:" . $sql;
			$stmt = $dbc->prepare($sql);
            $stmt->execute();
			$customers = $stmt->fetchAll();
           
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $customers;
	
	}    
	public static function selectPaginationCount($CompaniesID, $search){
		include 'DBConstant.php';		
        
		$sql = null;
		$rows = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			
            $sql = "SELECT count(*) FROM (" .
                        "SELECT cu.ID, cu.FirstName, cu.LastName,  cu.Phone, cu.Mobile,  group_concat(cc.RegNo) as RegNo, GROUP_CONCAT( cm.ModelName ) AS ModelNames " . 
					   " FROM `Customers`  cu LEFT OUTER JOIN CustomerCars cc ON cu.ID = cc.CustomersID " .
					   " 	LEFT OUTER JOIN CarModels cm ON cc.CarModelsID = cm.ID " .
					   " WHERE cu.CompaniesID = " . $CompaniesID . " and cu.Deleted is NULL and cc.Deleted is NULL " .
					   " Group by cu.ID" .
                    ") AAA " . 
                    " WHERE CONCAT(ID, FirstName, LastName,Phone, Mobile, coalesce(RegNo,''),coalesce(ModelNames,'')) like '%" . $search . "%'";

			$stmt = $dbc->prepare($sql);
            $stmt->execute();
			$rows = $stmt->fetch(PDO::FETCH_NUM);
            
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}	
		return $rows[0];
	}        
}

class Users extends Person {
	public $Password;
	public $CompaniesID;
	public $RolesID;
    public $SmtpName;    
    public $SmtpPort;    
    public $SmtpPassword;
	public function save(){
		include 'DBConstant.php';		
        try{
            $dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
            if($this->postcode == ""){
				$this->postcode = NULL;
			}
            if($this->SmtpPort == ""){
				$this->SmtpPort = NULL;
			}
            
            if($this->ID > 0){
                $query = "UPDATE Users SET " .
                                " FirstName = :FirstName, " .
                                " LastName = :LastName, " .
                                " Phone = :Phone, " .
                                " Mobile = :Mobile, " .
                                " Email = :Email, " .
                                " Password = :Password, " .
                                " StreetAddress = :StreetAddress, " .
                                " suburb = :suburb, " .
                                " state = :state, " .
                                " postcode = :postcode, " .
                                " RolesID = :RolesID," . 
                                " SmtpName = :SmtpName," . 
                                " SmtpPort = :SmtpPort," . 
                                " SmtpPassword = :SmtpPassword " . 
                            " WHERE ID = " . $this->ID;
            }else {
                $query = "INSERT INTO Users (FirstName, LastName, Phone, Mobile, Email,Password, StreetAddress, " .
                            " suburb, state, postcode, CompaniesID, RolesID, SmtpName, SmtpPort, SmtpPassword) " . 
                            " values (:FirstName, :LastName, :Phone, :Mobile, :Email, :Password, :StreetAddress, " .
                            ":suburb, :state, :postcode, " . $this->CompaniesID . ", :RolesID, :SmtpName, :SmtpPort, :SmtpPassword)";				
            }
            $stmt = $dbc->prepare($query);
            $stmt->bindParam(':FirstName',$this->FirstName);
            $stmt->bindParam(':LastName',$this->LastName);
            $stmt->bindParam(':Phone',$this->Phone);
            $stmt->bindParam(':Mobile',$this->Mobile);
            $stmt->bindParam(':Email',$this->Email);
            $stmt->bindParam(':Password',$this->Password);
            $stmt->bindParam(':StreetAddress',$this->StreetAddress);
            $stmt->bindParam(':suburb',$this->suburb);
            $stmt->bindParam(':state',$this->state);
            $stmt->bindParam(':postcode',$this->postcode);
            $stmt->bindParam(':RolesID',$this->RolesID);
            $stmt->bindParam(':SmtpName',$this->SmtpName);
            $stmt->bindParam(':SmtpPort',$this->SmtpPort);
            $stmt->bindParam(':SmtpPassword',$this->SmtpPassword);

            $stmt->execute();
            
            $arr = $stmt->errorInfo();
            $errmsg = '';
            if($arr[0] != '0000'){
                $errmsg = $arr[2];
            }
//            print_r($arr);
            
            $affectedRows = $stmt->rowCount();
            $lastInsertId = 0;
            if($affectedRows == 1 && $this->ID == NULL){
                $lastInsertId = $dbc->lastInsertId();
            }
            $result = array(
                "affectedRows" => $affectedRows,
                "ID" => $lastInsertId,
                "Error" => $errmsg
            );  		
            return $result;            
        }catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $query;
			die();	            
        }
        
		
	}
	
	public static function delete($id){
		include 'DBConstant.php';		
		try{
            $dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
            $query = "UPDATE Users SET Deleted = 'Y' where ID= :ID";
            $stmt = $dbc->prepare($query);
            $stmt->bindParam(':ID',$id);
            $stmt->execute();
            
            $arr = $stmt->errorInfo();
            $errmsg = '';
            if($arr[0] != '0000'){
                $errmsg = $arr[2];
            }
            
            $affectedRows = $stmt->rowCount();
		
            $result = array(
                "affectedRows" => $affectedRows,
                "Error" => $errmsg
            );  		  		
            return $result;
        }catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $query;
			die();	            
        }
	}
	
	public static function selectRoles($RolesID){
        include 'DBConstant.php';	
		$sql = null;
		$roles = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT *  FROM Roles WHERE ID <= :ID";
			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':ID',$RolesID);
			$stmt->execute();
			$roles = $stmt->fetchAll();
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}			
		
		return $roles;
	}

	public static function selectAllUsers(){
		include 'DBConstant.php';		
	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$sql = "SELECT us.ID, FirstName, LastName, Email, Phone, Mobile, Password, CompaniesID, us.Deleted, ro.RoleName " . 
				" FROM Users us INNER JOIN Roles ro ON us.RolesID = ro.ID";
	
		$result = mysqli_query($dbc,$sql) or die('Error to query SQL : \n' . $sql);
		$users = array();
		while($row = mysqli_fetch_assoc($result)){
			array_push($users,$row);
		}
		 /* free result set */
		$result->free();

		/* close connection */
		mysqli_close($dbc);
		
		return $users;	
	}

	
	public static function selectUsers($CompaniesID){
		include 'DBConstant.php';		
	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$sql = "SELECT us.ID, FirstName, LastName, Email, Phone, Mobile, Password, CompaniesID,us.Deleted, ro.RoleName " . 
				" FROM Users us INNER JOIN Roles ro ON us.RolesID = ro.ID" .
				" WHERE CompaniesID = '$CompaniesID' and Deleted is NULL";
	
		$result = mysqli_query($dbc,$sql) or die('Error to query SQL : \n' . $sql);
		$users = array();
		while($row = mysqli_fetch_assoc($result)){
			array_push($users,$row);
		}
		 /* free result set */
		$result->free();

		/* close connection */
		mysqli_close($dbc);
		
		return $users;	
	}

	public static function selectUserIDName($CompaniesID){
		include 'DBConstant.php';		
	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$sql = "SELECT ID, CONCAT(FirstName, ' ', LastName) FullName from Users " . 
				" WHERE CompaniesID = '$CompaniesID' and Deleted is NULL";
	
		$result = mysqli_query($dbc,$sql) or die('Error to query SQL : \n' . $sql);
		$users = array();
		while($row = mysqli_fetch_assoc($result)){
			array_push($users,$row);
		}
		 /* free result set */
		$result->free();

		/* close connection */
		mysqli_close($dbc);
		
		return $users;	
	}
    
    public static function selectOneByID ($id) {
        include 'DBConstant.php';		
        $sql = null;
		$user = null;
		try{
			$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));

			$sql = "SELECT Users.ID,    FirstName,    LastName,    Users.Phone,    Users.Mobile,    Users.Email,    Users.Password,    " .
                    "   Users.StreetAddress,    Users.suburb,    Users.state,    Users.postcode,    " .
                    "   Users.RolesID,    Users.SmtpName,    Users.SmtpPort,    Users.SmtpPassword, Companies.CompanyName " . 
                    " FROM Users inner join Companies on Users.CompaniesID = Companies.ID where Users.ID = :ID";

			$stmt = $dbc->prepare($sql);
			$stmt->bindParam(':ID',$id);
			$stmt->execute();
            
            $arr = $stmt->errorInfo();
            $errmsg = '';
            if($arr[0] != '0000'){
                $errmsg = $arr[2];
                echo $errmsg;
            }
            
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			print "ERROR:" . $e->getMessage() . "<br/>";
			print "SQL:" . $sql;
			die();		
		}			
		return $user;
        
    }
	public static function selectOne($email){
		include 'DBConstant.php';		
	
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
		$dbc->stmt_init();
		$stmt = $dbc->prepare("SELECT us.ID, FirstName, LastName, Email, Phone, Mobile, Password, CompaniesID, RolesID, ro.RoleName " . 
				" FROM Users us INNER JOIN Roles ro ON us.RolesID = ro.ID" .
				" WHERE Email = ?");
		$stmt->bind_param('s',$email);
		$stmt->execute();
		// $result = $stmt->get_result();
		$stmt->bind_result($ID, $FirstName, $LastName,$Email, $Phone,$Mobile, $Password, $CompaniesID,$RolesID, $RoleName);
		$users = array();
		while($stmt->fetch()){
			$row = array();
			$row["ID"] = $ID;
			$row["FirstName"] = $FirstName;
			$row["LastName"] = $LastName;
			$row["Email"] = $Email;
			$row["Phone"] = $Phone;
			$row["Mobile"] = $Mobile;
			$row["Password"] = $Password;
			$row["CompaniesID"] = $CompaniesID;
			$row["RolesID"] = $RolesID;
			$row["RoleName"] = $RoleName;
			
			array_push($users,$row);
		}
		$stmt->close();
		mysqli_close($dbc);
		
		return $users;	
	}

//	public static function selectByID($ID){
//		include 'DBConstant.php';		
//	
//		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
//
//		$sql = "SELECT us.ID, FirstName, LastName,Phone, Mobile,StreetAddress,suburb,state,postcode,SmtpName, SmtpPort, SmtpPassword, Email, Phone, Mobile, Password, CompaniesID,us.RolesID, ro.RoleName " . 
//				" FROM Users us INNER JOIN Roles ro ON us.RolesID = ro.ID" .
//				" WHERE us.ID = '$ID'";
//	
//		$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
//		$users = array();
//		while($row = mysqli_fetch_assoc($result)){
//			array_push($users,$row);
//		}
//		 /* free result set */
//		$result->free();
//
//		/* close connection */
//		mysqli_close($dbc);
//		
//		return $users;	
//	}
	
}

class CustomerCars {
	public $ID;
	public $RegNo;
	public $Year;
	public $VIN;
	public $EngineNo;
	public $ManualTransmissionYN;
	public $CustomersID;
	public $CarModelsID;
	public $Model;
	public $Maker;
	public $CarMakersID;
	public function save(){
		include 'DBConstant.php';		
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		if($this->ID > 0){
			$query = "UPDATE CustomerCars SET " .
							" RegNo = '$this->RegNo', " .
							" Year = '$this->Year', " .
							" VIN = '$this->VIN', " .
							" EngineNo = '$this->EngineNo', " .
							" ManualTransmissionYN = '$this->ManualTransmissionYN', " .
							" CustomersID = '$this->CustomersID', " .
							" CarModelsID = '$this->CarModelsID' " . 
						" WHERE ID = '$this->ID'";
		}else {
			$query = "INSERT INTO CustomerCars (RegNo, Year, VIN, EngineNo, ManualTransmissionYN, CustomersID, " .
						" CarModelsID) " . 
						" values ('$this->RegNo', '$this->Year','$this->VIN', '$this->EngineNo', '$this->ManualTransmissionYN', '$this->CustomersID', " .
						"'$this->CarModelsID')";				
		}
//		echo $query;
		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);

		if($affectedRows == 1 && $this->ID == null){
			$affectedRows = mysqli_insert_id($dbc);
		}
		
		mysqli_close($dbc);
		
		return $affectedRows;		
	}
	
	public static function delete($ID){
		include 'DBConstant.php';		
		$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

		$query = "UPDATE CustomerCars SET Deleted='Y' " . 
					" WHERE ID = '$ID'";

		$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
		$affectedRows = mysqli_affected_rows($dbc);
		
		mysqli_close($dbc);
		
		return $affectedRows;		
	}
}
?>
