<?php
    include 'CustomerModel.php';
        
   //print_r($_GET);
	// var_dump($search);
    $roleName = $_GET["RoleName"];
    if($roleName != "Super User") {
        $users = Users::selectUsers($_GET["CompaniesID"]);
    } else {
        $users = Users::selectAllUsers();
    }
	
	//print "customers count" . count($customers);
    $array = array(
        "data" => $users
    );
	$php = json_encode($array);
	echo $php;	
	flush();        
?>