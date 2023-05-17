import React, { createContext, useState, useCallback, useContext } from 'react';
import { TODOS_ENDPOINT, STORAGE_KEY } from '../../settings';
import { UIContext } from './UI.context';

export const TodosContext = createContext({
  fetchTodos: () => [],
  addTodo: () => {},
  updateTodo: () => {},
  deleteTodo: () => {},
  loaded: false,
  loading: false,
  error: null,
  todos: [],
});
//
export const TodosProvider = ({ children }) => {
  const { showMessage } = useContext(UIContext);
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    // console.log('loading', loading);
    // console.log('error', error);
    if (loading || loaded || error) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(TODOS_ENDPOINT);
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setTodos(data);
    } catch (err) {
      setError(err.message || err.statusText);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [error, loaded, loading]);

  const addTodo = useCallback(
    async (formData) => {
      console.log('about to add', formData);
      try {
        const response = await fetch(TODOS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(formData),
        });
        if (response.status !== 201) {
          throw response;
        }
        const savedTodo = await response.json();
        console.log('got data', savedTodo);
        const newTodos = [...todos, savedTodo];
        localStorage.setItem('to-dos', JSON.stringify(newTodos));
        setTodos(newTodos);
      } catch (err) {
        console.log(err);
        showMessage({
          type: 'error',
          string: `error loading to-dos`,
        });
      }
    },
    [todos],
  );

  const updateTodo = useCallback(
    async (id, formData) => {
      console.log('updating', id, formData);
      let updatedTodo = null;
      // Get index
      const index = todos.findIndex((todo) => todo._id === id);
      console.log(index);
      if (index === -1) throw new Error(`To-do with index ${id} not found`);
      // Get actual car
      const oldTodo = todos[index];
      console.log('old To-do', oldTodo);

      // Send the differences, not the whole update
      const updates = {};

      for (const key of Object.keys(oldTodo)) {
        if (key === '_id') continue;
        if (oldTodo[key] !== formData[key]) {
          updates[key] = formData[key];
        }
      }

      try {
        const response = await fetch(`${TODOS_ENDPOINT}${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(updates),
        });

        if (response.status !== 200) {
          throw response;
        }

        // Merge with formData
        updatedTodo = {
          ...oldTodo,
          ...formData, // order here is important for the override!!
        };
        console.log('updated To-do', updatedTodo);
        // recreate the cars array
        const updatedTodos = [
          ...todos.slice(0, index),
          updatedTodo,
          ...todos.slice(index + 1),
        ];
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        // addToast(`Updated ${updatedCar.name}`, {
        //   appearance: "success",
        // });
        setTodos(updatedTodos);
      } catch (err) {
        console.log(err);
      }
    },
    [todos],
  );

  const deleteTodo = useCallback(
    async (id) => {
      let deletedTodo = null;
      try {
        const response = await fetch(`${TODOS_ENDPOINT}${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        // if (response.status !== 204) {
        //   throw response;
        // }
        if (!response.ok) {
          throw response;
        }
        // Get index
        const index = todos.findIndex((todos) => todos._id === id);
        deletedTodo = todos[index];
        // recreate the cars array without that car
        const updatedTodos = [
          ...todos.slice(0, index),
          ...todos.slice(index + 1),
        ];
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
        console.log(`Deleted ${deletedTodo.name}`);
        // addToast(`Deleted ${deletedCar.name}`, {
        //   appearance: "success",
        // });
      } catch (err) {
        console.log(err);
      }
    },
    [todos],
  );

  return (
    <TodosContext.Provider
      value={{
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
