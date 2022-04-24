import { useState } from "react";
import AddUserModal from "./AddUserModal";

import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import "./manageUsersStyles.css";

const ManageUsers = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <div className="custom-card">
      <div className="header">
        <Row>
          <Col>
            <h2>Manage Users</h2>
          </Col>
        </Row>
      </div>
      <div className="main-content" m={5}>
        <Row className="text-center mb-3">
          <Col>
            <Button variant="outline-primary" onClick={handleOpen}>
              Add User
            </Button>
          </Col>
        </Row>
        <AddUserModal open={open} />
        <Row>
          <Col>
            <Table striped bordered hover id="manageUsers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.is_admin? 'Admin':'Regular'}</td>
                    <td>
                    <Button variant="outline-primary">Delete</Button>
                    </td>
                  </tr>
                ))}
               
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ManageUsers;
