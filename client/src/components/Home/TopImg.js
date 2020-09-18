import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';

const TopImg = () => {
	return (
		<section id='TopImg'>
			<Container>
				<div className='title'>
					<h2>
						”If we command our wealth, we shall be rich and free. If our wealth
						commands us, we are poor indeed.”
					</h2>
					<br />
					<Link className='btn' to='/howitworks'>
						Get Started
					</Link>
				</div>
			</Container>
		</section>
	);
};

export default TopImg;
