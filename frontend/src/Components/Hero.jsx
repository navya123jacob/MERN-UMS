import { Card, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetUserByIdQuery } from '../slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setDocument } from '../slices/AuthSlice';
import { Image } from 'react-bootstrap';

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentuser = useSelector((state) => state.auth.document);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const id = userInfo?.id; 

  const { data, isError } = useGetUserByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  }); //checkout

  useEffect(() => {
    dispatch(setDocument(data));
  }, [data, dispatch]);
 
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <Card className="bg-transparent">
  <div className='cardInner'>
    <Card.Body>
      {currentuser?.image && ( 
        <div className="text-center mb-3">
          <Image src={currentuser.image} alt="Profile" roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
        </div>
      )}
      <Card.Title className="text-center">Hello {currentuser?.Fname || ''}!</Card.Title>
      <Card.Text>
        <p><strong>First Name:</strong> {currentuser?.Fname || ''}</p>
        <p><strong>Last Name:</strong> {currentuser?.Lname || ''}</p>
        <p><strong>Email:</strong> {currentuser?.email || ''}</p>
        <p><strong>Mobile Number:</strong> {currentuser?.mno || ''}</p>
      </Card.Text>
    </Card.Body>
    <Card.Footer className="text-center">
      <LinkContainer to='/profile'>
        <Nav.Link variant="dark">Edit</Nav.Link>
      </LinkContainer>
    </Card.Footer>
  </div>
</Card>

  );
};

export default Hero;
