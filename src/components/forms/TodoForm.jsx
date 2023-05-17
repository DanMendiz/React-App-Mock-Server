import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import CircularProgress from "@mui/material/CircularProgress";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button } from '@mui/material';

const schema = yup
  .object()
  .shape({
    name: yup.string().max(30).required(),
    task: yup.string().max(100).required(),
    avatar_url: yup.string().url(),
  })
  .required();

const defaults = {
  name: '',
  task: '',
  avatar_url: '',
};

export default function TodoForm({ todo, submitHandler }) {
  console.log(todo);

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    control,
    formState,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: todo || defaults,
  });

  useEffect(() => {
    console.log(formState);
  });

  // useEffect(() => {
  //   // console.log('useeffect', car);
  //   if (todos) {
  //     reset(todos);
  //   }
  // }, [todos, reset]);

  const formRowStyle = {
    marginBlockEnd: '1em',
  };

  let submitFn = (vals) => {
    submitHandler(vals);
    reset();
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(submitFn)}>
      <div style={formRowStyle}>
        <Controller
          control={control}
          name="name"
          defaultValue={''}
          render={({ field }) => (
            <TextField
              type="name"
              {...field}
              label="name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
      </div>
      <div style={formRowStyle}>
        <Controller
          control={control}
          name="task"
          defaultValue={''}
          render={({ field }) => (
            <TextField
              type="name"
              fullWidth
              error={!!errors.task}
              {...field}
              label="task"
              pattern={/[0-9]{1,4}/}
              helperText={errors.task?.message}
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="avatar_url"
          defaultValue={''}
          render={({ field }) => (
            <TextField
              fullWidth
              type="text"
              error={!!errors.avatar_url}
              {...field}
              label="Avatar URL"
              helperText={errors.avatar_url?.message}
            />
          )}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Button
          type="reset"
          onClick={() => reset()}
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!isDirty}
        >
          Reset
        </Button>
        <Button
          type="submit"
          primary="true"
          variant="contained"
          disabled={isSubmitting || !isDirty || (isDirty && !isValid)}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
