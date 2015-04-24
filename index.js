'use strict';

var pg = require('pg');
var express = require('express');

var app = express();

var PG_DSN = "postgres://username:password@host:5439/db";
var TABLE_NAME = 'twitter_users';

app.set('view engine', 'jade');
app.use(express.static('public'));

// routing
app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/update', function(req, res) {
    fetch(function(err, rows) {
        if (err) {
            res.send({ error: err });
        } else {
            res.send({ content: parseContent(rows) });
        }
    });
});

var fetch = function(callback) {
    pg.connect(PG_DSN, function(err, client, done) {
        if (err) {
            callback(err);
            return;
        }
        client.query('select * from ' + TABLE_NAME, function(err, result) {
            if (err) {
                callback('err');
                return;
            }
            callback(null, result.rows);
        });
    });
};

var parseContent = function(rows) {
    var content = {};
    for (var idx in rows) {
        var row = rows[idx];
        if (content[row.name] == undefined) {
            content[row.name] = {
                name: row.name,
                profile: row.profile_image,
                count: 1
            };
        } else {
            content[row.name].count = content[row.name].count + 1;
        }
    }
    return content;
};

var server = app.listen(3000);
