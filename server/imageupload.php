<?php // You need to add server side validation and better error handling here

$data = array();
$count = 0;

$prefix = $_GET['prefix'];

if(isset($_GET['files'])) {
	$error = false;
	$files = array();

	$uploaddir = './../content/images/';
	foreach($_FILES as $file) {
		$fileName = basename($file['name']);
    $info = pathinfo($fileName);
    $extension = $info['extension'];
    $tempName = str_replace(".".$extension, "", $fileName);
    $tempName = preg_replace('/[^A-Za-z0-\9\-]/', '', $tempName);
    if (!file_exists($uploaddir.$fileName)) {
      $fileName = $prefix.'_0_dest.'.$extension;
    }
		while( file_exists($uploaddir.$fileName) ) {
			$info = pathinfo($fileName);
			$extension = $info['extension'];
			$name = str_replace(".".$extension, "", $fileName);

			$count++;
			$fileName = $prefix.'_'.$count."_dest.".$extension;
		}

		$destName = $prefix.'_'.$count."_dest.".$extension;
		$thumbName = $prefix.'_'.$count."_thumb.".$extension;

		list($origWidth, $origHeight) = getimagesize($file['tmp_name']);
		$newWidth = 1920;
		$newHeight = intval($newWidth * $origHeight / $origWidth);
		$thumbWidth = 320;
		$thumbHeight = intval($thumbWidth * $origHeight / $origWidth);

		// Load
		$thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
		$dest = imagecreatetruecolor($newWidth, $newHeight);
		$source = imagecreatefromjpeg($file['tmp_name']);

		$exif = exif_read_data($file['tmp_name']);
		if (!empty($exif['Orientation'])) {
			switch ($exif['Orientation']) {
				case 3:
          $source = imagerotate($source, 180, 0);
          break;
      	case 6:
          $source = imagerotate($source, -90, 0);
          break;
      	case 8:
          $source = imagerotate($source, 90, 0);
          break;
        }
		}

		// Resize
		imagecopyresized($dest, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
		imagecopyresized($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $origWidth, $origHeight);



		// Save
		if (imagejpeg($dest, $uploaddir.$destName, 75) && imagejpeg($thumb, $uploaddir.$thumbName, 75)) {
			$files[] = $uploaddir.$thumbName;
		} else {
			$error = true;
		}

		// if( move_uploaded_file($file['tmp_name'], $uploaddir.$fileName) ) {
		// 	$files[] = $uploaddir.$fileName;
		// } else {
		//     $error = true;
		// }
		/*
		if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name']))) {
			$files[] = $uploaddir .$file['name'];
		} else {
		    $error = true;
		}
		*/
	}
	$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
} else {
	$data = array('success' => 'Form was submitted', 'formData' => $_POST);
}

echo json_encode($data);

?>
