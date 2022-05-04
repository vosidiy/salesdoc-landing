<?php

require_once 'access.php';

$required_fields = ['name', 'phone'];

foreach($required_fields as $field) {
	if (!isset($_POST[$field])) {
		echo "$field field is required";
		http_response_code(400);
		die();
	}
}


$name = trim($_POST['name']);
$phone = trim($_POST['phone']);
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$target = isset($_POST['target']) ? trim($_POST['target']) : 'Форма на главной странице';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$comment = isset($_POST['comment']) ? $_POST['comment'] : '';

$ip = $_SERVER["REMOTE_ADDR"];
$domain = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'salesdoc.io';
$pipeline_id = 3334015;		//	Воронка
$user_amo = 6095647;		//	Temur

$utm_source   = isset($_POST['utm_source']) ? trim($_POST['utm_source']) : '';
$utm_content  = isset($_POST['utm_content']) ? trim($_POST['utm_content']) : '';
$utm_medium   = isset($_POST['utm_medium']) ? trim($_POST['utm_medium']) : '';
$utm_campaign = isset($_POST['utm_campaign']) ? trim($_POST['utm_campaign']) : '';
$utm_term     = isset($_POST['utm_term']) ? trim($_POST['utm_term']) : '';

// For more info see: https://www.amocrm.ru/developers/content/crm_platform/leads-api#leads-add
$lead_data = [
    [
        "name" => $phone,
        "responsible_user_id" => (int) $user_amo,
        "pipeline_id" => (int) $pipeline_id,
        "_embedded" => [
            "metadata" => [
                "category" => "forms",
                "form_id" => 1,
                "form_name" => "Форма на сайте",
                "form_page" => $target,
                "form_sent_at" => strtotime(date("Y-m-d H:i:s")),
                "ip" => $ip,
                "referer" => $domain
            ],
            "contacts" => [
                [
                    "name" => $name,
                    "custom_fields_values" => [
                        [
                            "field_code" => "EMAIL",
                            "values" => [
                                [
                                    "enum_code" => "WORK",
                                    "value" => $email
                                ]
                            ]
                        ],
                        [
                            "field_code" => "PHONE",
                            "values" => [
                                [
                                    "enum_code" => "WORK",
                                    "value" => $phone
                                ]
                            ]
                        ]
                        // [
                        //     "field_id" => 326809,
                        //     "values" => [
                        //         [
                        //             "value" => $custom_field_value
                        //         ]
                        //     ]
                        // ]
                    ]
                ]
            ],
            "companies" => [
                [
                    "name" => $company
                ]
            ]
        ],
        "custom_fields_values" => [
            [
                "field_id" => 996581,
                "values" => [
                    [
                        "value" => $utm_source
                    ]
                ]
            ],
            [
                "field_id" => 996587,
                "values" => [
                    [
                        "value" => $utm_content
                    ]
                ]
            ],
            [
                "field_id" => 996583,
                "values" => [
                    [
                        "value" => $utm_medium
                    ]
                ]
            ],
            [
                "field_id" => 996585,
                "values" => [
                    [
                        "value" => $utm_campaign
                    ]
                ]
            ],
            [
                "field_id" => 996589,
                "values" => [
                    [
                        "value" => $utm_term
                    ]
                ]
            ]
        ],
    ]
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $access_token,
];

$response = post("/api/v4/leads/complex", $lead_data, $headers);
if (count($response) && !empty($comment)) {
    // https://www.amocrm.ru/developers/content/crm_platform/events-and-notes#notes-add
    $lead_id = $response[0]->id;
    $note_data = [
        [
            'entity_id' => $lead_id,
            'note_type' => 'common',
            'params' => [
                'text' => $comment
            ]
        ]
    ];
    $response2 = post("/api/v4/leads/notes", $note_data, $headers);
    $response = [
        'lead' => $response,
        'note' => $response2
    ];
}


header('Content-Type: application/json');
echo json_encode($response);


function post($method, $data, $headers)  {
    global $subdomain;

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
    curl_setopt($curl, CURLOPT_URL, "https://$subdomain.amocrm.ru".$method);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_COOKIEFILE, 'amo/cookie.txt');
    curl_setopt($curl, CURLOPT_COOKIEJAR, 'amo/cookie.txt');
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    $out = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $code = (int) $code;
    $errors = [
        301 => 'Moved permanently.',
        400 => 'Wrong structure of the array of transmitted data, or invalid identifiers of custom fields.',
        401 => 'Not Authorized. There is no account information on the server. You need to make a request to another server on the transmitted IP.',
        403 => 'The account is blocked, for repeatedly exceeding the number of requests per second.',
        404 => 'Not found.',
        500 => 'Internal server error.',
        502 => 'Bad gateway.',
        503 => 'Service unavailable.'
    ];

    if ($code < 200 || $code > 204) die( "Error $code. " . (isset($errors[$code]) ? $errors[$code] : 'Undefined error') );
    return json_decode($out);
}

?>