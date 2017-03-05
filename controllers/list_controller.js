var pg = require('pg');

module.exports.controller = function (app) {
  app.get('/:ver/list', function (req, res) {
    var skill_table_name;
    var version_name;

    switch (req.params.ver) {
      case "tb":
        skill_table_name = "skill_tb";
        version_name = "GITADORA Tri-Boost";
        break;
      case "tbre":
        skill_table_name = "skill_tbre";
        version_name = "GITADORA Tri-Boost Re:EVOLVE";
        break;
      default:
        res.send("Unexpected version name");
    }

    //pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
      var sql = 'select * from ' + skill_table_name + ' order by id asc;';
      client.query(sql, function (err, result) {
        done();

        if (err) {
          console.error(sql);
          console.error(err);
          res.send(sql + "<br>" + err);
        } else {
          var data = [];
          for (var i in result.rows) {
            var guitar_skill = JSON.parse(result.rows[i].guitar_skill);
            var drum_skill = JSON.parse(result.rows[i].drum_skill);
            data.push({
              id : result.rows[i].id,
              player_name : result.rows[i].player_name,
              guitar_skill: (parseFloat(guitar_skill.hot.point) + parseFloat(guitar_skill.other.point)).toFixed(2),
              drum_skill: (parseFloat(drum_skill.hot.point) + parseFloat(drum_skill.other.point)).toFixed(2),
              update_date: result.rows[i].update_date
            });
          }
          res.render("list" , { 
            data : data,
            version: req.params.ver,
            version_full: version_name
          });
        }
      });
    });
  });
}