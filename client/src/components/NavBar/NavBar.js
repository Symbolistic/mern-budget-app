import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';
import { Container } from '@material-ui/core';

function NavBar(props) {
	const { isAuthenticated, setIsAuthenticated, setUser } = useContext(
		AuthContext
	);

	const location = useLocation();

	useEffect(() => {
		console.log(location.pathname);

		if (location.pathname === '/') {
			document
				.getElementById('navbar')
				.setAttribute('style', 'background: none');
		} else {
			document
				.getElementById('navbar')
				.setAttribute('style', 'position: relative');
		}
	}, [location]);

	const onClickLogoutHandler = () => {
		AuthService.logout().then((data) => {
			if (data.success) {
				setUser(data.user);
				setIsAuthenticated(false);
			}
		});
	};

	const unauthenticatedNavBar = () => {
		return (
			<>
				<Link to='/'>
					<li className='nav-item nav-link'>Home</li>
				</Link>

				<Link to='/howitworks'>
					<li className='nav-item nav-link'>Guide</li>
				</Link>

				<Link to='/login'>
					<li className='nav-item nav-link'>Login</li>
				</Link>
				<Link to='/register'>
					<li className='nav-item nav-link'>Register</li>
				</Link>
			</>
		);
	};

	const authenticatedNavBar = () => {
		return (
			<>
				<Link to='/'>
					<li className='nav-item nav-link'>Home</li>
				</Link>

				<Link to='/howitworks'>
					<li className='nav-item nav-link'>Getting Started</li>
				</Link>

				<Link to='/budget'>
					<li className='nav-item nav-link'>Budget</li>
				</Link>

				<Link to='/' onClick={onClickLogoutHandler}>
					<li className='nav-item nav-link'>Logout</li>
				</Link>
			</>
		);
	};

	return (
		<header id='navbar'>
			<Container className='header-nav'>
				<div className='logo'></div>
				<label htmlFor='hamburger'>
					<i className='fas fa-bars'></i>
				</label>
				<input type='checkbox' id='hamburger' />

				<ul className='nav'>
					{!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
				</ul>
			</Container>
		</header>
	);
}

export default NavBar;
