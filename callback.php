<?php
// these headers may not be needed on same domain
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
// set content type to return json that can be consumed
// header('Content-Type: application/json');

// load sql builder and google client
require_once __DIR__.'/vendor/autoload.php';

// load mysql PDO
require_once __DIR__.'/db.php';
use MathCart\Database;

$debug = true; // writes last request, response, body and mysql result to file


class SiteAccess{

  private $client; //
  private $db;
  private $sqlBuilder;
  private $service; //  Google_Service_Sheets
  private $sheetProperties; // Google_Service_Sheets_SpreadsheetProperties
  private $newPermission; // Google_Service_Drive_Permission
  private $drive; // Google_Service_Drive
  private $sheetService; // Google_Service_Sheets_Spreadsheet

  public function __construct(){
    $this->client();
    $this->db();
    $this->service($this->client);
    $this->sheetProperties($this->client);
    $this->drive($this->client);
    $this->newPermission();
    $this->sheetService();
  }

  private function sheetService(){
    $this->sheetService = new Google_Service_Sheets_Spreadsheet();
  }
  private function drive($client){
    $this->drive = new Google_Service_Drive($client);
  }
  private function newPermission(){
    $this->newPermission = new Google_Service_Drive_Permission();
  }

  private function sheetProperties()
  {
    $this->sheetProperties = new Google_Service_Sheets_SpreadsheetProperties();
  }
  private function service($client){
    $this->service = new Google_Service_Sheets($client);
  }

  public function getSheetService(){
    return $this->sheetService ;
  }

  public function getDrive(){
    return $this->drive;
  }
  public function getSheetProperties(){
    return $this->sheetProperties;
  }
  public function getService(){
    return $this->service;
  }

  public function getNewPermission(){
    return $this->newPermission;
  }

  private function client(){
    try {
      $client = new Google_Client();
      $client->setAuthConfigFile('client_secrets.json');
      $client->setRedirectUri('http://localhost:8080/callback');
      $this->client = $client;
    } catch (Exception $e) {
      echo 'Caught google client exception: '.  $e->getMessage(). "\n";
    }
  }

  private function db(){
    try{
      $db =  new Database();
      $sqlBuilder = $db->getBuilder();
    } catch (Exception $e) {
      echo 'Caught db exception: '.  $e->getMessage(). "\n";
    }
    $this->db =  $db;
    $this->sqlBuilder = $sqlBuilder;
  }

  public function getDb(){
    return $this->db;
  }

  public function getClient(){
    return $this->client;
  }

  public function getSqlBuilder(){
    return $this->sqlBuilder;
  }

  private function oauth2($client){
    return new Google_Service_Oauth2($client);
  }

  public function userInfo($client){
    try {
      $oauth2 = $this->oauth2($client);
      $userInfo = $oauth2->userinfo->get();
      return $userInfo;
    } catch (Exception $e) {
      echo 'Caught userInfo($cleint) : '.  $e->getMessage(). "\n";
    }
  }

  public function addTab($service, $id, $title) {
    try {
      $body = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest(array(
        'requests' => array(
          'addSheet' => array(
            'properties' => array(
              'title' => $title
            )
          )
        )
      ));
      $result1 = $service->spreadsheets->batchUpdate($id,$body);
      return $result1;
    } catch (Exception $e) {
      echo 'Caught addTab($id) : '.  $e->getMessage(). "\n";
    }
  }

}

$access = new SiteAccess;
// start a new client
$client = $access->getClient();
// initialize database connection
$db = $access->getDb();
// get the body content of the request
function bodyContent(){
  $string = file_get_contents('php://input');
  return $string;
}
$string = bodyContent();

// file where debug response is stored
$file = 'header_check.txt';

// start to get data from request, $data to build string from array
// string is used in both logic and debug file
$data = 'body' . "\n";

// $body holds the request body sent from consumer
$body = json_decode($string);
// next block gets body
if (($body)) foreach ($body as $name => $value) {
	$data .= $name . ': ' . $value . "\n";
}
// now get headers sent by consumer
$string .= "\n"."\n".$data."\n". 'Request'."\n";
foreach (getallheaders() as $name => $value) {
    $string .=  "$name: $value\n";
}
//now record response sent back by api
$string .= "\n"."\n";
$string .= "\n".'Response';
foreach (apache_response_headers() as $name => $value) {
    $string .=  "$name: $value\n";
}

// if the api got a code from the consumer, authenticate to google using google client and api
if (isset($body->code)) {
  /*
   * google client part needed to authenticate for all users
   */
  $clientObj = $client->authenticate($body->code);
  // get the google token
  $token = $clientObj['access_token'];
  // seconds until token expires
  $expires = $clientObj['expires_in'];
  // authenticate and get user information
  $userInfo = $access->userInfo($client);

  /*
   * google client part needed to make a new sheet, for new users only
   */
  function makeSheet($access, $userInfo)
  {
    $string = '';
    try {
      //  create all the google services
      $service = $access->getService(); /// needed for sheet
      $driveService = $access->getDrive(); /// need for setting sheet permissions
      $sheetProperties = $access->getSheetProperties(); // needed to name sheet
      $newPermission = $access->getNewPermission();
      $requestBody = $access->getSheetService();

      if ($service) $string .= "\n" . 'Google service: ' . "\n";
      else $string .= "\n" . 'NO  Google service: ' . "\n";
      // start to build sheet
      try {
        // name the sheet
        $sheetProperties->setTitle('mathCart: ' . $userInfo->givenName . ' ' . $userInfo->familyName);
        try {
          $requestBody->setProperties($sheetProperties);
        }
        catch (Exception $e) {
            $string .= "\n" . 'cannot set properties: ' . 'Caught exception: ' . $e->getMessage() . "\n";
        }
        // create the sheet
        $response = $service->spreadsheets->create($requestBody);
        if ($response) $string .= "\n" . 'Google sheet response: ' . serialize($response) . "\n";
        $string .= "\n" . 'response ' . $response['spreadsheetId'] . "\n";
        $spreadSheetId = $response['spreadsheetId'];

        // add new tab to sheet
        try {
          $access->addTab($service, $spreadSheetId, 'docs');
        } catch (Exception $e) {
          $string .= "\n" . 'cannot set docs tab: ' . 'Caught exception: ' . $e->getMessage() . "\n";
        }

        try {
          $access->addTab($service, $spreadSheetId, 'examples');
        } catch (Exception $e) {
          $string .= "\n" . 'cannot set examples tab: ' . 'Caught exception: ' . $e->getMessage() . "\n";
        }
        // set permissions
        $newPermission->setType('user');
        $newPermission->setRole('reader');
        $newPermission->setEmailAddress('peter.emanuele@gmail.com'); //thats email to share
        $driveResponse = $driveService->permissions->create($response['spreadsheetId'], $newPermission);
        if ($driveResponse) $string .= "\n" . 'Google sheet repsonse: ' . serialize($driveResponse) . "\n";

      } catch (Exception $e) {
        $string .= "\n" . 'NO  Google sheet: ' . 'Caught exception: ' . $e->getMessage() . "\n";
      }
    } catch (Exception $e) {
      $string .= "\n" . 'NO  Google service: ' . 'Caught exception: ' . $e->getMessage() . "\n";
    }
      if ($spreadSheetId){
      $sheetArray = array(
        'id' => '',
        'user_id' => $userInfo->id,
        'sheet_id' => $spreadSheetId,
        'sheet_type' => 'video_tracker'
        );
      }

    return array('string' => $string, 'sheetId' =>$spreadSheetId);
  }


  // add google to debug to file
  $string .= "\n" . 'Google client: ' . serialize($clientObj) . "\n" .
    "user obj: " . serialize($userInfo) . "\n" .
    'access_token: ' . $clientObj['access_token'] . "\n" .
    'expires_in: ' . $clientObj['expires_in']
    . "\n";
  // array to return as json response\
  if ($userInfo) {
    $returnArray = [
      'id' => '',
      'email' => $userInfo->email,
      'givenName' => $userInfo->givenName,
      'familyName' => $userInfo->familyName,
      'token' => $token,
      'role' => 'user',
      'token_expires' => $expires
    ];
    // db logic
    $userArray = array('email' => $userInfo->email);
    $result = $db->returnUser($userArray);

    $string .= "\n" . 'fetch user from mysql: ' . serialize($result);
    if ($result) // update the user's login, get their id
    {
      $array = ['email' => $userInfo->email];
      $update = $db->updateLastLogin($array);
      $string .= "\n" . 'update user from mysql: ' . serialize($update);
      $returnArray['id'] = $result['id'];
      $videos = $db->returnVideoSheet($result['id']);
      $string .= "\n" . 'videos: ' . serialize($videos);
      $returnArray['sheetId'] = $videos['sheet_id'];
    } else {  // insert the user and return new id
      $array = makeSheet($access, $userInfo);
      $string .= $array['string'];
      $sheetId = $array['sheetId'];
      $values = null;
      $array = $returnArray;
      $result = $db->insertUser($array);
      $string .= "\n" . 'insert user from mysql: ' . serialize($result);
      $returnArray['id'] = $result;
      $returnArray['sheetId'] = $sheetId;
      $array = array(
        'id' => '',
        'user_id' => $returnArray['id'],
        'sheet_id' => $sheetId,
        'sheet_type' => 'video_tracker'
      );
      $result = $db->insertSheet($array);
      //$sheetId = $this->db->lastInsertId();
      $string .= "\n" . 'insert sheet : ' . serialize($result);
    }
  }
}

// put in file
if ($debug) file_put_contents(
  $file,
  $string . "\n"
);

// create page response
if (isset($returnArray)) echo json_encode($returnArray);
else echo "{'response' , 'none'}";

?>