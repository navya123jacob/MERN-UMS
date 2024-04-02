import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRegisterMutation } from '../slices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const RegisterScreen = () => {
  const [register] = useRegisterMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    // First name validation
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Mobile number validation
    if (!mobileNumber.trim()  ) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = 'Must be 10 digits';
    }
    else if (/^0+$/.test(mobileNumber)) {
      errors.mobileNumber = 'Must not be all zeros';
    }

    // Password validation
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
      errors.password = 'Password must be valid';
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must be equal';
    }

    return errors;
  };

  const [errors, setErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({})

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const user = await register({ Fname:firstName, Lname:lastName, email, mno:mobileNumber, password });
      console.log(user)
      if(user.data.message=='Already present'){
        setErrors({confirmPassword :'Already Registered'});
        return
      }
      navigate('/login');
    } else {
      setErrors(validationErrors);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo]);

  return (
    <div className="register-screen-bg">
      <h1>SIGN UP</h1>
      <Form onSubmit={submitHandler} className="register-form">
        <Form.Group className="my-2" controlId="firstName">
          <Form.Label style={{ fontWeight: 'bold' }}>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </Form.Group>
        <Form.Group className="my-2" controlId="lastName">
          <Form.Label style={{ fontWeight: 'bold' }}>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label style={{ fontWeight: 'bold' }}>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>
        <Form.Group className="my-2" controlId="mobileNumber">
          <Form.Label style={{ fontWeight: 'bold' }}>Mobile Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          {errors.mobileNumber && <div className="text-danger">{errors.mobileNumber}</div>}
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label style={{ fontWeight: 'bold' }}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label style={{ fontWeight: 'bold' }}>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-Enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
        </Form.Group>
        <Button type="submit" variant="dark" className="mt-3">
          SIGN UP
        </Button>
        <Row className="py-3">
          <Col>
            <span className="register-link" style={{ fontWeight: 'bold' }}>Already Registered?</span> <Link to="/login" className="register-link text-black">Log In</Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default RegisterScreen;