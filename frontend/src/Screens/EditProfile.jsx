import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../slices/userApiSlice";
import { useEditUserMutation } from "../slices/userApiSlice";
import Header from "../Components/Header";
import { setDocument } from "../slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const current = useSelector((state) => state.auth.document);
  const id = userInfo?.id;
  const { data, isLoading, isError } = useGetUserByIdQuery(id);
  const [editUser] = useEditUserMutation();
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    email: "",
    mno: "",
    image: null, // Add state for the image
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data) {
      setFormData({
        Fname: data.Fname,
        Lname: data.Lname,
        email: data.email,
        mno: data.mno,
        image: null, // Initialize image state
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    await setFormData({
      ...formData,
      image: e.target.files[0], 
    });
    console.log(formData.image,e.target.files[0])
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validation logic...

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Fname", formData.Fname);
      formDataToSend.append("Lname", formData.Lname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mno", formData.mno);
      formDataToSend.append("image", formData.image);

      const edited = await editUser(formDataToSend);
      dispatch(setDocument({ ...edited }));
      navigate("/");
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: Unable to fetch user data</div>;
  }

  return (
    <>
      <Header />
      <div className="home-screen-bg">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="Fname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="Fname"
              value={formData.Fname}
              onChange={handleChange}
            />
            {errors.Fname && (
              <Form.Text className="text-danger">{errors.Fname}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="Lname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="Lname"
              value={formData.Lname}
              onChange={handleChange}
            />
            {errors.Lname && (
              <Form.Text className="text-danger">{errors.Lname}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              readOnly
              disabled
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="mno">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mno"
              value={formData.mno}
              onChange={handleChange}
            />
            {errors.mno && (
              <Form.Text className="text-danger">{errors.mno}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleImageChange}
            />
          </Form.Group>
          {formData.image && ( // Display the uploaded image if available
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Profile"
              style={{ width: "100px", height: "auto", marginTop: "10px" }}
            />
          )}
          <Button variant="dark m-2" type="submit">
            Save Changes
          </Button>
        </Form>
      </div>
    </>
  );
};

export default EditProfile;