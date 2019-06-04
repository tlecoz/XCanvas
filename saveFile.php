<?php

$data = $_POST["data"];
$fileName = $_POST["fileName"];

$file = fopen($fileName,"w+");
fwrite($file,$data);
fclose($file);

echo "ok";

?>
