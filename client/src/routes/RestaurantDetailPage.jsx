import React from 'react';
import { useContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { RestaurantsContext } from '../context/ContextRestaurant';
import RestaurantFinder from '../api/RestaurantFinder';

const RestaurantDetailPage = () => {
	const { id } = useParams();
	const { selectedRestaurant, setSelectedRestaurant } =
		useContext(RestaurantsContext);

	const fetchData = useCallback(async () => {
		try {
			console.log(id);
			const response = await RestaurantFinder.get(`/restaurants/${id}`);
			console.log(response.data.data[0]);
			setSelectedRestaurant(response.data.data[0]);
		} catch (err) {
			console.log(err.message);
		}
	}, [setSelectedRestaurant]);

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<h1 className="font-weight-light display-1 text-center">
			{selectedRestaurant && selectedRestaurant.restaurant_name}
		</h1>
	);
};

export default RestaurantDetailPage;
