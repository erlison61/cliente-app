import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import '../index.css';

import User from './UserCard';
import UserForm from './UserForm';

const Main = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let buttonAdd = useRef(null);

  useEffect(() => {
    fetch('http://localhost:4000/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Cálculo para obter os índices dos usuários a serem exibidos na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Função para mudar para a próxima página
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Função para voltar para a página anterior
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <main>
      <Container>
        <h1 className="text-center">Menu</h1>
        <div className="text-right">
          <Button
            variant="secondary"
            className="mr-4 font-weight-bold"
            onClick={handleShow}
            ref={buttonAdd}
          >
            + | Adicionar Preparação
          </Button>
        </div>

        <Row className="my-2">
          {currentItems.map((user) => (
            <User key={user.id} user={user}></User>
          ))}
        </Row>

        <div className="text-center">
          {currentPage > 1 && (
            <Button variant="primary" className="mr-2" onClick={prevPage}>
              Prev
            </Button>
          )}
          {indexOfLastItem < users.length && (
            <Button variant="primary" onClick={nextPage}>
              Next
            </Button>
          )}
        </div>

        <UserForm
          show={show}
          handleClose={handleClose}
          users={users}
          setUsers={setUsers}
        ></UserForm>
      </Container>
    </main>
  );
};

export default Main;
