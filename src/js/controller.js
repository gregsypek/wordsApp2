console.log('hellosd');
var Owlbot = require('owlbot-js');

var client = Owlbot(YOUR_TOKEN);

client.define('owl').then(function (result) {
  console.log(result);
});
