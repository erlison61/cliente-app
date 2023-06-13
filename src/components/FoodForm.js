import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const FoodForm = ({ show, handleClose, users, setUsers }) => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    nascimento: '',
    cep: '',
  });

  let [user, setUser] = useState({
    name: '',
    email: '',
    nascimento: '',
    cep: '',
  });

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    async function verificarCep() {
      const apiUrl = `https://viacep.com.br/ws/${user.cep}/json`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        const cep = data.cep.replace("-","")
        const cepInput = user.cep.replace("-","");
        
        if (response.ok) {
          if (data.erro || cep !== cepInput) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cep: 'Por favor, digite um CEP válido.',
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cep: '',
            }));
          }
        } else {
          throw new Error('Erro ao obter os dados do CEP');
        }
      } catch (error) {
        console.error('Erro ao obter os dados do CEP:', error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          cep: 'Por favor, digite um CEP válido.',
        }));
      }
    }
  
    verificarCep();
  }, [user.cep]);
  
  
  
  

  const validaCampos = () => {
    const validationErrors = {};
  
    if (!user.name) validationErrors.name = 'Por favor, preencha o nome';
    
    if (!user.email) validationErrors.email = 'Por favor, preencha o email';
    
    if (!user.nascimento) validationErrors.nascimento = 'Por favor, preencha a data de nascimento';
    
    if (!user.cep) validationErrors.cep = 'Por favor, preencha o CEP';
    
  
    setErrors(validationErrors);
  
    return Object.keys(validationErrors).length === 0;
  };
  
  const handleOnSubmit = (event) => {
    event.preventDefault();
  
    if (!validaCampos()) {
      return;
    }
  
    fetch('http://localhost:5050/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleClose();
          return response.json();
        }
      })
      .then((data) => {
        setUsers([...users, data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastro de usuário</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome"
              name="name"
              onChange={handleChange}
              value={user.name}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={user.email}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nascimento</Form.Label>
            <Form.Control
              type="date"
              placeholder="Nascimento"
              name="nascimento"
              onChange={handleChange}
              value={user.nascimento}
              isInvalid={!!errors.nascimento}
            />
            <Form.Control.Feedback type="invalid">{errors.nascimento}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>CEP</Form.Label>
            <Form.Control
              type="text"
              placeholder="CEP"
              name="cep"
              onChange={handleChange}
              value={user.cep}
              isInvalid={!!errors.cep}
            />
            <Form.Control.Feedback type="invalid">{errors.cep}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FoodForm;
