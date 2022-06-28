<?php

require_once 'config.php';

$link = "https://$subdomain.amocrm.ru/oauth2/access_token";

$data = [
  'client_id'     => $client_id,
  'client_secret' => $client_secret,
  'grant_type'    => 'authorization_code',
  'code'          => $code,
  'redirect_uri'  => $redirect_uri,
];

$curl = curl_init();
curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
curl_setopt($curl,CURLOPT_URL, $link);
curl_setopt($curl,CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
curl_setopt($curl,CURLOPT_HEADER, false);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl,CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
$out = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
$code = (int)$code;

header('Content-Type: application/json');
if ($code < 200 || $code > 204)  die($out);

$response = json_decode($out, true);

$arrParamsAmo = [
	"access_token"  => $response['access_token'],
	"refresh_token" => $response['refresh_token'],
	"token_type"    => $response['token_type'],
	"expires_in"    => $response['expires_in'],
	"endTokenTime"  => $response['expires_in'] + time(),
];

$f = fopen($token_file, 'w');
fwrite($f, json_encode($arrParamsAmo));
fclose($f);

echo json_encode($out);

?>