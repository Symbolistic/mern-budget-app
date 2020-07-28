const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

mongoose.connect(config.mongoURI,
                 { useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log("Connected to Database"))
                                                                    .catch(err => console.log(err));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use('/api/users', require('./routes/users'));
//app.use('/api/budget', require('./routes/budget'));
app.use('/api/income', require('./routes/income'));
app.use('/api/savings', require('./routes/savings'));
app.use('/api/expense', require('./routes/expense'));



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Running at ${port}`);
});