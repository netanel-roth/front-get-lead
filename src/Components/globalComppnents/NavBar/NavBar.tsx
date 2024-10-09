import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../globalCSS/Nav.css'; // Ensure this path is correct

const NavBar: React.FC = () => {
    return (
        <Navbar className="App-header" expand="lg">
            <Nav.Link as={Link} to="/Lead">Upload</Nav.Link>
            <Nav.Link as={Link} to="/"><img className='logo Nav-pointer' src={`${window.location.origin}/assets/n-logo.svg`} alt="logo" /></Nav.Link>
            <Nav.Link as={Link} to="/Login">Login</Nav.Link>
        </Navbar>
    );
};

export default NavBar;