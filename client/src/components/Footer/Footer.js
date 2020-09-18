import React from 'react';
import { Container } from '@material-ui/core';

const Footer = () => {
	return (
		<footer id='footer'>
			<Container>
				<nav className='menu'>
					<a href='#TopImg'>Home</a>
					<a href='#About'>About</a>
					<a href='#GettingStarted'>Getting Started</a>
					<a href='mailto: SyCorporates@gmail.com'>Contact Us</a>
				</nav>

				<div className='copyright'>
					&#169; 2020 Copyright <br />
					Developed by Vishon Singh
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
