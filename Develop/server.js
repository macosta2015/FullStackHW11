//The required libraries. 
const express = require("express");
const path = require("path");
const fs = require("fs"); 

const router = express.Router(); //We are not using the library to the left. It is used when we have several calls. 
//"Nos crea una cápzula en donde vamos a registrar todas nuestras rutas"

//Port # that we are going to be using
const port = process.env.PORT || 9090; 

//Initialize express 
const app = express();

// CLIENTE ----------------------------------------------------------------
// 
// 
//
// CLIENT


//we are defining a variable databaseObject and giving it the value of the content within our json file, we then parse it so that it returns a javascript object. 
let databaseObject = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf-8", (err)=> {
  if(err) cosnole.log('Error');
}));


//Middleware for parsing JSON. 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//This allow us to use the assets folder that contains all the HTML/CSS/JS
app.use(express.static(path.join(__dirname, 'Develop/public')));




//APP .GET REQUESTS START 
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
  return res.json(databaseObject);
});

//APP.GET REQUESTS ENDS 


//APP.POST REQUESTS STARTS 
//adds notes into the json file within the server
app.post("/api/notes", (req, res) => {
  let newNote = {title: req.body.title, text: req.body.text} //our newNote will contain an array with 2 parameters
  newNote.id = databaseObject.length.toString(); //converts it to a string

  databaseObject.push(newNote); //pushes the newNote into the databaseObject 

  fs.writeFile("./Develop/db/db.json", JSON.stringify(databaseObject), //writes in the file databaseObject as a string within said array
  (err)=>{
    if(err) throw err;
  });
   res.json(databaseObject)
});

//APP.POST REQUESTS END HERE (ONLY 1)


//APP.DELETE REQUEST STARTS 
app.delete("/api/notes/:id",  (req, res) => {
  let idSelected = JSON.parse(req.params.id);//the selected id will depend on the note that the user clicked on

  databaseObject = databaseObject.filter((e) => { //filters out the databaseObject and returns it without the id that was selected 
    return e.id != idSelected;
  });

  databaseObject.forEach((val, index) => { //assigns each string within the array a new id
    val.id = index.toString();
  });

  //writes on the json file serverside the new values without the selected id that is deleted. and then turns the databaseObject into a string so that it displays as one. and we can get the new values without the deleted ones.
  fs.writeFile("./Develop/db/db.json", JSON.stringify(databaseObject), (err) => {
    if(err) 
    throw err;
  });
  res.end();
})

//APP.DELETE REQUEST ENDS 


//allows us to see the server with all our individual requests get, post, del.
app.listen(port, () =>
console.log(`Listening at http://localhost:${port} `)
);


// Using nodemon with NodeJS Servers              -It is used to save the package.json and then keep running it
// https://www.youtube.com/watch?v=kV6MJ9W4whM