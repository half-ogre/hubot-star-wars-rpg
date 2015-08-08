var fs = require('fs');
var path = require('path');

module.exports = function(robot) {
  var scriptsPath = path.resolve(__dirname, 'scripts');
  fs.readdir(scriptsPath, function(err, files) {
    if (err) {
      throw err;
    }

    files
      .sort()
      .foreach(function(file) {
        robot.loadFile(scriptsPath, file);
      });
  });
};
