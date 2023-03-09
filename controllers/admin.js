var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');


// login get request
exports.getLogin = (req, res, next) => {
    if (req.session.admin == undefined) {
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        var connectDB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "hotel"
        });
        data1 = "SELECT * " +
            "FROM  bookingstatus ";
        connectDB.query(data1, (err1, result1) => {
            if (err1) throw err1;
            else {
                for (i in result1) {
                    var a = result1[i].date;
                    result1[i].date = a.toString().slice(0, 15);

                    var b = result1[i].checkout;
                    result1[i].checkout = b.toString().slice(0, 15);
                }
                return res.render('admin/index', { msg: "", err: "", data: result1 });
            }
        })
    }

}

//login post request
exports.postLogin = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM admin " +
        "WHERE name = " + mysql.escape(req.body.name) +
        "AND pass = " + mysql.escape(req.body.pass);

    data1 = "SELECT * " +
        "FROM  bookingstatus ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {
                req.session.admin = result[0].name;
                connectDB.query(data1, (err1, result1) => {
                    if (err1) throw err1;
                    else {
                        for (i in result1) {
                            var a = result1[i].date;
                            var b = result1[i].checkout;
                            result1[i].date = a.toString().slice(0, 15);
                            result1[i].checkout = b.toString().slice(0, 15);

                        }
                        return res.render('admin/index', { msg: "", err: "", data: result1 });
                    }
                })

            }
            else {
                return res.render('admin/login', { msg: "", err: "Please Check Your Information Again" });
            }
        }
    })
}

//change booking status
exports.postChnageStatus = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    var value = 0;
    // console.log(req.body.click)

    if (req.body.click == "Setuju") {
        value = 1;
        data = "UPDATE bookingstatus " +
        " SET  status = " + mysql.escape(value) +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND roomWant = " + mysql.escape(req.body.want) 

    } else if (req.body.click == "Edit") {
        let data = req.body
        // console.log(data)
        return res.render(`admin/edit`, {data});
    }
    
    else {
        data = "DELETE FROM bookingstatus " +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND roomWant = " + mysql.escape(req.body.want)
    }
    
    data1 = "SELECT * " +
        "FROM  bookingstatus " ;

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(data1, (err1, result1) => {
                if (err1) throw err1;
                else {
                    for (i in result1) {
                        var a = result1[i].date; 
                        result1[i].date = a.toString().slice(0, 15);

                        var b = result1[i].checkout; 
                        result1[i].checkout = b.toString().slice(0, 15);
                    }
                    return res.render('admin/index', { msg: "", err: "", data: result1 });
                }
            })
        }
    })

}


//Get Edit Page
exports.getEditPage = (req, res, next) => {
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });
    const {id} = req.params;

    console.log(id)

    data1 = "SELECT * " +
    "FROM  bookingstatus " +
    `WHERE id = ${id} `;

    connectDB.query(data1, (err1, result1) => {
        if (err1) throw err1;
        else {
            for (i in result1) {
                var a = result1[i].date;
                result1[i].date = a.toString().slice(0, 15);
            }
            console.log(result1)
            return res.render('admin/edit', { msg: "", err: "", data: result1 });
        }
    })
}


//Post Edit Page
exports.postEditPage = (req, res) => {
    console.log(req.params.id)
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });


    let formData = {
        category: req.body.category,
        type: req.body.type,
        roomWant: req.body.roomWant,
        date: req.body.date,
        checkout: req.body.checkout,
        nama: req.body.nama,
        nik: req.body.nik,
        nomor_kamar: req.body.nomor_kamar

    }



    connectDB.query('UPDATE bookingstatus SET ? WHERE id = ' + req.params.id, formData, function(err, result) {
        if(err) throw err;
        else {
            connectDB.query(data1, (err1, result1) => {
                if (err1) throw err1;
                else {
                    for (i in result1) {
                        var a = result1[i].date;
                        result1[i].date = a.toString().slice(0, 15);
        
                        var b = result1[i].checkout;
                        result1[i].checkout = b.toString().slice(0, 15);

            return res.redirect('/admin');

                    }
                }})

        }
    })
}

//get add hotel page

exports.getAddHotel = (req, res, next) => {
    res.render('admin/addhotel', { msg: "", err: "" });
}

//add new hotel info
exports.postAddHotel = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    //var
    var cat = "", type = "", cost = 0, avlvl = 0, des = ""
   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "cat") {
                cat = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "cost") {
                cost = field;
            }
            else if (name === "avlvl") {
                avlvl = parseInt(field);
            }
            else if (name === "des") {
                des = field
            }

        })
        .on('file', (name, file) => {
            // console.log('Uploaded file', name)
            //   fs.rename(file.path,__dirname+"a")
        })
        .on('fileBegin', function (name, file) {
            //console.log(mail);

            var fileType = file.type.split('/').pop();
            if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'avif') {

                a = path.join(__dirname, '../')
                ///  console.log(__dirname)
                //  console.log(a)
                if (name === "img") {
                    imgPath = (cat + type + cost + "." + fileType);
                }
                imgPath ='/assets/img/rooms/' + (cat + type + cost + "." + fileType)
                file.path = a + '/public/assets/img/rooms/' + (cat + type + cost + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addhotel', { msg: "", err: "Wrong File type" });
            }
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {

            if (wrong == 1) {
                console.log("Error")
            }
            else {

                //saveDir = __dirname + '/uploads/';
                
                data = "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) "+
                         "VALUES('" +cat + "','" + type + "', '" + cost + "','" +avlvl + "' ,'" + imgPath + "' ,'" + des + "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addhotel', { msg: "Data Insert Successfuly", err: "" });
                    }
                });
            }
        })
}

//get update page
exports.getSearch = (req, res, next) => {
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            console.log(result)
            return res.render('admin/search', { msg: "", err: "", data: result });
        }
    })
    // res.render('admin/search', { msg: "", err: "" })
}

//post request
exports.postSearch = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/update', { msg: "", err: "", data: result });
        }
    })

}

//get update page 

exports.getUpdate = (req, res, next) => {
    // console.log(req.body);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND cost = " + mysql.escape(req.body.cost);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            req.session.info = result[0];
            // console.log(result)
            res.render('admin/updatePage', { data: result[0] });
        }
    })
}

//update previous data

exports.updatePrevData = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });

    data = "UPDATE category " +
        "SET type = " + mysql.escape(req.body.type) +
        ", cost = " + mysql.escape(req.body.cost) +
        ", available = " + mysql.escape(parseInt(req.body.avlvl)) +
        ", `dec` = " + mysql.escape(req.body.des) +
        " WHERE name = " + mysql.escape(req.session.info.name) +
        " AND type = " + mysql.escape(req.session.info.type) +
        " AND cost = " + mysql.escape(req.session.info.cost)

    data2 = "SELECT * " +
        "FROM category ";

    //  console.log(req.session.info);    
    //  console.log(req.body); 
    //  console.log(data);        

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(data2, (err, result) => {
                if (err) throw err;
                else {
                    console.log(result)
                    return res.render('admin/search', { msg: "Data Berhasil Diubah", err: "", data: result });
                }
            })
            // console.log(result)
            // res.render('admin/search', { msg: "Data Berhasil Diubah", err: "" })
        }
    })

}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('admin/login', { msg: "", err: "" });
}

