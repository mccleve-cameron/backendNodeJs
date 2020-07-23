const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const {Pool} = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://wbtddyzaexpzji:bf215b7cf93c10de830248ac2dc6144b2c04c46a2e5ca9505528fd50968a2b95@ec2-34-192-173-173.compute-1.amazonaws.com:5432/d38eid749osp5t?ssl=true';

const pool = new Pool({connectionString: connectionString});

let muscle = 'chest';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({extended:true}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  // .get('/mail', (req, res) => res.render('pages/mail'))
  // .get('/receipt', (req, res) => {
  //   const weight = req.query.iWeight;
  //   const mailType = req.query.mail;
  //   const shipCost = req.query.shipCost;
  //   //req.body

  //   const cost = calcRate(mailType, weight);

  //   param = { weight: weight, mailType: mailType, cost: cost}
  //   res.render('pages/receipt', param)
  // })
  .get('/users', (req, res) => res.render('pages/users'))
  .post('/getUsers', getUsers)

  .get('/bodyMap', (req, res) => res.render('pages/bodyMap'))
  
  .get('/displayExerciseList', (req, res) => res.render('pages/displayExerciseList'))
  .post('/getExerciseList', getExerciseList)
  
  .get('/displayExerciseDetails', (req, res) => res.render('pages/displayExerciseDetails'))
  .post('/getExerciseDetails', getExerciseDetails)

  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function getExerciseDetails(request, response) {
    
    const name = request.body.workout;
    console.log(name);
    console.log(muscle);
    queryExerciseDetails(name, function(error, result) {

      if (error || result == null || result.length == 0) {
        response.status(500).json({success: false, data: error});
      } else {
        const workout = result;
        response.status(200).json(workout);
      }
    });
  }

  function queryExerciseDetails(name, callback) {
    console.log(name);

    const sql = "SELECT * FROM "+muscle+" WHERE id=" + name;
    console.log(sql);
  

    pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
  
      // Log this to the console for debugging purposes.
      console.log("Found result: " + JSON.stringify(result.rows));

      callback(null, result.rows);
    });
  
  }


  function getExerciseList(request, response) {
 
    muscle = request.body.muscle;
    console.log(muscle);
    queryWorkouts(muscle, function(error, result) {

      if (error || result == null || result.length == 0) {
        response.status(500).json({success: false, data: error});
      } else {
        const workout = result;
        response.status(200).json(workout);
      }
    });
  }

  function queryWorkouts(muscle, callback) {
    console.log(muscle);

    const sql = "SELECT * FROM " +muscle;
   // param = [muscle];
    console.log(sql);

    pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
  
      // Log this to the console for debugging purposes.
      console.log("Found result: " + JSON.stringify(result.rows));

      callback(null, result.rows);
    });
  
  }

  function getUsers(request, response) {
    queryData(function(error, result) {
      if (error || result == null || result.length == 0) {
        response.status(500).json({success: false, data: error});
      } else {
        const person = result;
        response.status(200).json(person);
      }
    });
  }

  function queryData(callback) {
    console.log("Getting person from DB with id: ");
    const sql = "SELECT * FROM users";

    pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
      console.log("Found result: " + JSON.stringify(result.rows));

      callback(null, result.rows);
    });
  
  }




 