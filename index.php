<?php


$html = trim(file_get_contents("index.html"));

$head = explode("</head>",explode("<head>",$html)[1])[0];
$lines = explode("\r\n",$head);
//echo implode(",",$lines);
$len = count($lines);
$urls = [];

$k = 0;

$allFiles = "";

for($i=0;$i<$len;$i++){

  $line = trim($lines[$i]);

  //echo "".$line."<br>";

  //echo $line."<br>";
  if(strlen($line)>0){
    if(substr($line,0,7) == "<script"){
        $line = trim(explode('"',explode('="',$line)[1])[0]);
        //echo $line."<br>";
        //echo $k." ".$line."<br>";
        $js = trim(file_get_contents("".$line))."\n";

        $t = explode("/*",$js);
        $n = count($t);
        if($n > 1){
          for($j=1;$j<$n;$j++){
            $tt = explode("*/",$t[$j]);
            if(count($tt) == 1) echo "ERROR : ".$t[$j]."<br>";
            if(count($tt) > 1){

               $t[$j] = $tt[1];
            }
          }

          $js = implode("",$t)."\n";
        }

        $allFiles .= $js;

        $urls[$k++] = $line;
    }else{
      //echo "false<br>";
    }
  }
}

$fp = fopen('XCanvas.min.js', 'w+');
fwrite($fp, $allFiles);
fclose($fp);

echo $html;


//echo file_get_contents("build/geom/Pt2D.js");











//echo $html;




?>
