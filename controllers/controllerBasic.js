const sqlite = require('sqlite3').verbose()

exports.renderIndex = (req, res) =>{
    let db = new sqlite.Database('./RPi_Remotes.db')
    db.serialize(() => {
        let sql = 'SELECT * FROM Added_remotes'
        db.all(sql, (err, rows) => {
            if (err) {
                res.render('error', { error: err })
            } else {
                res.render('home', { array: rows })
            }
        })
    })
    db.close();
} 

exports.crudIndex = (req, res) =>{

    let db = new sqlite.Database('./RPi_Remotes.db')
    
    let name = req.body.name
    if(''.localeCompare(name) == 0){
        name = req.body.prec_name
    }
    let icon = req.body.icon
    if (req.body.hasOwnProperty('icon') == false) {
        icon = req.body.prec_icon
    }
    let color = req.body.color
    if (''.localeCompare(color) == 0) {
        color = req.body.prec_color
    }
    let icon_color = req.body.icon_color
    if (''.localeCompare(icon_color) == 0) {
        icon_color = req.body.prec_icon_color
    }

    let id = req.body.id

    switch (req.body.action) {
        case 'create':
            db.serialize(() => {
                let sql = 'INSERT INTO Added_remotes VALUES ("' + name + '", "'+ icon + '", "' + color + '", "' + icon_color + '", "' + id + '");'
                db.run(sql, (err) => {
                    if (err) {
                        res.render('error', { error: err })
                    }
                })
            })
            break;

        case 'update':
            db.serialize(() => {
                let sql = 'UPDATE Added_remotes SET name = "' + name + '", icon = "' + icon + '", color = "' + color + '", icon_color = "' + icon_color + '" WHERE name = "' + req.body.prec_name + '"'
                db.run(sql, (err) => {
                    if (err) {
                        res.render('error', { error: err })
                    }
                })
            })
            break;

        case 'delete':
            db.serialize(() => {
                let sql = 'DELETE FROM Added_remotes ' + 'WHERE name = "' + req.body.prec_name + '"'
                db.run(sql, (err) => {
                    if (err) {
                        res.render('error', { error: err })
                    }
                })
            })
            break;

        default:
            res.render('error', { error: 'Html code improperly modified' })
            break;
    }

    db.serialize(() => {
        let sql = 'SELECT * FROM Added_remotes'
        db.all(sql, (err, rows) => {
            if (err) {
                res.render('error', { error: err })
            } else {
                res.render('home', { array: rows })
            }
        })
    })
    db.close();
}

exports.getRemotes = (req, res) =>{
    let db = new sqlite.Database('./RPi_Remotes.db')
    db.serialize(() => {
        let sql = 'SELECT * FROM Remotes'
        db.all(sql, (err, rows) => {
            if (err) {
                res.render('error', { error: err })
            } else {
                res.render('remotes', { array: rows })
            }
        })
    })
    db.close();
}

