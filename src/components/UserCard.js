import React from 'react';

import { Col, Card } from 'react-bootstrap';


const UserCard = ({ user }) => {
  return (
    <Col sm="12" md="6" lg="4" xl="3">
      <Card>
        <Card.Header className="text-center font-weight-bold">
          {user.name}
        </Card.Header>

        <Card.Body>
          <p>Email: {user.email}</p>
          <p>Data de Nascimento: {user.nascimento}</p>
          <p>CEP: {user.cep}</p>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserCard;