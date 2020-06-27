const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/mail', (req, res) => res.render('pages/mail'))
  .get('/receipt', (req, res) => {
    const weight = req.query.iWeight;
    const mailType = req.query.mail;
    const shipCost = req.query.shipCost;

    const cost = calcRate(mailType, weight);

    param = { weight: weight, mailType: mailType, cost: cost}
    res.render('pages/receipt', param)
  })
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


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
