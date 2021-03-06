const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/income', require('./routes/income'));
app.use('/api/savings', require('./routes/savings'));
app.use('/api/expense', require('./routes/expense'));

if (process.env.NODE_ENV === 'production') {
	// Enforce HTTPS
	app.use((req, res, next) => {
		if (req.header('x-forwarded-proto') !== 'https')
			res.redirect(`https://${req.header('host')}${req.url}`);
		else next();
	});

	// Set static folder
	app.use(express.static('client/build'));

	//index.html for all page routes
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server Running at ${port}`);
});
