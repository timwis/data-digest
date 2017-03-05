var lodash = require('lodash');
var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: '../dev.sqlite3'
    }
});

var tick = function() {
    // query database to get queries
    knex.from('queries').innerJoin('subscribers', 'queries.query_id', 'subscribers.query_id').then(function(rows) {
        var queries = lodash.groupBy(rows, function(q) {
            return q.query;
        });
        console.log(queries);

    });
    // for each row:
    //     make request
    //     render template using request's data
    //     send emails to one or more users
};

tick(); 
