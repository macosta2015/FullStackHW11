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

//Middleware for parsing JSON. 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// CLIENTE ----------------------------------------------------------------
// 
// 
//
// 


//we are defining a variable databaseObject and giving it the value of the content within our json file, we then parse it so that it returns a javascript object. 
let databaseObject = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf-8", (err)=> {
  if(err){
    cosnole.log('Error');
  }
}));



//This allow us to use the assets folder that contains all the HTML/CSS/JS
app.use(express.static(path.join(__dirname, 'Develop/public')));


//Gets the notes.html file and returns it to the user when the url contains mainpage/notes 
app.get("/notes", (req, res)  => {
  console.info(`${req.method} request received `);
  console.info(`We are in the main HTML, http://localhost:9090/`);
  res.sendFile(path.join(__dirname + "/Develop/public/notes.html" ))
});


//NOTE that "/api/notes" is coming from index.js
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received `);
  return res.json(databaseObject);
});

app.post("/api/notes", (req, res) => {
  console.info(`${res.method} request received `);
  let noteInformation = {
    title:req.body.title, text: req.body.text
  } 

  noteInformation.id = databaseObject.length.toString(); 
  databaseObject.push(noteInformation); 

  fs.writeFile("./Develop/db/db.json", JSON.stringify(databaseObject),
  (err)=>{
    console.log('SAVING')
  });
  //We are sending the user's input 
  res.json(databaseObject)
});

//IF we only do http://localhost:9090/ we are going to get at the main page, which is index.html
app.get("/", (req, res) => {
  console.info(`${res.method} request received `);
  res.sendFile(path.join("/Develop/public/index.html"))
})

//THIS ALWAYS NEEDS TO GO AT LAST
app.listen(port, () =>
console.log(`Port http://localhost:${port} is listening`)
);


// Using nodemon with NodeJS Servers             
//  -It is used to save the package.json and then keep running it
// https://www.youtube.com/watch?v=kV6MJ9W4whM

//The parse method is the following
// const json = '{"result":true, "count":42}';
// const obj = JSON.parse(json);
// console.log(obj.count);
// // expected output: 42
// console.log(obj.result);
// expected output: true
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

// The difference between 
// .JSON.stringify "[1,2,3]" 
// When obj, it would be 
// "1,2,3"
// https://stackoverflow.com/questions/15834172/whats-the-difference-in-using-tostring-compared-to-json-stringify