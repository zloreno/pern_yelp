import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import RestaurantFinder from '../api/RestaurantFinder';
import { RestaurantsContext } from '../context/ContextRestaurant';

const howExpensive = [
	{
		value: '0',
		label: 'Not Defined',
	},
	{
		value: '1',
		label: 'Cheap',
	},
	{
		value: '2',
		label: 'Economic',
	},
	{
		value: '3',
		label: 'Medium',
	},
	{
		value: '4',
		label: 'Someplace nice',
	},
	{
		value: '5',
		label: 'Expensive AF',
	},
];

export default function AddRestaurant() {
	const { addRestaurant } = useContext(RestaurantsContext);
	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [priceRange, setPriceRange] = useState('0');

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await RestaurantFinder.post('/restaurants', {
				restaurant_name: name,
				location,
				price_range: priceRange,
			});
			addRestaurant(response.data.data[0]);
			console.log(response);
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleChangeName = (event) => {
		setName(event.target.value);
	};

	const handleChangeLocation = (event) => {
		setLocation(event.target.value);
	};

	const handleChangePrice = (event) => {
		setPriceRange(event.target.value);
	};

	return (
		<Container>
			<Grid
				container
				direction="column"
				alignItems="center"
				marginTop={'20px'}
				marginBottom={'20px'}
			>
				<Grid item xs={3}>
					<Box
						component="form"
						sx={{
							'& > :not(style)': { m: 1, width: '25ch' },
						}}
						noValidate
						autoComplete="off"
					>
						<TextField
							id="outlined-basic"
							label="Restaurant Name"
							variant="outlined"
							value={name}
							onChange={handleChangeName}
						/>
						<TextField
							id="outlined-basic"
							label="Restaurant Location"
							variant="outlined"
							value={location}
							onChange={handleChangeLocation}
						/>
						<TextField
							id="outlined-select-currency"
							select
							label="Price range"
							value={priceRange}
							onChange={handleChangePrice}
						>
							{howExpensive.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						<Button variant="contained" onClick={handleSubmit}>
							Add
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
