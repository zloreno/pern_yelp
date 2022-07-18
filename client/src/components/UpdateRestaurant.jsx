import React, { Fragment, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import RestaurantFinder from '../api/RestaurantFinder';
import Button from '@mui/material/Button';

function EditRestaurant({ restaurant }) {
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

	const [restaurantName, setRestaurantName] = useState(
		restaurant.restaurant_name
	);
	const [location, setLocation] = useState(restaurant.location);
	const [priceRange, setPriceRange] = useState(restaurant.price_range);

	const deleteUnsavedChanges = (restaurant) => {
		setRestaurantName(restaurant.restaurant_name);
		setLocation(restaurant.location);
		setPriceRange(restaurant.price_range);
	};

	const handleSubmit = async (event, id) => {
		event.preventDefault();
		try {
			const response = await RestaurantFinder.put(`/restaurants/${id}`, {
				restaurant_name: restaurantName,
				location,
				price_range: priceRange,
			});
			window.location = '/';
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Fragment>
			<Button
				// type="button"
				// className="btn btn-primary"
				data-bs-toggle="modal"
				data-bs-target={`#id${restaurant.restaurant_id}`}
			>
				Edit
			</Button>

			<div
				className="modal fade"
				id={`id${restaurant.restaurant_id}`}
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
				onClick={() => deleteUnsavedChanges(restaurant)}
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Edit Restaurant
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => deleteUnsavedChanges(restaurant)}
							></button>
						</div>
						<div className="modal-body">
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
									value={restaurantName}
									onChange={(e) => setRestaurantName(e.target.value)}
								/>
								<TextField
									id="outlined-basic"
									label="Location"
									variant="outlined"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
								/>
								<TextField
									id="outlined-select-currency"
									select
									label="Price range"
									value={priceRange}
									onChange={(e) => setPriceRange(e.target.value)}
								>
									{howExpensive.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</TextField>
							</Box>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
								onClick={() => deleteUnsavedChanges(restaurant)}
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={(e) => handleSubmit(e, restaurant.restaurant_id)}
							>
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default EditRestaurant;
