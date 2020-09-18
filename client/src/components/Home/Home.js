import React from 'react';
import TopImg from './TopImg';
import About from './About';
import GettingStarted from './GettingStarted';

function Home() {
	return (
		<div id='home-container'>
			<TopImg />
			<About />
			<GettingStarted />
		</div>
	);
}

export default Home;
