import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TodoForm from '../components/forms/TodoForm';
import { TodosContext } from '../components/contexts/todo.context';

function Update() {
  const { id } = useParams();
  const { todos, updateTodo } = useContext(TodosContext);

  const todo = todos.find(({ _id }) => id === _id);
  // send car and handler to form
  return (
    <>
      <Typography variant="h2" component="h1" sx={{ marginBottom: 2 }}>
        Update To-do
      </Typography>
      <TodoForm todo={todo} submitHandler={updateTodo} />
    </>
  );
}

export default Update;
