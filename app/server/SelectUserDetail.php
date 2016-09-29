<?php
    include 'CustomerModel.php';
        
   //print_r($_GET);
	// var_dump($search);
    $ID = $_GET["ID"];
    if($ID != 0) {
        $user = Users::selectOneByID($ID);
    }else {
        $user = null;
    }
    
    $roles = Users::selectRoles($_GET["RolesID"]);
	
	//print "customers count" . count($customers);
    $array = array(
        "user" => $user,
        "roles" => $roles
    );
	$php = json_encode($array);
	echo $php;	
	flush();        
?>