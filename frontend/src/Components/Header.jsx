import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap'
import { logout } from '../slices/AuthSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setCredentials } from '../slices/AuthSlice';
import { useEffect } from 'react';
const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Authentication</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                        <LinkContainer to='/'>
                            <Nav.Link >Home</Nav.Link>
                        </LinkContainer>                      
                        </Nav>
                        <Nav>
                        
                        <Nav.Link onClick={signout}>
                        <FaSignOutAlt /> Sign Out
                          </Nav.Link>
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
