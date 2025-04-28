import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormEntry, getAllEntries, createEntry, updateEntry } from '../api/formService';

// Define the form data structure
interface FormInput {
  name: string;
  email: string;
  skills: {
    name: string;
    level: number;
  }[];
}

// Create a validation schema using yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  skills: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Skill name is required')
      .min(3, 'Skill name must be at least 3 characters long'),
      level: yup.number()
        .min(1, 'Level must be at least 1')
        .max(5, 'Level must not exceed 5')
        .required('Skill level is required'),
    })
  ).required('Skills are required').min(1, 'At least one skill is required'),
});

const DynamicForm = () => {
  const [formData, setFormData] = useState<FormInput | null>(null);
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<FormEntry | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize react-hook-form with yup resolver
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      skills: [{ name: '', level: 1 }],
    },
  });

  // Use fieldArray to handle dynamic fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  // Fetch all entries when component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getAllEntries();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch entries:', error);
        showNotification('Failed to fetch entries', 'error');
      }
    };

    fetchEntries();
  }, []);

  // Update form when a different entry is selected
  useEffect(() => {
    if (selectedEntry) {
      reset({
        name: selectedEntry.name,
        email: selectedEntry.email,
        skills: selectedEntry.skills.length > 0
          ? selectedEntry.skills
          : [{ name: '', level: 1 }]
      });
    } else {
      reset({
        name: '',
        email: '',
        skills: [{ name: '', level: 1 }]
      });
    }
  }, [selectedEntry, reset]);

  // Handle selecting an entry
  const handleSelectEntry = (entry: FormEntry) => {
    setSelectedEntry(entry);
  };

  // Handle creating a new entry
  const handleNewEntry = () => {
    setSelectedEntry(null);
    reset({
      name: '',
      email: '',
      skills: [{ name: '', level: 1 }]
    });
  };

  // Show notification
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle form submission
  const onSubmit = async (data: FormInput) => {
    try {
      let result: FormEntry | null;

      if (selectedEntry) {
        // Update existing entry
        result = await updateEntry(selectedEntry.id, data);
        if (result) {
          showNotification('Entry updated successfully', 'success');

          // Update entries list
          setEntries(prevEntries =>
            prevEntries.map(entry =>
              entry.id === selectedEntry.id ? result as FormEntry : entry
            )
          );
        }
      } else {
        // Create new entry
        result = await createEntry(data);
        showNotification('Entry created successfully', 'success');

        // Add to entries list
        setEntries(prevEntries => result ? [...prevEntries, result] : prevEntries);
        setSelectedEntry(result);
      }

      setFormData(data);
    } catch (error) {
      console.error('Failed to save entry:', error);
      showNotification('Failed to save entry', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dynamic Form Example
        </Typography>
        <Typography variant="body1" paragraph>
          This example demonstrates how to create forms with dynamic inputs using react-hook-form and yup validation.
          The form data is stored in a simple in-memory backend.
        </Typography>

        <Grid container spacing={3}>
          {/* Left sidebar with entries list */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Saved Entries
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {entries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleSelectEntry(entry)}
                        selected={selectedEntry?.id === entry.id}
                      >
                        <ListItemText
                          primary={entry.name}
                          secondary={entry.email}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleNewEntry}
                sx={{ mt: 2 }}
              >
                Create New Entry
              </Button>
            </Paper>
          </Grid>

          {/* Right side with form */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedEntry ? `Edit Entry: ${selectedEntry.name}` : 'Create New Entry'}
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      id="name"
                      label="Name"
                      fullWidth
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      {...register('name')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      id="email"
                      label="Email"
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...register('email')}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 3, mt: 2, mb: 2 }}>
                      <Typography variant="h5" gutterBottom>
                        Skills
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Add your skills and rate your proficiency level from 1 to 5
                      </Typography>

                      {fields.map((field, index) => (
                        <Box
                          key={field.id}
                          sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            bgcolor: 'background.paper'
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                id={`skills.${index}.name`}
                                label="Skill Name"
                                fullWidth
                                variant="outlined"
                                error={!!errors.skills?.[index]?.name}
                                helperText={errors.skills?.[index]?.name?.message}
                                {...register(`skills.${index}.name`)}
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Controller
                                control={control}
                                name={`skills.${index}.level`}
                                render={({ field }) => (
                                  <TextField
                                    id={`skills.${index}.level`}
                                    label="Proficiency Level (1-5)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 1, max: 5 } }}
                                    error={!!errors.skills?.[index]?.level}
                                    helperText={errors.skills?.[index]?.level?.message}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                )}
                              />
                            </Grid>

                            {fields.length > 1 && (
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => remove(index)}
                                >
                                  Remove Skill
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      ))}

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => append({ name: '', level: 1 })}
                        sx={{ mt: 2 }}
                      >
                        Add Skill
                      </Button>
                    </Paper>
                  </Grid>

                  {errors.skills && errors.skills.message && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.skills.message}</FormHelperText>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      {selectedEntry ? 'Update' : 'Create'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {formData && (
                <Box sx={{ mt: 4, p: 3, bgcolor: 'info.lighter', borderRadius: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    Form Submission Results:
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      overflow: 'auto',
                      fontFamily: 'monospace'
                    }}
                  >
                    {JSON.stringify(formData, null, 2)}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DynamicForm;
