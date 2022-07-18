require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db');
const app = express();

const port = process.env.PORT || 3001;

function updateProductByID(tableName, id, cols) {
	// Setup static beginning of query
	var query = [`UPDATE ${tableName}`];
	query.push('SET');

	// Create another array storing each set command
	// and assigning a number value for parameterized query
	var set = [];
	Object.keys(cols).forEach(function (key, i) {
		set.push(key + ' = ($' + (i + 1) + ')');
	});
	query.push(set.join(', '));

	// Add the WHERE statement to look up by id
	query.push(`WHERE restaurant_id = '${id}' RETURNING *`);

	// Return a complete query string
	return query.join(' ');
}

//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// listen
app.listen(port, () => {
	console.log(`Server is up and lisening on port ${port}`);
});

// routes
app.get('/restaurants', async (req, res) => {
	try {
		console.log('testing');
		const { rows } = await db.query(
			'SELECT * FROM restaurants ORDER BY created_time'
		);

		const result = {
			status: 'success',
			results: rows.length,
			data: rows,
		};

		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
	}
});

app.get('/restaurants/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await db.query(
			'SELECT * FROM restaurants WHERE restaurant_id = $1',
			[id]
		);

		const result = {
			status: 'success',
			results: rows.length,
			data: rows,
		};

		res.status(200).send(result);
	} catch (err) {
		console.log(err.message);
	}
});

app.post('/restaurants', async (req, res) => {
	try {
		const restaurant_body = req.body;
		console.log(restaurant_body);
		const { rows } = await db.query(
			'INSERT INTO restaurants(restaurant_name, location, price_range) VALUES ($1, $2, $3) RETURNING *',
			[
				restaurant_body.restaurant_name,
				restaurant_body.location,
				restaurant_body.price_range,
			]
		);

		const result = {
			status: 'success',
			results: rows.length,
			data: rows,
		};

		res.status(200).send(result);
	} catch (err) {
		console.log(err.message);
	}
});

// update a restaurant
app.put('/restaurants/:id', async (req, res) => {
	try {
		const restaurant_body = req.body;
		const { id } = req.params;

		// Setup the query
		var updateQuery = updateProductByID('restaurants', id, restaurant_body);

		console.log(updateQuery);

		// Turn req.body into an array of values
		var colValues = Object.keys(req.body).map(function (key) {
			return req.body[key];
		});

		console.log(colValues);

		const { rows } = await db.query(updateQuery, colValues);

		const result = {
			status: 'success',
			results: rows.length,
			data: rows,
		};

		res.status(200).send(result);
	} catch (err) {
		console.log(err.message);
	}
});

app.delete('/restaurants/:id', async (req, res) => {
	try {
		const { rows } = await db.query(
			'DELETE FROM restaurants WHERE restaurant_id = $1 RETURNING *',
			[req.params.id]
		);

		const result = {
			status: 'success',
			results: rows.length,
			data: rows,
		};

		res.status(204).send(result);
	} catch (error) {
		res.status(500).send(error);
	}
});
