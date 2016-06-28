<?php // You need to add server side validation and better error handling here

	$count = 0;
	$prefix = $_POST['prefix'];
	$image = $_POST['image'];
	$type = $_POST['type'];
	$extension = str_replace('image/', '', $type);
	$image = str_replace('data:'.$type.';base64,', '', $image);
	$image = str_replace(' ', '+', $image);
	$imageData = base64_decode($image);

	list($origWidth, $origHeight) = getimagesizefromstring($imageData);
	$newWidth = 1920;
	$newHeight = intval($newWidth * $origHeight / $origWidth);
	$thumbWidth = 320;
	$thumbHeight = intval($thumbWidth * $origHeight / $origWidth);

	// File name
	$uploaddir = './../content/images/';
	$destName = $prefix.'_'.$count."_dest.".$extension;
	while ( file_exists($uploaddir.$destName) ) {
		$count++;
		$destName = $prefix.'_'.$count."_dest.".$extension;
	}
	$thumbName = $prefix.'_'.$count."_thumb.".$extension;

	// Load
	$thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
	$dest = imagecreatetruecolor($newWidth, $newHeight);
	$source = imagecreatefromstring($imageData);


	// Resize
	imagecopyresized($dest, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
	imagecopyresized($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $origWidth, $origHeight);

	// Save
	$error = false;
	if (imagejpeg($dest, $uploaddir.$destName, 75) && imagejpeg($thumb, $uploaddir.$thumbName, 75)) {
		$files[] = $uploaddir.$thumbName;
	} else {
		$error = true;
	}
	$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
	echo json_encode($data);
?>
