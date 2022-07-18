import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import RestaurantDetailPage from './routes/RestaurantDetailPage';
import { RestaurantsContextProvider } from './context/ContextRestaurant';

function App() {
	return (
		<RestaurantsContextProvider>
			<div>
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
					</Routes>
				</Router>
			</div>
		</RestaurantsContextProvider>
	);
}

export default App;
