import React from 'react';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import dataprivacy from '../../assets/dataprivacy.jpg';
import customization from '../../assets/customization.png';
import simplicity from '../../assets/simplicity.png';

const About = () => {
	return (
		<section id='About'>
			<Container>
				<Grid container spacing={3} alignItems='center' justify='center'>
					<Grid item xs={12} md={12}>
						<h2>What is Lucid Budget?</h2>
						<p>
							Lucid Budget is an online budgeting app that will help you manage
							your expenses and help you take control of the way you handle your
							money. The key difference between Lucid Budget and all the other
							budgeting apps out there is we stand by 3 core principles that
							were said and followed through since the beginning of this
							applications development.
						</p>
					</Grid>
					<Grid item xs={12} md={12} className='principles'>
						<h2>Our 3 Core Principles</h2>
					</Grid>

					<Grid item xs={12} md={6}>
						<h3>Data Privacy</h3>
						<p>
							Many websites require you to give access to your bank account in
							order for them to pull your transactions and other data for their
							app. The problem with this is if they get hacked, all your data is
							now exposed. Lucid Budget will never ask for your personal data
							and we recommend you never put anything too sensitive in our
							application, like credit card numbers or anything like that. We
							understand the downside of this is we can't pull your bank data
							easily but we are currently in the process of developing a way
							around this.
						</p>
					</Grid>
					<Grid item xs={12} md={6} className='dataprivacy'>
						<img
							src={dataprivacy}
							alt='data privacy'
							height='210'
							width='270'
						/>
					</Grid>

					<Grid item xs={12} md={6} className='customization'>
						<img
							src={customization}
							alt='customization'
							height='200'
							width='230'
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<h3>Customizability</h3>
						<p>
							Most Budgeting App's are very restrictive in how they allow you to
							budget, when designing this application, customizability was kept
							in mind so users could freely budget how they want and this is
							continuously being improved. You can create your own grouped
							income, savings, and expenses, add your own expected transactions,
							you can view seperate charts for both your expected budget and
							your actual spent amount at the end of the month.
						</p>
					</Grid>

					<Grid item xs={12} md={6}>
						<h3>Simplicity</h3>
						<p>
							Many Budgeting App's have a learning curve to their system and can
							make it very daunting for someone just learning to budget, this
							can lead to users quitting early and not sticking with their
							budgeting plan. We are tackling this by trying to make this
							application as simple and user friendly as possible so users will
							stick with their budget and see changes in their spending habits
							and improvements in their lives.
						</p>
					</Grid>
					<Grid item xs={12} md={6} className='customization'>
						<img src={simplicity} alt='simplicity' height='200' width='200' />
					</Grid>
				</Grid>
			</Container>
		</section>
	);
};

export default About;
