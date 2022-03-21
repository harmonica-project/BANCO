var Mustache = require('mustache');
var fs = require('fs');

// Template config (will be from config file later)
var view = {
  groups: false,
  roles: false
};

// Read template
var template = fs.readFileSync('./templates/Participants.sol.mustache').toString();
//console.log(template)

// Render template
var output = Mustache.render(template, view);
console.log(output);