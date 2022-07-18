import React from 'react';
import AddRestaurant from '../components/AddRestaurant';
import Header from '../components/Header';
import RestaurantList from '../components/RestaurantList';
import Container from '@mui/material/Container';

const Home = () => {
	return (
		<div>
			<Container>
				<Header />
				<AddRestaurant />
				<RestaurantList />
			</Container>
		</div>
	);
};

export default Home;
