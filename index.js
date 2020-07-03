const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const {Pool} = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://wbtddyzaexpzji:bf215b7cf93c10de830248ac2dc6144b2c04c46a2e5ca9505528fd50968a2b95@ec2-34-192-173-173.compute-1.amazonaws.com:5432/d38eid749osp5t?ssl=true';

const pool = new Pool({connectionString: connectionString});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({extended:true}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/mail', (req, res) => res.render('pages/mail'))
  .get('/receipt', (req, res) => {
    const weight = req.query.iWeight;
    const mailType = req.query.mail;
    const shipCost = req.query.shipCost;
    //req.body

    const cost = calcRate(mailType, weight);

    param = { weight: weight, mailType: mailType, cost: cost}
    res.render('pages/receipt', param)
  })
  .get('/users', (req, res) => res.render('pages/users'))
  .post('/getUsers', getUsers)

  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function getUsers(request, response) {
    // First get the person's id
    //const id = request.query.id;
  
    // TODO: We should really check here for a valid id before continuing on...
  
    // use a helper function to query the DB, and provide a callback for when it's done
    queryData(function(error, result) {
      // This is the callback function that will be called when the DB is done.
      // The job here is just to send it back.
  
      // Make sure we got a row with the person, then prepare JSON to send back
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
  
    // Set up the SQL that we will use for our query. Note that we can make
    // use of parameter placeholders just like with PHP's PDO.
    const sql = "SELECT * FROM users";
  
    // We now set up an array of all the parameters we will pass to fill the
    // placeholder spots we left in the query.
    //const params = [id];
  
    // This runs the query, and then calls the provided anonymous callback function
    // with the results.
    pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
  
      // Log this to the console for debugging purposes.
      console.log("Found result: " + JSON.stringify(result.rows));
  
  
      // When someone else called this function, they supplied the function
      // they wanted called when we were all done. Call that function now
      // and pass it the results.
  
      // (The first parameter is the error variable, so we will pass null.)
      callback(null, result.rows);
    });
  
  } // end of getPersonFromDb




  function calcRate(mailType, weight) {
    switch (mailType) {
      case "Stamped Letter":
        return stamped(weight);
      case "Metered Letter":
        return metered(weight);
      case "Envelope":
        return envelope(weight);
      case "Package":
        return package(weight);
      default:
        return -1;
    }
  }

  function stamped(weight) {
		console.log("stamped called");

		if (weight > 0 && weight < 1) {
			shipCost = .55;
			console.log(shipCost);
		}
		if (weight >= 1 && weight < 2) {
			console.log('.70');
			shipCost = .70;
		}
		if (weight >= 2 && weight < 3) {
			shipCost = .85;
			console.log('.85');
		}
		if (weight >= 3 && weight < 3.5) {
			shipCost = 1.00;
			console.log('1.00');
    }
    return shipCost;
  }
  
  function metered(weight) {
		console.log("metered called");
		
		if (weight > 0 && weight < 1) {
			shipCost = .50;
		}
		if (weight >= 1 && weight < 2) {
			shipCost = .65;
		}
		if (weight >= 2 && weight < 3) {
			shipCost = .80;
		}
		if (weight >= 3 && weight < 3.5) {
			shipCost = .95;
    }
    return shipCost;
  }
  
  function envelope(weight) {
    console.log("envelope called");
    let tmp = weight - 1;

    shipCost = tmp * .2 + 1;
	
    return shipCost;
  }
  
  function package(weight) {
		console.log("package called");
		
		if (weight > 0 && weight <= 4) {
			shipCost = 3.8;
		}
		if (weight > 4 && weight <= 8) {
			shipCost = 4.6;
		}
		if (weight > 8 && weight <= 12) {
			shipCost = 5.3;
		}
		if (weight > 12) {
			shipCost = 5.9;
    }
    return shipCost;
  }
