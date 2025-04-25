# React Form Examples with react-hook-form and yup

This project demonstrates how to create dynamic forms in React using:
- [react-hook-form](https://react-hook-form.com/) for form state management
- [yup](https://github.com/jquense/yup) for schema validation
- TypeScript for type safety
- Vite for fast development

## Features

- **Dynamic Form Fields**: Add and remove form fields dynamically
- **Form Validation**: Client-side validation using yup schema
- **Type Safety**: Full TypeScript integration
- **Performance**: Optimized rendering with react-hook-form

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser at: `http://localhost:5173`

## Dynamic Form Example

The main example demonstrates:

1. **Form Setup with react-hook-form**
   - Using `useForm` hook with yup resolver
   - Type-safe form handling with TypeScript

2. **Dynamic Fields with useFieldArray**
   - Adding and removing form fields dynamically
   - Managing arrays of form inputs

3. **Validation with yup**
   - Creating validation schemas
   - Displaying validation errors
   - Custom validation rules

## Code Explanation

### 1. Form Data Structure

```typescript
interface FormInput {
  name: string;
  email: string;
  skills: {
    name: string;
    level: number;
  }[];
}
```

### 2. Validation Schema with Yup

```typescript
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
  ).min(1, 'At least one skill is required'),
});
```

### 3. Setting Up React Hook Form

```typescript
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
```

### 4. Managing Dynamic Fields

```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: 'skills',
});
```

### 5. Form Submission

```typescript
const onSubmit = (data: FormInput) => {
  setFormData(data);
  console.log(data);
};
```

### 6. Rendering Dynamic Fields

```tsx
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
  </div>
))}

<button
  type="button"
  className="add-button"
  onClick={() => append({ name: '', level: 1 })}
>
  Add Skill
</button>
```

### 7. Using Controller for Complex Inputs

```tsx
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
```

## Key Concepts

1. **useForm**: Manages form state, validation, and submission
2. **useFieldArray**: Handles dynamic arrays of form fields
3. **register**: Connects form inputs to react-hook-form
4. **Controller**: For complex inputs or third-party components
5. **yupResolver**: Integrates yup validation with react-hook-form
6. **handleSubmit**: Processes form submission with validated data

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
