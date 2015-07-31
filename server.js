var app = require('http').createServer(handler);
var url = require('url');     //used to parse the url elements
var UserLocations = require('./Model').UserLocations; //export the Userlocation model
var utilApi = require('./utilities.js');

//Create a server with default port 8000
var server = app.listen(process.env.PORT || 8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://'+host+':'+port);
});

// http function to get client requests and respond to client
function handler (req, res) {
  //switch the urls paths
  switch(url.parse(req.url, true).pathname){
    case '/saveLocation':{        //this url api used to get location with username and save it to db
      if(req.method == 'GET'){    //Check wether tha called method is get or not
        var username = url.parse(req.url,true).query.username;    //parse the userneme and location sent in upl
        var location = url.parse(req.url,true).query.location;
        var date = utilApi.getDateTime(new Date());

        if(username && location){   //check both the params are exists and not blank
          var userLocations = new UserLocations({     //create an initilize object of UserLocations Model
            'username': username,
            'location': location,
            'date': date
          });
          userLocations.save(function(err, userLocations) {   //save data to db
            if (err){               //Mongo Error
              console.log(err);
              res.writeHead(403, {"Content-Type": "application/json"}); // initilize response type to json
              json = JSON.stringify({status: 403, message: 'Error: '+err}); //initilize json data
            }
            else{
              res.writeHead(200, {"Content-Type": "application/json"}); //success response 200
              json = JSON.stringify({status:200, message: 'User Location data Saved'});
            }
              res.write(json);
              res.end();
          });
        }
        else {
          res.writeHead(403, {"Content-Type": "application/json"}); //error response 403
          json = JSON.stringify({status: 403, message: 'No username or location'});
          res.write(json);
          res.end();
        }
      }
      break;
    }
    case '/getLocations':{            //This api url return users or locations by username and location
      if(req.method == 'GET'){
        var username = url.parse(req.url,true).query.username;  //parse the userneme and location sent in upl
        var location = url.parse(req.url,true).query.location;
        var searchData = {};                //what need to search
        var projectData = {_id:0, __v:0};   //what not to retrive from db
        var json = {};

        if(!username && !location){          // Sent Error Message of nothing is available
          res.writeHead(403, {"Content-Type": "application/json"});
          json = JSON.stringify({status: 403, message: 'No username and location'});
          res.write(json);
          res.end();
        }
        else{
          if(username){
            searchData = {username: username};
            projectData.username = 0;
          }
          else if(location){
            searchData = { location:location };
            projectData.location = 0;
          }
          //seach data sort by time
          UserLocations.find(searchData, projectData, {sort: {date: -1}}, function(err, docs) {
            if (err){               //Mongo error
              console.log(err);
              res.writeHead(403, {"Content-Type": "application/json"});
              json = JSON.stringify({status: 403, message: 'Error: '+err});
            }else{
              res.writeHead(200, {"Content-Type": "application/json"});
              json = JSON.stringify({status:200, data: docs});
            }
            res.write(json);
            res.end();
          });
        }
      }
      break;
    }
    default:{
      res.writeHead(403, {"Content-Type": "application/json"});
      json = JSON.stringify({status:403, message: "no valid end point provided"});
      res.write(json);
      res.end();
    }
  }
}