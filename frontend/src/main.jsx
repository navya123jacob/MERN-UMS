import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen.jsx';
import LoginScreen from './Screens/LoginScreen.jsx';
import RegisterScreen from './Screens/RegisterScreen.jsx';
import EditProfile from './Screens/EditProfile.jsx';
import { Provider } from 'react-redux';
import store from './Store.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeScreen />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </React.StrictMode>
  </Provider>
);


// React treats Header as a single instance of the component across the entire application. Even though it's included in multiple places, React recognizes it as the same component and renders it only once in the final DOM output.

// However, when you explicitly include the Header component twice within the JSX hierarchy of the App component .React treats each <Header /> instance separately within the scope of the App component. 
// This means that React will reuse the same instance of the child component for each occurrence within the parent component's JSX hierarchy.