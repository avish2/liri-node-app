
    var keys = require("./keys.js");
    var fs = require("fs"); 
	var request = require("request");
	var twitter = require("twitter");
    var Spotify = require ("node-spotify-api");
    var liriArgument = process.argv[2];
    nodeApp();
    // Start the app
function nodeApp () {  
    console.log(liriArgument);
    //if liriArg !=""
    //then  liriarg = processargv
    //else continue
    //command options
	switch(liriArgument) {
		case "my-tweets": readTweets(); break;
		case "spotify-this-song": spotifyThis(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
	// Instructions displayed in terminal if no command typed
		default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name'"+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says"+"\r\n"+
			"**Be sure to put the movie or song in quotes if it's more than one word.\r\n");
    };

function readTweets() {
		var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret, 
		});
		var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "acodingcamper";
		}
		params = {screen_name: twitterUsername};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
                console.log('------------ THE LATEST TWEETS FROM "' + twitterUsername + '" ------------\r\n')
				for(var i = 0; i < data.length; i++) {
                    var num = i+1;
					//console.log(response); // Show the full response in the terminal
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + num + " ------------------------------" + "\r\n";
                    console.log(twitterResults);
                    log(twitterResults); //appends data to log.txt
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
    }
function spotifyThis(songName) {
    var spotify = new Spotify ({
        id: "523068b5bd864f3b96bef646ecdbcede",
        secret: "e8508674cf81428aa945fc5bbe3c32f5",
    });
    var songName = process.argv[3];
    // var Artist = process.argv[4];
    if(!songName){
        // songName = "The Sign";
        var spotifyResults = 
        "Artist: Ace of Base\r\n" +
        "Song Title: The Sign\r\n" +
        "Preview Url: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=523068b5bd864f3b96bef646ecdbcede\r\n" +
        "Album: The Sign (US Album) [Remastered]\r\n";
        console.log(spotifyResults);
        log(spotifyResults);
        return;
    }
    params = songName;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            console.log('------------ THE TOP 10 RESULTS FOR "' + params + '" ------------\r\n')
            for (var i = 0; i < 10; i++) {
                if (songInfo[i] != undefined) {
                    var num = i+1;
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song Title: " + songInfo[i].name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "Album: " + songInfo[i].album.name + "\r\n" +
                    "------------------------------ " + num + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults);
                }
            }
        }	else {
            console.log("Error occurred: "+ err);
            return;
        }
    });
};
function movieThis(){
    var movie = process.argv[3];
    if(!movie){
        movie = "mr nobody";
    }
    params = movie;
    request("http://www.omdbapi.com/?t="+ params + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body); 
            var movieResults =
            "Title: " + movieObject.Title+"\r\n"+
            "Year Released: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value+"\r\n"+
            "Countries Produced: " + movieObject.Country+"\r\n"+
            "Languages Available: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n";
            console.log(movieResults);
            log(movieResults);
        } else {
            console.log("Error: "+ error);
            return;
        }
    });
};
};
function doWhatItSays() {
    console.log("What are you doing?");
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            doWhatItSaysResults = data.split(",");
//doWhatItSaysResults[0] = liriArgument;
  //          doWhatItSaysResults[1] = process.argv[3];
  //liriArgument=doWhatItSays
            nodeApp();
            // spotifyThis(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred: " + error);
        }
    });
};
function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
    if(error) {
        throw error;
    }
    });
};