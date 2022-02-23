<?php

require __DIR__ . '/amocrm/amocrm.phar';

// account settings
$domain = 'temursales';
$login = 'temur.sales@gmail.com';
$key = '404fbe8d2bc557390a4e2c1c2eb32d96dde5af16';
$status = '33672454';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	try {
		$amo = new \AmoCRM\Client($domain, $login, $key);
		
		// create contact
		$contact = $amo->contact;
		$contact['name'] = trim($_POST['full_name']);
		$contact['company_name'] = trim($_POST['company_name']);
		$contact['tags'] = trim($_POST['company_name']);
		$contact->addCustomField('326809', trim($_POST['phone']), 'WORK');
		$contact->addCustomField('326811', trim($_POST['email']), 'WORK');
		$contact_id = $contact->apiAdd();
		
		// create lead
		$lead = $amo->lead;
		$lead['name'] = 'New lead';
		$lead['pipeline_id'] = $pipeline;
		$lead['tags'] = trim($_POST['company_name']);
		$lead['price'] = 0;
		$lead->addCustomField('996581', trim($_POST['utm_source']));
		$lead->addCustomField('996583', trim($_POST['utm_medium']));
		$lead->addCustomField('996585', trim($_POST['utm_campaign']));
		$lead->addCustomField('996589', trim($_POST['utm_term']));
		$lead->addCustomField('996587', trim($_POST['utm_content']));
		$lead_id = $lead->apiAdd();
		
		// linked model
		$link = $amo->links;
		$link['from'] = 'leads';
		$link['from_id'] = $lead_id;
		$link['to'] = 'contacts';
		$link['to_id'] = $contact_id;
		$link->apiLink();
		
		// create note
		$note = $amo->note;
		$note['element_id'] = $lead_id;
		$note['element_type'] = 2;
		$note['text'] = trim($_POST['comment']);
		$note->apiAdd();

	}
	catch (\AmoCRM\Exception $e) {
		file_put_contents('log.txt', sprintf('Error (%d): %s' . PHP_EOL, $e->getCode(), $e->getMessage()), FILE_APPEND);
	}
}