<?php
	class CarModels{
		public static function selectIDByName($CompaniesID, $CarMakersID, $ModelName){
			include 'DBConstant.php';		
			$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

			$sql = "SELECT ID " .
					" FROM CarModels " .
					" WHERE CompaniesID ='$CompaniesID' AND CarMakersID = '$CarMakersID' AND ModelName = '$ModelName'";

			$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
			$ModelID = 0;
			while($row = mysqli_fetch_assoc($result)){
				$ModelID = $row["ID"];
			}
			
			 /* free result set */
			 $result->free();

			/* close connection */
			mysqli_close($dbc);
			
			return $ModelID;		
		}
	
		public static function insert($ModelName, $CarMakersID, $CompaniesID){
			include 'DBConstant.php';		
			$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');
			$sql = "insert into CarModels (ModelName, CarMakersID, CompaniesID) values ('$ModelName','$CarMakersID','$CompaniesID')";
			
			$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
			$affectedRow = mysqli_affected_rows($dbc);
			$modelID = 0;
			if($affectedRow == 1){
				$sql = "SELECT ID FROM CarModels WHERE CarMakersID ='$CarMakersID' AND ModelName = '$ModelName'";
				$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
				$row = mysqli_fetch_assoc($result);
				$modelID = $row["ID"];
			}
							
			mysqli_close($dbc);
			return $modelID;
		}
		
		public static function selectAll($CarMakersID,$term, $CompaniesID){
			include 'DBConstant.php';		
			$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

			$sql = "SELECT ID, ModelName " .
					" FROM CarModels " .
					" WHERE CompaniesID =$CompaniesID and CarMakersID ='$CarMakersID' AND ModelName like '%" . $term . "%'" . 
					" ORDER BY ModelName";

			$result = mysqli_query($dbc,$sql) or die('Error to query SQL');
			$carmakers = array();
			$carmakers_row = array();
			
			while($row = mysqli_fetch_assoc($result)){
				$carmakers_row["value"] = $row["ID"];
				$carmakers_row["label"] = $row["ModelName"];
				
				array_push($carmakers,$carmakers_row);
			}
			
			 /* free result set */
			 $result->free();

			/* close connection */
			mysqli_close($dbc);
			
			return $carmakers;		
		}
	
	}
?>