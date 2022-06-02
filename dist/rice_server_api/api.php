<?php

include 'common.php';



//handle login request
if(isset($_POST['login'])){
	$stmt = $db->prepare("SELECT * FROM users WHERE username=:username AND password=:password LIMIT 1");
	$stmt->execute(['username' => $_POST['username'],'password'=>$_POST['password']]); 
	$user = $stmt->fetch(PDO::FETCH_ASSOC);
	
	if($user){
		$stmt = $db->prepare("SELECT * FROM areas WHERE user_id=".$user['id']);
		$stmt->execute(); 
		$farms = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$user['farms'] = $farms;
	}
	
	echo json_encode($user);
	
}

//handle update profile
if(isset($_POST['update_profile'])){

	$stmt = $db->prepare("UPDATE `users` SET `password` = :password, `first_name` = :first_name, `middle_name` = :middle_name, `last_name` = :last_name, `address` = :address WHERE `users`.`id` = :user_id;");
	if($stmt->execute($_POST['data'])){
		echo "1";
	}else{
		echo "0";
	}

}

//handle add area
if(isset($_POST['add_area'])){

	$stmt = $db->prepare("INSERT INTO `areas` (`id`, `name`, `location`, `user_id`) VALUES (NULL, :name, :location, :user_id)");
	if($stmt->execute($_POST['data'])){
		
		$stmt1 = $db->prepare("SELECT * FROM areas WHERE user_id=:user_id ");
		$stmt1->execute(['user_id' => $_POST['data']['user_id']]); 
		$areas = $stmt1->fetchAll(PDO::FETCH_ASSOC);
		
		
		echo json_encode($areas);
	}else{
		echo "0";
	}

}


//handle list area
if(isset($_POST['list_area'])){
	

	$stmt1 = $db->prepare("SELECT * FROM areas WHERE user_id=:user_id ");
	$stmt1->execute(['user_id' => $_POST['user_id']]); 
	$areas = $stmt1->fetchAll(PDO::FETCH_ASSOC);
	
	
	echo json_encode($areas);


}
//handle delete area
if(isset($_POST['delete_area'])){
	
	$stmt = $db->prepare("DELETE FROM `areas` WHERE `areas`.`id` = :id");
	if($stmt->execute(['id' => $_POST['id']])){
		
		$stmt1 = $db->prepare("SELECT * FROM areas WHERE user_id=:user_id ");
		$stmt1->execute(['user_id' => $_POST['user_id']]); 
		$areas = $stmt1->fetchAll(PDO::FETCH_ASSOC);
		
		
		echo json_encode($areas);
	}else{
		echo "0";
	}

}

//handle create_account profile
if(isset($_POST['create_account'])){
	
	
	try {
		$stmt = $db->prepare("INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `middle_name`, `last_name`, `address`, `role`) VALUES (NULL, :username, :password, :first_name, :middle_name, :last_name, :address, 'user')");
		
		
		if($stmt->execute($_POST['data'])){
			echo "1";
		}else{
			echo "Failed on creating Account, Try again later.";
		}
	} catch (PDOException $e) {
		echo $e->errorInfo[2];
	}
	
	
	

}


//handle report request
if(isset($_POST['get_report'])){

//SELECT images.*,month(datetime) as month, diseases.name as disease_name, diseases.description as disease_description, areas.name as area_name, areas.location as area_location FROM `images` left join diseases on images.disease_id = diseases.id left join areas on images.area_id = areas.id

	//all user report
	//$stmt = $db->prepare("SELECT images.*,month(images.datetime) as month, diseases.name as disease_name, diseases.description as disease_description, areas.name as area_name, areas.location as area_location FROM `images` left join diseases on images.disease_id = diseases.id left join areas on images.area_id = areas.id");
	//$stmt->execute(); 
	
	$stmt = $db->prepare("SELECT images.*,month(images.datetime) as month, diseases.name as disease_name, diseases.description as disease_description, areas.name as area_name, areas.location as area_location FROM `images` left join diseases on images.disease_id = diseases.id left join areas on images.area_id = areas.id WHERE images.user_id=:user_id");
	$stmt->execute(['user_id' => $_POST['user_id']]); 
	
	
	$images = $stmt->fetchAll(PDO::FETCH_ASSOC);
	


echo '<table class="table table-sm table-bordered" style="font-size:.5em;">
			  <thead>
				<tr>
				  <th scope="col">#</th>
				  <th scope="col">Image</th>
				  <th scope="col">Disease</th>
				  <th scope="col">Datetime</th>
				  <th scope="col">Confidence %</th>
				</tr>
			  </thead>
			  <tbody>';
			  
			  $counter = 1;
			  foreach($images as $image){
				$img_url = str_replace('api.php','','http://'.$_SERVER['SERVER_NAME'].''.$_SERVER['REQUEST_URI'].''.$image['name']);
				echo '
					<tr>
				  <th scope="row">'.$counter.'</th>
				  <td> <image src="'.$img_url.'" style="width:20px;"/></td>
				  <td>'.$image['disease_name'].'</td>
				  <td>'.$image['datetime'].'</td>
				  <td>'.$image['value'].'</td>
				</tr>
				';
				
				$counter++;
			  
			  }
				
				
				
echo '		  </tbody>
		</table>
        
		';
		

		$_disease = [
		'1'=>[0,0,0,0,0,0,0,0,0,0,0,0],
		'2'=>[0,0,0,0,0,0,0,0,0,0,0,0],
		'3'=>[0,0,0,0,0,0,0,0,0,0,0,0],
		];
		$_disease_count = ['1'=>0,'2'=>0,'3'=>0];
		
		$_total_count = 0;
		foreach($images as $image){
		
		$_disease[$image['disease_id']][$image['month']-1] += 1; 
		
		
		$_disease_count[$image['disease_id']]++; 
		$_total_count++;
		}
		
		
			echo "<p class='fs-6'>Bars represent the total count of diseases in percentage form.</p>";
			echo 'Leaf Blight <div class="progress">
			  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: '.(($_disease_count[1]*100) / $_total_count).'%"></div>
			'.number_format(($_disease_count[1]*100) / $_total_count,2).'%</div>';
			echo 'Tungro <div class="progress">
			  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: '.(($_disease_count[2]*100) / $_total_count).'%"></div>
			'.number_format(($_disease_count[2]*100) / $_total_count,2).'%</div>';
			echo 'Leaf Blast <div class="progress">
			  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: '.(($_disease_count[3]*100) / $_total_count).'%"></div>
			'.number_format(($_disease_count[3]*100) / $_total_count,2).'%</div>';
			
			
			echo '
			<br/>
			<table class="table table-sm table-bordered" style="font-size:.8em">
				  <thead>
					<tr>
					  <th scope="col">#</th>
					  <th scope="col">Disease</th>
					  <th scope="col">Total Count</th>
					</tr>
				  </thead>
				  <tbody>
					<tr>
					  <th scope="row">1</th>
					  <td>Leaf Blight </td>
					  <td>'.$_disease_count[1].'</td>
					</tr>
					<tr>
					  <th scope="row">2</th>
					  <td>Tungro</td>
					  <td>'.$_disease_count[2].'</td>
					</tr>
					<tr>
					  <th scope="row">3</th>
					  <td>Leaf Blast </td>
					  <td>'.$_disease_count[3].'</td>
					</tr>
				  </tbody>
				</table>
			';

echo "

	<script>
		dataSets = {
						labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						datasets: [{
							label: 'leaf blight',
							data: [".implode(',',$_disease[1])."],
							backgroundColor: [
								'rgba(255, 99, 132, 1)',
							],
							borderColor: [
								'rgba(255, 99, 132, 1)',
							],
							borderWidth: 1
						},
						
						{
							label: 'tungro',
							data: [".implode(',',$_disease[2])."],
							backgroundColor: [
								'rgba(54, 162, 235, 1)',
							],
							borderColor: [
								'rgba(54, 162, 235, 1)',
							],
							borderWidth: 1
						},
						
						{
							label: 'leaf blast',
							data: [".implode(',',$_disease[3])."],
							backgroundColor: [
								'rgba(255, 206, 86, 1)',
							],
							borderColor: [
								'rgba(255, 206, 86, 1)',
							],
							borderWidth: 1
						}
						]
					};
			
			
				const ctx = document.getElementById('chart').getContext('2d');
				const myChart = new Chart(ctx, {
					type: 'line',
					data: dataSets,
					options: {
						scales: {
							y: {
								beginAtZero: true
							}
						}
					}
				});
	</script>
";

}


//handle upload Image version 1
if(isset($_POST['upload_image'])){
	
	
	
	$image =  imagesaver($_POST['imgBase64']); //use full base64 data 
	
	$_diseases = [
	  "leaf_blight"=>1,
	  "tungro"=>2,
	  "leaf_blast"=>3
	  ];
	
	$data = [
		'name'=>$image,
		'datetime'=>date('Y-m-d H:i:s'),
		'value'=>$_POST['value'],
		'user_id'=>$_POST['user_id'],
		'area_id'=>$_POST['area_id'],
		'disease_id'=>$_diseases[$_POST['disease_id']],
	];
	$stmt = $db->prepare("
		INSERT INTO `images` (`id`, `name`, `datetime`, `value`, `user_id`, `area_id`, `disease_id`) VALUES 
		(NULL, :name, :datetime, :value, :user_id, :area_id, :disease_id)
		");
	$stmt->execute($data);
	echo $image;
}

function imagesaver($image_data){
	
    list($type, $data) = explode(';', $image_data); // exploding data for later checking and validating 

    if (preg_match('/^data:image\/(\w+);base64,/', $image_data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
            throw new \Exception('invalid image type');
        }

        $data = base64_decode($data);

        if ($data === false) {
            throw new \Exception('base64_decode failed');
        }
    } else {
        throw new \Exception('did not match data URI with image data');
    }

    $fullname = 'images/'.uniqid().'.'.$type;

    if(file_put_contents($fullname, $data)){
        $result = $fullname;
    }else{
        $result =  "error";
    }
    /* it will return image name if image is saved successfully 
    or it will return error on failing to save image. */
    return $result; 
}
