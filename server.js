/*
Поднять MySql бд в любой облачном сервисе. Талицы - производитель, категория, товар
Написать API для CRUD архитектуры под таблицу "Товар" с использованием NodeJs + Express
*/

const express = require('express');
const mysql = require("mysql2");
const bodyParser = require('body-parser')
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const connection = mysql.createConnection({
    /*host: "104.155.137.236",*/
    host: "localhost",
    user: "root",
    database: "bd",
    password: ""
});
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

app.get('/', function (req, res) {
    res.send('Hello API');
})

app.get('/products', function (req, res) {
    const sql = "SELECT * FROM product;";
    connection.query(sql,
        function(error, results, fields){
        if (error == null){
            res.send(results);
        } else {
            res.send(error);
        }
        });
})

app.get('/products/:id', function (req, res) {
    const sql = `SELECT * FROM product WHERE id = ${req.params.id};`;
    connection.query(sql,
        function(error, results, fields){
            if (error == null){
                res.send(results);
            } else {
                res.send(error);
            }
        });
})

app.post('/products', function (req, res) {
    var product = {
        id: null,
        name: req.body.name,
        id_manufacturer: req.body.id_manufacturer,
        id_category: req.body.id_category
    }

    const sql = "INSERT INTO product VALUES(?, ?, ?, ?)";
    connection.query(sql, Object.values(product),
        function(error, results, fields){
            if (error){
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
})

app.put('/products/:id', function (req, res) {
    const product = {
        name: req.body.name,
        id_manufacturer: req.body.id_manufacturer,
        id_category: req.body.id_category
    }

    const sql = `SELECT * FROM product WHERE id = ${req.params.id}`;
    connection.execute(sql,
        function(error, results, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                const sql = `UPDATE product SET name = ?, id_manufacturer = ?, id_category = ? WHERE id = ${req.params.id}`;
                connection.execute(sql, Object.values(product),
                    function(error, results, fields){
                        if (error){
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(200);
                        }
                    });
            }
        });
})

app.delete('/products/:id', function (req, res) {
    const sql = `DELETE FROM product WHERE id = ${req.params.id}`;
    connection.execute(sql,
        function(error, results, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/*connection.end(function(err) {
    if (err) {
        return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
});*/
