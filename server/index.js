// server/index.js
const config = require("./config/config.js");
const mongooseService = require("./config/mongoose.js");
const expressConfig = require("./config/express.js");
const chalk = require("chalk");

async function init() {
  let db = await mongooseService.connect();
  await mongooseService.loadModels();
  var app = expressConfig.init(db);
  try {
    app.listen(config.port, config.host, function () {
      const server = (process.env.NODE_ENV === "secure" ? "https://" : "http://") + config.host + ":" + config.port;
      console.log("----------------------------");
      console.log(chalk.green(`Server:          '${server}`));
      console.log("----------------------------");
    });
  } catch (err) {
    console.log("Server error", err);
  }
}
init();
