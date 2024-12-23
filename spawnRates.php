<?php


$total_chances_pool = 100; //100% total

$variants = array(); //an array of all posible item variants

$variants[0] = [
    "value" => 3,
    "chance" => 40,
    "class" => "small",
    "speed" => 7,
];

$variants[1] = [
    "value" => 5,
    "chance" => 20,
    "class" => "medium",
    "speed" => 12,
];

$variants[2] = [
    "value" => 10,
    "chance" => 15,
    "class" => "big",
    "speed" => 15,
];
$variants[3] = [
    "value" => -10,
    "chance" => 15,
    "class" => "coal",
    "speed" => 12,
];
$variants[4] = [
    "value" => 0,
    "chance" => 50,
    "class" => "bomb",
    "speed" => 7,
];





function randomSpawnWithChances($variants, $total_chances_pool) {
        
    $cumulative = [];
    $sum = 0;
    
    // create a cumulative array depending on the chance to spawn 
    foreach ($variants as $variant) {
        $sum += $variant["chance"];
        $cumulative[] = $sum;
    }
    
    // generate random value between 1 and 100 and if the value of the chance is less than generated, this object gets spawned 
    $rand = mt_rand(1, $total_chances_pool);
    foreach ($cumulative as $index => $value) {
        if ($rand <= $value) {
            return json_encode($variants[$index]);
        }
    }
}



echo (randomSpawnWithChances($variants, $total_chances_pool)); 