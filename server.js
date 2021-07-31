const {
  createServer
} = require('http');

const {
  promises: {
    readFile,
    readdir,
    stat
  }
} = require('fs');

const server = createServer(async (req, res) => {
  let extensions = {
    'html': 'text/html',
    'json': 'text/json',
    'css': 'text/css',
    'js': 'text/javascript'
  };

  let url = require('url').parse(req.url);

  let routes = new Map();

  async function static(directory = './public') {
    let files = await readdir(directory);

    for (const file of files) {
      let stats = await stat(directory + '/' + file);

      if (stats.isDirectory()) {
        await static(directory + '/' + file);
      } else if (stats.isFile()) {
        routes.set(directory.slice(1)+'/' + file, async(req, res) => {
          await sendFile(file, {
            directory: './public'
          });
        });
      }
    }
  }

  async function sendFile(file, {
    status = 200, directory = './pages'
  }) {
    let content = await readFile(directory + '/' + file);

    res.writeHead(status, {
      'Content-type': extensions[file.split('.').pop()]
    });

    res.write(content.toString());
  }

  await static();

  await (require('./routes')(routes, {
    static, sendFile
  }));

  let route = routes.get(url.pathname);

  if (route) await route(req, res);

  console.log(routes)


  res.end();
});

server.listen(process.argv[2] || 8000, () => {
  console.log('Server is running.');
});