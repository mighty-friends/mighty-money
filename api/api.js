var express = require('express')
var api = express()

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

db.serialize(function () {
  db.run(`CREATE TABLE IF NOT EXISTS liablity \
    (id INTEGER PRIMARY KEY AUTOINCREMENT, \
      creditor TEXT NOT NULL, \
      debtor TEXT NOT NULL, \
      amount INTEGER NOT NULL, \
      description TEXT, \
      time INT, \
      valid INT)`)

  const createTrans = (c, d, a, desc = '') =>
    db.run(`INSERT INTO liablity \
      (creditor, debtor, amount, description, time, valid) \
      VALUES (?, ?, ?, ?, date('now'), 1)`,
      c, d, a, desc)

  createTrans('위재원', '김유진', 1000, '데리야끼 호텔')
  createTrans('강명진', '김유진', -2000, '성실관 콜라')
  createTrans('강명진', '위재원', 8500, '마쯔미')
  createTrans('강명진', '이정재', 4500, '싸이')
})

api.route('/api/trans')
  .get(function (req, res) {
    db.all(
      `SELECT * FROM liablity \
      ORDER BY id DESC`,
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

/*
api.put('/api/trans', function (req, res) {
  db.run(
    `UPDATE liablity SET valid = ? WHERE id = ?`,
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
*/

api.get('/api/credit', function(req, res){
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
    ORDER BY sum(amount)`,
		function(err, rows){
			if (err){
				console.log(err);
				res.status(500);
				res.end();
			}else{
				res.send(rows)
			}
		}
	);
});

api.use(express.static('public'))
api.listen(80)
console.log('Submit GET or POST to http://localhost:80')
