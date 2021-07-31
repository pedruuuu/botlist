module.exports = (routes, {
  static, sendFile
}) => {
  routes.set('/', async(req, res) => {
    await sendFile('index.html');
  });
};