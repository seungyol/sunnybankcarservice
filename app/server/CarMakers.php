<?php
	class CarMakers{
		public static function insert($MakerName, $CompaniesID){
			include 'DBConstant.php';
			$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

			$sql = "insert into CarMakers (MakerName, CompaniesID) values ('$MakerName', '$CompaniesID')";

			$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
			$affectedRow = mysqli_affected_rows($dbc);
			$CarMakersID = 0;
			
			if($affectedRow == 1){
				$sql = "SELECT ID " .
						" FROM CarMakers " .
						" WHERE CompaniesID ='$CompaniesID' AND MakerName = '$MakerName'";

				$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
				
				$row = mysqli_fetch_assoc($result);
				$CarMakersID = $row["ID"];
			}
			mysqli_close($dbc);
			
			return $CarMakersID;
		}
		
		public static function selectAll($CompaniesID){
			include 'DBConstant.php';		
			$sql = "SELECT ID, MakerName " .
					" FROM CarMakers " .
					" WHERE CompaniesID =:CompaniesID ORDER BY Priority";

			try{
				$dbc = new PDO('mysql:host=' . $HOST_NM . ';dbname=' . $DB_NM, $USER_ID,$PASSWORD, array( PDO::ATTR_PERSISTENT => true));
				$stmt = $dbc->prepare($sql);
				$stmt->bindParam(':CompaniesID',$CompaniesID);
				$stmt->execute();
				$carmakers = array();
				$carmakers_row = array();
				
				while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					$carmakers_row["value"] = $row["ID"];
					$carmakers_row["label"] = $row["MakerName"];
					
					array_push($carmakers,$carmakers_row);
				}
			
			}catch(PDOException $e){
				print "ERROR:" . $e->getMessage() . "<br/>";
				print "SQL:" . $sql;
				die();		
			}			
			return $carmakers;		
		}
	
	}
?>