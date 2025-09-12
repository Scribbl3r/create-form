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



```json
{
  "title": "contactForm",
  "fields": [
    { "name": "email", "label": "Email", "type": "email", "required": true },
    { "name": "message", "label": "Message", "type": "text", "placeholder": "Your message..." }
  ]
}
```

## Command :
`node index.js --json ./json --file form`

## Result

### Generated file: ./contactForm.html : ./contactForm.html
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
