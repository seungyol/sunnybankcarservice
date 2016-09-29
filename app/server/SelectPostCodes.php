<?php
	include 'DBConstant.php';
	$term = trim(strip_tags($_GET['term']));
	
	$dbc = mysqli_connect($HOST_NM,$USER_ID,$PASSWORD,$DB_NM) or die('Error connecting to MySQL server.');

	$query = "SELECT suburb, state, postcode FROM PostCodes WHERE suburb like '%$term%'";

	$result = mysqli_query($dbc,$query) or die("Error to execute SQL");	
	$suburbList = array();
    $suburbItem = array();
	while($row = mysqli_fetch_assoc($result)){
        $suburbItem["value"] = $row["suburb"] . ',' . $row["state"] . ',' . $row["postcode"];
        $suburbItem["label"] = $row["suburb"];
        array_push($suburbList, $suburbItem);
	}
			
	$result->free();
	mysqli_close($dbc);
	
	echo json_encode($suburbList);
	flush();
?> 