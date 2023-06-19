import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const UserForm = ({ show, handleClose, users, setUsers }) => {
  const [errors, setErrors] = useState({name: '',email: '',nascimento: '',cep: ''});

  const [user, setUser] = useState({name: '',email: '',nascimento: '',cep: ''});

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      verificarCep(user.cep)
        .then((cepValido) => {
          if (!cepValido) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cep: 'Por favor, digite um CEP válido',
            }));
          }
        })
        .catch((error) => {
          console.error('Erro ao verificar CEP:', error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            cep: 'Ocorreu um erro ao verificar o CEP',
          }));
        });
      }, 500);

    return () => clearTimeout(debounceTimer);
  }, [user.cep])

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setUser((prevUser) => ({
      ...prevUser,
      [fieldName]: fieldValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  }

  const verificarCep = async (cep) => {
    const apiUrl = `https://viacep.com.br/ws/${cep}/json`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      const cepValido = !data.erro;

      return cepValido;
    
    } catch (error) {
      console.error('Erro ao obter os dados do CEP:', error);

      throw new Error('Por favor, digite um CEP válido.');
    }
  }

  const validaCampos = () => {
    const errosValidacao = {};

    if (!user.name) errosValidacao.name = 'Por favor, preencha o nome';

    if (!user.email) errosValidacao.email = 'Por favor, preencha o email';

    if (!user.nascimento) errosValidacao.nascimento = 'Por favor, preencha a data de nascimento';

    if (!user.cep) errosValidacao.cep = 'Por favor, digite um CEP válido';

    setErrors((errosAnteriores) => ({...errosAnteriores,...errosValidacao}));

    return Object.keys(errosValidacao).length === 0;
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (!validaCampos()) return;

    fetch('http://localhost:4000/users', {
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
        } else {
          throw new Error('Erro ao enviar o formulário');
        }
      })
      .then((data) => {
        setUsers([...users, data]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

export default UserForm;
