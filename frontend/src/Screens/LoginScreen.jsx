import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/AuthSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.adminAuth);

  const validateForm = () => {
    
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (error) {
      setPasswordError(error?.data?.message);
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <div className="register-screen-bg">
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label style={{ fontWeight: 'bold' }}>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label style={{ fontWeight: 'bold' }}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
        </Form.Group>
        <Button type="submit" variant="dark" className="mt-3">
          Sign In
        </Button>
        <Row className="py-3">
          <Col>
            <span style={{ fontWeight: 'bold' }}>New Customer ?</span>{' '}
            <Link to="/register" className="text-black">
              Register
            </Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default LoginScreen;
