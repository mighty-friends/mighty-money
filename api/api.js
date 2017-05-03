var express = require('express')
var api = express()

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('db.sqlite3')

db.run(`CREATE TABLE IF NOT EXISTS liablity \
  (id INTEGER PRIMARY KEY AUTOINCREMENT, \
    creditor TEXT NOT NULL, \
    debtor TEXT NOT NULL, \
    amount INTEGER NOT NULL, \
    description TEXT, \
    time INT, \
    valid INT)`)

api.route('/api/admin')
  .get(function (req, res) {
    db.all(
      `SELECT * FROM liablity \
      ORDER BY time, id`,
      function (err, rows) {
        if (err) {
          console.log(err)
          res.status(500)
          res.end()
        }
        res.send(rows)
      }
    )
  })
  .post(function (req, res) {
    try{
      JSON.parse(req.query.data)
        .forEach( function (t) {
          db.run(`INSERT INTO liablity \
            (creditor, debtor, amount, description, time, valid) \
              VALUES (?, ?, ?, ?, ?, ?)`,
            t.creditor, t.debtor, t.amount, t.description, t.time, t.valid)
        }
      )
    } catch(err) {
      console.log(err)
      res.status(500)
      res.end()
      return 
    } finally {
      res.status(202)
      res.end()
    }
  })

api.route('/api/trans')
  .get(function (req, res) {
    db.all(
      `SELECT * FROM liablity \
      ORDER BY time DESC, id DESC`,
      function (err, rows) {
        if (err) {
          console.log(err)
          res.status(500)
          res.end()
        }
        res.send(rows)
      }
    )
  })
  .post(function (req, res) {
    db.run(
      `INSERT INTO liablity \
      (creditor, debtor, amount, description, time, valid) \
      VALUES (?, ?, ?, ?, date('now'), 1)`,
      req.query.creditor,
      req.query.debtor,
      req.query.amount,
      req.query.description,
      function (err, row) {
        if (err) {
          console.log(err)
          res.status(500)
          res.end()
        } else {
          res.status(202)
          res.end()
        }
      }
    )
  })
  .put(function (req, res) {
    db.run(
      `UPDATE liablity \
      SET valid = ? \
      WHERE id = ?`,
      req.query.valid, req.query.id,
      function (err, row) {
        if (err) {
          console.log(err)
          res.status(500)
          res.end()
        } else {
          res.status(202)
          res.end()
        }
      }
    )
  })

api.route('/api/credit')
  .get(function(req, res){
    db.all(
		`SELECT creditor, debtor, sum(amount) as amount \
    FROM \
      (SELECT creditor, debtor, amount \
      FROM liablity \
      WHERE valid <> 0 \
      UNION ALL \
      SELECT debtor as creditor, creditor as debtor, -amount \
      FROM liablity \
      WHERE valid <> 0) \
    GROUP BY creditor, debtor \
    HAVING sum(amount) <> 0 \
    ORDER BY sum(amount) DESC`,
		function(err, rows){
			if (err){
				console.log(err);
				res.status(500);
				res.end();
			}else{
				res.send(rows)
			}
		}
	)
})

api.use(express.static('public'))
api.use(/\/(list|won|mine)/, express.static('public'))
api.listen(80)
console.log('Submit GET or POST to http://localhost:80')
