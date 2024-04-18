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
  const { data, isLoading, isError } = useGetUserByIdQuery(userInfo?.id);
  const [editUser] = useEditUserMutation();
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    email: "",
    mno: "",
    password: "", // Added password field
    image: null,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!userInfo){
     navigate('/login')
    }
    
    if (data) {
      setFormData({
        Fname: data.Fname,
        Lname: data.Lname,
        email: data.email,
        mno: data.mno,
        password: "",
        image: null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setErrors({
        ...errors,
        image: "Please select a valid image file (JPEG, PNG, or GIF).",
      });
      return;
    }

    

    setFormData({
      ...formData,
      image: file,
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.Fname.trim()) {
      errors.Fname = "First name is required.";
      isValid = false;
    }

    if (!formData.Lname.trim()) {
      errors.Lname = "Last name is required.";
      isValid = false;
    }

    if (!formData.mno.toString().trim()) {
      errors.mno = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mno.toString().trim())) {
      errors.mno = "Mobile number must be 10 digits.";
      isValid = false;
    } else if (/^0+$/.test(formData.mno.toString().trim())) {
      errors.mno = "Mobile number should not be all zeros.";
      isValid = false;
    }

    if (formData.password && formData.password.trim()) {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!strongPasswordRegex.test(formData.password)) {
        errors.password = "Password must be valid.";
        isValid = false;
      }
    }
    if (formData.image) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedImageTypes.includes(formData.image.type)) {
        errors.image = "Please upload an image file (JPEG, PNG, GIF).";
        isValid = false;
      }
      
    }

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
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

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
          <Form.Group controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            {errors.image && (
              <Form.Text className="text-danger">{errors.image}</Form.Text>
            )}
          </Form.Group>
          {formData.image ? (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Profile"
              style={{ width: "100px", height: "auto", marginTop: "10px" }}
            />
          ) : (
            <img
              src={data.image}
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
