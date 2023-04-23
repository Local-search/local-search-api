const app = require("./src/config/express");
const connectTomongodb = require("./src/config/mongodb");
const { PORT } = require("./src/config/secrets");
const Port = PORT || 8080;

app.listen(Port, () => {
  console.log(`Server Started
    
    Host: http://localhost:${Port}`);
  connectTomongodb();
});
