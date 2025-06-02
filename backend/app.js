var express = require("express");
var app = express();

app.use("/api/inventory", require("./app/route/inventory.route.js"));
app.use("/api/journal", require("./app/route/journalEntry.route.js"));
app.use("/api/locations", require("./app/route/location.route.js"));
app.use("/api/notes", require("./app/route/note.route.js"));
app.use("/api/saves", require("./app/route/save.route.js"));
app.use("/api/save-locations", require("./app/route/saveLocations.route.js"));
app.use("/api/settings", require("./app/route/settings.route.js"));
app.use("/api/users", require("./app/route/user.route.js"));

var auth = require("./app/route/auth.route.js");
auth(app);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var db = require("./app/config/db.config.js"); // подключение настроек базы данных

db.sequelize.sync({ force: false });

app.listen(3000, () => {
  // Ищите этот код
  console.log("Server running on port 3000");
});
