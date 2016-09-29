<?php
	include 'CustomerModel.php';
	$action= $_POST["action"];
	if($action == 'SAVE'){
		$user = new Users();
        if(isset( $_POST["ID"])){
            $user->ID = $_POST["ID"];
        }
		
		$user->FirstName = $_POST["FirstName"];
		$user->LastName = $_POST["LastName"];
        if(isset( $_POST["Phone"])){
            $user->Phone = $_POST["Phone"];
        }
        if(isset( $_POST["Mobile"])){
            $user->Mobile = $_POST["Mobile"];
        }
        if(isset( $_POST["Email"])){
            $user->Email = $_POST["Email"];
        }
        if(isset( $_POST["StreetAddress"])){
            $user->StreetAddress = $_POST["StreetAddress"];
        }
        if(isset( $_POST["suburb"])){
            $user->suburb = $_POST["suburb"];
        }
        if(isset( $_POST["state"])){
            $user->state = $_POST["state"];
        }
        if(isset( $_POST["postcode"])){
            $user->postcode = $_POST["postcode"];
        }
        if(isset( $_POST["RolesID"])){
            $user->RolesID = $_POST["RolesID"];
        }    
        if(isset( $_POST["SmtpName"])){
            $user->SmtpName = $_POST["SmtpName"];
        }
        if(isset( $_POST["SmtpPort"])){
            $user->SmtpPort = $_POST["SmtpPort"];
        }
        if(isset( $_POST["SmtpPassword"])){
            $user->SmtpPassword = $_POST["SmtpPassword"];
        }
        if(isset( $_POST["Password"])){
            $user->Password = $_POST["Password"];
        }  
        $user->CompaniesID = $_POST["CompaniesID"];
        
		$result = $user->save();
		
		echo json_encode($result);		
//	}else if($action == 'SELECT'){
//		$seluser = Users::selectByID($_POST["ID"]);
//		echo json_encode($seluser);
//		flush();
	}else {
		$result = Users::delete($_POST["ID"]);
		echo json_encode($result);		
	}

?> 