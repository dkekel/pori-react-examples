import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import './DynamicForm.css';

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
      name: yup.string().required('Skill name is required'),
      level: yup.number()
        .min(1, 'Level must be at least 1')
        .max(5, 'Level must not exceed 5')
        .required('Skill level is required'),
    })
  ).required('Skills are required').min(1, 'At least one skill is required'),
});

const DynamicForm = () => {
  const [formData, setFormData] = useState<FormInput | null>(null);

  // Initialize react-hook-form with yup resolver
  const {
    control,
    register,
    handleSubmit,
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

  // Handle form submission
  const onSubmit = (data: FormInput) => {
    setFormData(data);
    console.log(data);
  };

  return (
    <div className="dynamic-form-container">
      <h2>Dynamic Form Example</h2>
      <p>This example demonstrates how to create forms with dynamic inputs using react-hook-form and yup validation.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <p>Add your skills and rate your proficiency level from 1 to 5</p>

          {fields.map((field, index) => (
            <div key={field.id} className="skill-item">
              <div className="form-group">
                <label htmlFor={`skills.${index}.name`}>Skill Name:</label>
                <input
                  id={`skills.${index}.name`}
                  type="text"
                  {...register(`skills.${index}.name`)}
                  className={errors.skills?.[index]?.name ? 'error' : ''}
                />
                {errors.skills?.[index]?.name && (
                  <p className="error-message">{errors.skills[index]?.name?.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`skills.${index}.level`}>Proficiency Level (1-5):</label>
                <Controller
                  control={control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <input
                      id={`skills.${index}.level`}
                      type="number"
                      min="1"
                      max="5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className={errors.skills?.[index]?.level ? 'error' : ''}
                    />
                  )}
                />
                {errors.skills?.[index]?.level && (
                  <p className="error-message">{errors.skills[index]?.level?.message}</p>
                )}
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => remove(index)}
                >
                  Remove Skill
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-button"
            onClick={() => append({ name: '', level: 1 })}
          >
            Add Skill
          </button>
        </div>

        {errors.skills && errors.skills.message && (
          <p className="error-message">{errors.skills.message}</p>
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      {formData && (
        <div className="form-results">
          <h3>Form Submission Results:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
