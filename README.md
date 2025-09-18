# JSON Form Generator

This Node.js script generates an HTML form from a JSON file.

## Installation
```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

Make sure Node.js (v14+) is installed.

## Usage
`node index.js [options]`

## Options
```bash
--json <path> : path to the folder containing the JSON file.
--file <name> : name of the JSON file (without the .json extension).
--y : indicates that you are already in the project's root directory.
--FY : generate a form with Formik & Yup
--RZ : generate a form with React Hook Form & Zod
```


## Exemple
### Supported attributes
| Attribute     | Type    | Description                                                    |
| ------------- | ------- | -------------------------------------------------------------- |
| `name`        | string  | Input name (required).                                         |
| `label`       | string  | Label displayed for the input.                                 |
| `type`        | string  | Input type (`text`, `email`, `number`, etc.). Default: `text`. |
| `placeholder` | string  | Placeholder text inside the input.                             |
| `minLength`   | number  | Minimum length for text inputs.                                |
| `maxLength`   | number  | Maximum length for text inputs.                                |
| `size`        | number  | Visual size of the input.                                      |
| `min`         | number  | Minimum value for numeric inputs.                              |
| `max`         | number  | Maximum value for numeric inputs.                              |
| `step`        | number  | Increment step for numeric inputs.                             |
| `required`    | boolean | Field is required.                                             |
| `autofocus`   | boolean | Puts focus on this field when the page loads.                  |
| `disabled`    | boolean | Disables the input field.                                      |
| `readonly`    | boolean | Makes the field read-only.                                     |


### supported Yup attributes
| Type        | Supported Attributes                                                                                    | Example                                      |
| ----------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **string**  | `min`, `max`, `length`, `email`, `url`, `uuid`, `matches`, `trim`, `lowercase`, `uppercase`, `required` | `yup.string().min(3).required()`             |
| **number**  | `min`, `max`, `lessThan`, `moreThan`, `positive`, `negative`, `integer`, `required`                     | `yup.number().min(0).max(100)`               |
| **boolean** | `oneOf`, `required`                                                                                     | `yup.boolean().oneOf([true])`                |
| **date**    | `min`, `max`, `required`                                                                                | `yup.date().min(new Date("2020-01-01"))`     |
| **array**   | `min`, `max`, `length`, `of`, `ensure`, `required`                                                      | `yup.array().of(yup.string()).min(2)`        |
| **object**  | `shape`, `required`                                                                                     | `yup.object().shape({ name: yup.string() })` |
| **mixed**   | `required`, `nullable`, `defined`, `notOneOf`, `oneOf`, `default`                                       | `\`yup.mixed().n`                            |

### supported Zod attributes
| Type          | Supported attributes                                                                                                                             | Example                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **string**    | `minLength`, `maxLength`, `length`, `email`, `url`, `uuid`, `cuid`, `regex`, `startsWith`, `endsWith`, `trim`, `optional`, `nullable`, `default` | `z.string().min(3, "too short").email("invalid email").optional()` |
| **number**    | `min`, `max`, `int`, `positive`, `negative`, `nonnegative`, `nonpositive`, `multipleOf`, `optional`, `nullable`, `default`                       | `z.number().min(18, "too small").max(99, "too big").int()`         |
| **boolean**   | `optional`, `nullable`, `default`                                                                                                                | `z.boolean().default(false)`                                       |
| **date**      | `minDate`, `maxDate`, `optional`, `nullable`, `default`                                                                                          | `z.date().min(new Date("2000-01-01"), "too early")`                |
| **array**     | `minItems`, `maxItems`, `nonempty`, `optional`, `nullable`, `default`                                                                            | `z.array(z.string()).min(2, "not enough items")`                   |
| **object**    | `optional`, `nullable`, `default`                                                                                                                | `z.object({ name: z.string(), age: z.number() })`                  |
| **enum**      | must provide explicit values, `optional`, `nullable`, `default`                                                                                  | `z.enum(["red", "green", "blue"])`                                 |
| **any**       | `optional`, `nullable`, `default`                                                                                                                | `z.any().optional()`                                               |
| **unknown**   | `optional`, `nullable`, `default`                                                                                                                | `z.unknown().nullable()`                                           |
| **null**      | base only                                                                                                                                        | `z.null()`                                                         |
| **undefined** | base only                                                                                                                                        | `z.undefined()`                                                    |


Note: Not all Yup & zod attributes are currently implemented in the generator. If you need more, feel free to extend the generateYupSchema() function.

### example json for html only
```json
{
  "title": "contactForm",
  "fields": [
    { "name": "email", "label": "Email", "type": "email", "required": true },
    { "name": "message", "label": "Message", "type": "text", "placeholder": "Your message..." }
  ]
}
```

### example json for Formik & yup
```json
{
  "title": "LoginForm",
  "fields": [
    {
      "name": "email",
      "label": "Email",
      "type": "string",
      "placeholder": "Votre email",
      "required": true,
      "email": true
    },
    {
      "name": "password",
      "label": "Mot de passe",
      "type": "string",
      "placeholder": "Votre mot de passe",
      "required": true,
      "minLength": 6
    }
  ]
}
```

### example json for RHF & zod :
```json
{
  "title": "UserForm",
  "fields": [
    {
      "name": "email",
      "label": "Email Address",
      "type": "string",
      "placeholder": "Enter your email",
      "required": true,
      "email": true
    },
    {
      "name": "password",
      "label": "Password",
      "type": "string",
      "placeholder": "Enter your password",
      "required": true,
      "minLength": 6
    }]
}
```

## Command :
```bash
# Génération en HTML simple
node index.js --json ./data --file login  

# Génération en React (Formik + Yup)
node index.js --json ./data --file login --FY

# Génération en React (RHF + Zod)
node index.js --json ./data --file login --RZ  
```

## Result
### Generated file:
  ./contactForm.html if HTML
  ./contactForm.tsx if (Formik &  Yup) or (React hook form & Zod) 
  
```html
<Form>
  <label for="email">Email</label>
  <input name="email" type="email" required/>
  <label for="message">Message</label>
  <input name="message" type="text" placeholder="Your message..."/>
</Form>
```

## How it works
- The script asks for the root directory if `--y` is not provided.
- It searches for the JSON file in the specified path, or asks the user where to find it.
- Parses the JSON and generates an HTML form.
- Creates an HTML file in the root directory.

⚠️ If the JSON file doesn't exist, the script will prompt the user again for its location.
The user can interrupt the script at any time with Ctrl+C.
