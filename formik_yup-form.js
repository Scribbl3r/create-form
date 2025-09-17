import { exec } from 'child_process';

/* === COG FUNCTIONS FORMIK & YUP === */
/* do you want to build a snowman ? */

/* installing dep if not already there */
export async function installingFormikYup() {
    const commands = ['npm install -S yup', 'npm install formik --save'];
    for (let command of commands) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Output:\n${stdout}`);
        });
    }
}

/* generating full form */
export function generatingForm(JSON_DATA) {
    let form = `import { useFormik } from 'formik'; \n
    import * as Yup from 'yup';\n
    function ${JSON_DATA.title}(){\n
    const yupSchema = Yup.object().shape({`;

    //yup schema
    JSON_DATA.fields.forEach((field) => {
        form += generateYupSchema(field);
    });

    form += `})\n
    const { values, handleSubmit, handleChange, touched, errors } = useFormik({\n
        initialValues: {\n`;

    //initial values
    JSON_DATA.fields.forEach((field) => {
        form += generateInitValue(field);
    });

    form += `},\n
    validationSchema: yupSchema,\n
    onSubmit: (values) => {console.log(values)},\n
    });\n
    return(\n<>\n
    <form onSubmit={formik.handleSubmit}>\n`;

    /* form */
    JSON_DATA.fields.forEach((field) => {
        form += generateInputWithFormik(field);
    });

    /* end */
    form += `</form>\n</>\n
    );
    }`;

    return form;
}

/* generating 1 input */
function generateInputWithFormik(object) {
    let reactForm = '';
    if (object.label) {
        reactForm += `<label htmlFor="${object.name}">${object.label}</label>\n`;
    }
    reactForm += `<input id="${object.name}" name="${object.name}" type="${
        object.type || 'text'
    }" onChange={formik.handleChange} value={formik.values.${object.name}}
    `;

    //options
    if (object.placeholder) reactForm += `placeholder="${object.placeholder}"`;

    const attributes = ['autofocus', 'readonly'];
    attributes.forEach((attr) => {
        if (object[attr] !== undefined) {
            reactForm += ` ${attr}`;
        }
    });

    //end
    reactForm += `/>\n
    {touched.${object.name} && errors.${object.name} ? (<p> {errors.${object.name}} </p> ) : null}\n`;

    return reactForm;
}

/* generating 1 yup object */
function generateYupSchema(object) {
    let yupObject = `${object.name}: Yup`;

    //options
    if (object.type === 'string') yupObject += `.string("must be a string")`;
    if (object.type === 'number') yupObject += `.number("must be a number")`;
    if (object.type === 'boolean') yupObject += `.boolean("must be a boolean")`;
    if (object.type === 'date') yupObject += `.date("must be a date")`;
    if (object.type === 'array') yupObject += `.array("must be an array")`;
    if (object.type === 'object') yupObject += `.object("must be an object")`;
    if (object.type === 'mixed') yupObject += `.mixed("must be mixed")`;

    //string
    if (object.minLength) yupObject += `.min(${object.minLength}, "too short")`;
    if (object.maxLength) yupObject += `.max(${object.maxLength}, "too long")`;
    if (object.length) yupObject += `.length(${object.length}, "must be ${object.length} chars")`;
    if (object.email) yupObject += `.email("must be an email")`;
    if (object.url) yupObject += `.url("must be a valid URL")`;
    if (object.uuid) yupObject += `.uuid("must be a UUID")`;
    if (object.matches) yupObject += `.matches(${object.matches}, "pattern not matched")`;
    if (object.trim) yupObject += `.trim()`;
    if (object.lowercase) yupObject += `.lowercase()`;
    if (object.uppercase) yupObject += `.uppercase()`;

    //number
    if (object.min) yupObject += `.min(${object.min}, "must be >= ${object.min}")`;
    if (object.max) yupObject += `.max(${object.max}, "must be <= ${object.max}")`;
    if (object.lessThan)
        yupObject += `.lessThan(${object.lessThan}, "must be < ${object.lessThan}")`;
    if (object.moreThan)
        yupObject += `.moreThan(${object.moreThan}, "must be > ${object.moreThan}")`;
    if (object.positive) yupObject += `.positive()`;
    if (object.negative) yupObject += `.negative()`;
    if (object.integer) yupObject += `.integer()`;

    //boolean
    if (object.oneOfTrue) yupObject += `.oneOf([true], "must be true")`;

    //date
    if (object.minDate) yupObject += `.min(new Date("${object.minDate}"), "too early")`;
    if (object.maxDate) yupObject += `.max(new Date("${object.maxDate}"), "too late")`;

    //array
    if (object.minItems)
        yupObject += `.min(${object.minItems}, "at least ${object.minItems} items")`;
    if (object.maxItems)
        yupObject += `.max(${object.maxItems}, "at most ${object.maxItems} items")`;
    if (object.length) yupObject += `.length(${object.length}, "must have ${object.length} items")`;
    if (object.of) yupObject += `.of(${generateYupSchema(object.of)})`; // sous-schéma
    if (object.ensure) yupObject += `.ensure()`;

    //mixed
    if (object.required) yupObject += `.required("cannot be empty")`;
    if (object.nullable) yupObject += `.nullable()`;
    if (object.defined) yupObject += `.defined()`;
    if (object.notOneOf)
        yupObject += `.notOneOf(${JSON.stringify(object.notOneOf)}, "invalid value")`;
    if (object.oneOf)
        yupObject += `.oneOf(${JSON.stringify(object.oneOf)}, "must match one of allowed values")`;
    if (object.default) yupObject += `.default(${JSON.stringify(object.default)})`;

    yupObject += `,\n`;

    return yupObject;
}

/* generating initial values */
function generateInitValue(object) {
    let content = `${object.name}:`;

    switch (object.type) {
        case 'string':
            content += `"",\n`;
            break;
        case 'number':
            content += `0,\n`;
            break;
        case 'boolean':
            content += `false,\n`;
            break;
        case 'array':
            content += `[],\n`;
            break;
        case 'object':
            content += `{},\n`;
            break;
        case 'date':
            content += `new Date(),\n`;
            break;
        case 'mixed':
            content += `null,\n`;
            break;
        default:
            content += `"",\n`;
            break;
    }

    return content;
}
