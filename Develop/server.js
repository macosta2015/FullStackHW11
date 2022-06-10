//The required libraries. 
const express = require("express");
const path = require("path");
const fs = require("fs"); 

const app = express();


//we are defining a variable objectArray and giving it the value of the content within our json file, we then parse it so that it returns a javascript object. 
let objectArray = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf-8", (err)=> {
  if(err) throw err;
}));

const port = process.env.PORT || 3001; // Setting a port variable and running it in port 3001


app.use(express.json());// makes it so that incoming data can be recognized as a JSON object
app.use(express.urlencoded({ extended: true }));//method that allows express to recognize the incoming data as arrays or strings
app.use(express.static("Develop/public"));//Lets me use the static css file within public folder. This way the user can visualize the notes.html file with stylings



//APP .GET REQUESTS START HERE__________________________________________________________________
//Gets the main index.html file and returns it to the user when they open the page/app.
app.get("/", (req, res) => {
    console.log("here")
    res.sendFile(path.join(__dirname + "/Develop/public/index.html"))
})

//Gets the notes.html file and returns it to the user when the url contains mainpage/notes 
app.get("/notes", (req, res)  => {
    res.sendFile(path.join(__dirname + "/Develop/public/notes.html" ))
});

//Returns the notes within the json file
app.get("/api/notes", (req, res) => {
  return res.json(objectArray);
});

//APP.GET REQUESTS ENDS HERE_____________________________________________________________________


//APP.POST REQUESTS STARTS HERE__________________________________________________________________
//adds notes into the json file within the server
app.post("/api/notes", (req, res) => {
  let newNote = {title: req.body.title, text: req.body.text} //our newNote will contain an array with 2 parameters
  newNote.id = objectArray.length.toString(); //converts it to a string

  objectArray.push(newNote); //pushes the newNote into the objectArray 

  fs.writeFile("./Develop/db/db.json", JSON.stringify(objectArray), //writes in the file objectArray as a string within said array
  (err)=>{
    if(err) throw err;
  });
   res.json(objectArray)
});

//APP.POST REQUESTS END HERE (ONLY 1)___________________________________________________________


//APP.DELETE REQUEST STARTS HERE________________________________________________________________
app.delete("/api/notes/:id",  (req, res) => {
  let idSelected = JSON.parse(req.params.id);//the selected id will depend on the note that the user clicked on

  objectArray = objectArray.filter((e) => { //filters out the objectArray and returns it without the id that was selected 
    return e.id != idSelected;
  });

  objectArray.forEach((val, index) => { //assigns each string within the array a new id
    val.id = index.toString();
  });

  //writes on the json file serverside the new values without the selected id that is deleted. and then turns the objectArray into a string so that it displays as one. and we can get the new values without the deleted ones.
  fs.writeFile("./Develop/db/db.json", JSON.stringify(objectArray), (err) => {
    if(err) 
    throw err;
  });
  res.end();
})

//APP.DELETE REQUEST ENDS HERE________________________________________________________________


//allows us to see the server with all our individual requests get, post, del.
app.listen(port, () =>
console.log(`App listening at http://localhost:${port} 🚀`)
);