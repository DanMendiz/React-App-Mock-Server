import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TodoForm from '../components/forms/TodoForm';
import { TodosContext } from '../components/contexts/todo.context';

function Add() {
  const { addTodo } = useContext(TodosContext);
  const navigate = useNavigate();

  const submitHandler = (data) => {
    addTodo(data);
    navigate('/');
  };
  return (
    <>
      <Typography variant="h2" component="h1">
        Add To-Do
      </Typography>
      <TodoForm submitHandler={submitHandler} />
    </>
  );
}

export default Add;
