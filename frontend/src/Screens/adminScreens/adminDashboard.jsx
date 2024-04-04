import React, { useState, useEffect } from "react";
import HeaderAdmin from "../../Components/Admin/AdminHeader.jsx";
import { Link } from "react-router-dom";
import { useGetUsersMutation, useDeleteUserMutation } from "../../slices/adminSlice/adminApliSlice.js";
import { toast } from "react-toastify";
import EditUsersModal from "../../Components/Admin/EdiUserMod.jsx";
import AddUserModal from "../../Components/Admin/AddUserMod.jsx";
import Loader from "./Loader.jsx";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import './AdminStyle.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [isEditUsersModalOpen, setIsEditUsersModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [existingUser, setExistingUser] = useState(users?.length || 0);
  const [Lname, setLname] = useState('');
  const [mno, setMno] = useState('');

  const handleEditProfileClick = (user) => {
    setSelectedUser(user);
    setIsEditUsersModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditUsersModalOpen(false);
    setIsAddUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUserClick = () => {
    setIsAddUserModalOpen(true);
  };

  const [getUsers, { isLoading }] = useGetUsersMutation();
  const [deleteusers, { removeLoading }] = useDeleteUserMutation();

  // Fetch users initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchData();
  }, [isEditUsersModalOpen, existingUser]);

  // Filter users based on search
  useEffect(() => {
    const filteredUsers = filteredData(search, users);
    setFilteredUsers(filteredUsers);
    setCurrentPage(1);
  }, [search, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  function filteredData(searchText, userList) {
    if (searchText === "") {
      return users;
    } else {
      const filtered = userList.filter((user) => {
        return (
          user.Fname.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      });
      return filtered;
    }
  }

  const handlePagination = (action) => {
    if (action === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (action === "next" && indexOfLastUser < filteredUsers?.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDeleteUser = async(userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      iconColor: '#3F51B5',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3F51B5',
      confirmButtonText: 'Yes, delete it!',
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteusers({ userId: userId }).unwrap();
          if (res) {
            setExistingUser((prevState) => prevState - 1);
            toast.success('user removed successfully');
          }
        } catch (error) {
          toast.error(error?.data?.message || error.message);
        }
      }
    });
  };

  return (
    <>
      <div className="admin-log-screen-bg">
        <HeaderAdmin />
        
        <div className="admin-dashboard-container" >
          <div className="admin-dashboard-content text-center" >
            <Link to="/admin/home" className="admin-dashboard-back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" className="admin-back-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.293 9.293a1 1 0 0 1 0-1.414l3-3a1 1 0 1 1 1.414 1.414L9.414 8H17a1 1 0 1 1 0 2H9.414l1.293 1.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414z" clipRule="evenodd"/>
              </svg>
              <span style={{ padding: '10px' }}>Back</span>
            </Link>
            <div className="admin-search-box">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="admin-search-input"
              />
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Profile Pic</th>
                    <th>Username</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td><img src={user.image} alt={user.Fname} className="admin-user-avatar" /></td>
                        <td>{user.Fname}</td>
                        <td>{user.Lname}</td>
                        <td>{user.email}</td>
                        <td>{user.mno}</td>
                        <td>
                          <button onClick={() => handleEditProfileClick(user)} className="admin-edit-btn" style={{ backgroundColor: '#080808' }}>Edit</button>
                          <button onClick={() => handleDeleteUser(user._id)} className="admin-delete-btn m-1" style={{ backgroundColor: '#080808' }}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="admin-no-users">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              <button onClick={() => handlePagination("prev")} disabled={currentPage === 1} className={`admin-pagination-btn ${currentPage === 1 ? "admin-pagination-disabled" : ""}`}>Previous</button>
              <span>{currentPage}</span>
              <button onClick={() => handlePagination("next")} disabled={indexOfLastUser >= filteredUsers?.length} className={`admin-pagination-btn ${indexOfLastUser >= filteredUsers?.length ? "admin-pagination-disabled" : ""}`}>Next</button>
            </div>
            <div className="admin-add-user">
              <button style={{ backgroundColor: '#080808', boxShadow: '0 4px 6px rgba(255, 255, 255, 0.4)' }} onClick={handleAddUserClick} className="admin-add-user-btn">Add User</button>
            </div>
          </div>
        </div>
        {(isLoading || removeLoading) && <Loader />}
        {isEditUsersModalOpen && selectedUser && (
          <EditUsersModal
            userData={selectedUser}
            setSelectedUser={setSelectedUser}
            isOpen={isEditUsersModalOpen}
            onClose={handleCloseModal}
          />
        )}
        {isAddUserModalOpen && (
          <AddUserModal
            users={users}
            setUsers={setUsers}
            isOpen={isAddUserModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
