const sqlite = require('sqlite3').verbose()
const lirc = require('lirc_node')

exports.getRemote = (req, res) =>{
    let db = new sqlite.Database('./RPi_Remotes.db')
    db.serialize(() => {
        let sql = 'SELECT * FROM ' + req.params.remote
        db.all(sql, (err, rows) => {
            if (err) {
                res.render('error', { error: err })
            } else {
                res.render('remote', { remote: req.params.remote, array: rows })
            }
        })
    })
    db.close();
}

exports.postRemote = (req, res) =>{
    console.log(req.params, req.body)
    lirc.irsend.send_once(req.params.remote, req.body.command)
    let db = new sqlite.Database('./RPi_Remotes.db')
    db.serialize(() => {
        let sql = 'SELECT * FROM ' + req.params.remote
        db.all(sql, (err, rows) => {
            if (err) {
                res.render('error')
            } else {
                res.render('remote', { remote: req.params.remote, array: rows })
            }
        })
    })
    db.close();
}