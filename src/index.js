import Hapi from 'hapi';
import nunjucks from 'nunjucks';

// configure nujucks to read from the dist directory
nunjucks.configure('./dist');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

function getName(request) {
  //default values
  let name = {
    fname: 'Rick',
    lname: 'Sanchez'
  };
  // split path params
  let nameParts = request.params.name ? request.params.name.split('/') : [];

  // order of precedence
  // 1. path param
  // 2. query param
  //3 3. default value
  name.fname = (nameParts[0] || request.query.fname) || name.fname;
  name.lname = (nameParts[1] || request.query.lname) || name.lname;
  return name;
}

// Add the route
server.route({
    method: 'GET',
    path: '/hello/{name*}',
    handler: function (request, reply) {
      // read template and compile using context object
      nunjucks.render('index.html', getName(request), function (err, html) {
          // replay with HTML response
        reply(html);
      });
    }
});

// Start the server
server.start();
