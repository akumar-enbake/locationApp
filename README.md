# locationApp

* This app is a location saving App to save user location each time he/she chech in to a location.
* The app also return the users and location records while search by user name or location.

## How to run the app
	Note: Before run the app make sure you have node , npm and mongo db install locally
	To run the app you must need to install dependencies using the folloing command
		* sudo npm install
	To run the app locally just run by npm
		* npm start

## Functionality of the App
 * The app have two apis to save and get data from server
 	* saveLocation
 	* getLocations

* Params
	*username: User id or name
	*location: any location name or Latitude, Longtitude value.

### /saveLocation
	This Api url is called when user check in to a location. The Api receive 'username' and 'location' from url send by get method. If any param is missing then it return error message with status 403 in json format.
		Example:
		1. To check in to a location then call
			http://0.0.0.0:8000/saveLocation?username=value1&location=value2
		2. To save user location as lat,long like location='123.12,23.12' it will see in url as:
			http://0.0.0.0:8000/saveLocation?username=value1&location=123.12%23.12

		Response: If both are available then
			{"status":200,"message":"User Location data Saved"}
		If any or both missing then
			{"status":403,"message":"No username or location"}

### /getLocations
	This Api is called we want to retrive the user locations or users by locations. The Api receive 'username' or 'location' from url send by get method. If both params missing then it return error message with status 403 in json format.
		Example:
		1. To get locations by username then call
			http://0.0.0.0:8000/getLocations?username=value1
		2. To get users by location call
			http://0.0.0.0:8000/getLocations?location=value2

		Response:
		1. if usename receive then
			{"status":200,
			 "data":[
				{"location":"value2","date":"2015/07/31 11:24:00"},
				{"location":"value2","date":"2015/07/31 11:04:16"}
				]
			}
		2. if location receive then
			{"status":200,
			 "data":[
			 	{"username":"value1","date":"2015/07/31 11:24:00"},
			 	{"username":"value1","date":"2015/07/31 11:04:16"}
			 ]
			}

* response status
	*200: for success,	*403: for error
