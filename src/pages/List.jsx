import React, { useContext, useEffect } from 'react';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import { TodosContext } from '../components/contexts/todo.context';
import { UIContext } from '../components/contexts/UI.context';

import TodosList from '../components/TodosList';

function TodosListPage() {
  const { todos, fetchTodos, deleteTodo } = useContext(TodosContext);
  const { showMessage } = useContext(UIContext);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const deleteHandler = (id) => {
    deleteTodo(id);
  };

  return (
    <>
      <Typography variant="h3" component="h2">
        To-do
      </Typography>
      <Button
        onClick={() =>
          showMessage({
            type: 'warning',
            string: 'This is a warning',
          })
        }
      >
        Show Message
      </Button>
      <TodosList todos={todos} deleteHandler={deleteHandler} />
    </>
  );
}

export default TodosListPage;
