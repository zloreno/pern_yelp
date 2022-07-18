import React, { useState, useEffect, useContext, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RestaurantFinder from '../api/RestaurantFinder';
import { RestaurantsContext } from '../context/ContextRestaurant';
import EditRestaurant from './UpdateRestaurant';
import { useNavigate } from 'react-router-dom';

const SortedTable = (props) => {
	const { restaurants, setRestaurants } = useContext(RestaurantsContext);
	let navigate = useNavigate();

	const fetchData = useCallback(async () => {
		try {
			const response = await RestaurantFinder.get('/restaurants');
			setRestaurants(response.data.data);
		} catch (err) {
			console.log(err.message);
		}
	}, [restaurants, setRestaurants]);

	useEffect(() => {
		fetchData();
	}, []);

	const [orderDirection, setOrderDirection] = useState('asc');

	const sortArray = (arr, orderBy) => {
		switch (orderBy) {
			case 'asc':
			default:
				return arr.sort((a, b) =>
					a.restaurant_name > b.restaurant_name
						? 1
						: b.restaurant_name > a.restaurant_name
						? -1
						: 0
				);
			case 'desc':
				return arr.sort((a, b) =>
					a.restaurant_name < b.restaurant_name
						? 1
						: b.restaurant_name < a.restaurant_name
						? -1
						: 0
				);
		}
	};

	const handleSortRequest = () => {
		setRestaurants(sortArray(restaurants, orderDirection));
		setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
	};

	const handleDelete = async (e, id) => {
		e.stopPropagation();
		try {
			const response = await RestaurantFinder.delete(`/restaurants/${id}`);
			console.log(response);
			setRestaurants(
				restaurants.filter((restaurant) => {
					return restaurant.restaurant_id !== id;
				})
			);
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleRestaurantSelect = (e, id) => {
		e.stopPropagation();

		navigate(`/restaurant/${id}`);
	};

	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="center" onClick={handleSortRequest}>
							<TableSortLabel active={true} direction={orderDirection}>
								Restaurant Name
							</TableSortLabel>
						</TableCell>

						<TableCell align="center">Location</TableCell>

						<TableCell align="center">Price Range</TableCell>

						<TableCell align="center">Ratings</TableCell>
						<TableCell align="center">Edit</TableCell>
						<TableCell align="center">Delete</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{restaurants &&
						restaurants.map((restaurant) => (
							<TableRow key={restaurant.restaurant_id}>
								<TableCell
									component="th"
									scope="row"
									align="center"
									onClick={(e) =>
										handleRestaurantSelect(e, restaurant.restaurant_id)
									}
									style={{ cursor: 'pointer' }}
								>
									{restaurant.restaurant_name}
								</TableCell>
								<TableCell align="center">{restaurant.location}</TableCell>
								<TableCell align="center">
									{'$'.repeat(restaurant.price_range)}
								</TableCell>
								<TableCell align="center">Yay</TableCell>
								<TableCell align="center">
									<EditRestaurant restaurant={restaurant} />
								</TableCell>
								<TableCell align="center">
									<Button
										variant="outlined"
										color="error"
										onClick={(e) => {
											handleDelete(e, restaurant.restaurant_id);
										}}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default SortedTable;
