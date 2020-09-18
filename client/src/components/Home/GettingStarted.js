import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import comingsoon from '../../assets/comingsoon.gif';

const GettingStarted = () => {
	return (
		<section id='GettingStarted'>
			<Container>
				<Grid container spacing={3} alignItems='center' justify='center'>
					<Grid item xs={12} md={6}>
						<h2>Getting Started</h2>
						<p>
							This app has been designed for you to easily start using. Simply
							register your account and log in and you'll be greeted with a
							button to create your first budget for the month.
							<br />
							<br />
							After doing that you can add groups to each category and put your
							income, savings, and expense entries into the groups you create.
							Once you set that up you're done, now you just put the actual
							amount you spent at the end of the month into each entry. Be
							honest and don't lie about your actual expenses!
						</p>
					</Grid>
					<Grid item xs={12} md={6} className='comingsoon'>
						<img src={comingsoon} alt='coming soon' />
					</Grid>
					<Grid item xs={12} md={12}>
						<Link className='btn' to='/howitworks'>
							Learn More
						</Link>
					</Grid>
				</Grid>
			</Container>
		</section>
	);
};

export default GettingStarted;
