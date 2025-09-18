import { exec } from 'child_process';

/* === COG FUNCTIONS React Hook Form & Zod === */

/* installing dep if not already there */
export async function installingRhFZod() {
    const commands = ['npm install react-hook-form', 'npm install zod'];
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

/* generating 1 input */
function generateInputWithRhf(object) {
    let reactForm = '';
    if (object.label) {
        reactForm += `<label htmlFor="${object.name}">${object.label}</label>\n`;
    }
    reactForm += `<input id="${object.name}" name="${object.name}" type="${
        object.type || 'text'
    }" {...register("${object.name}")}
    `;

    //options
    if (object.placeholder) reactForm += `placeholder="${object.placeholder}"`;

    /*     const attributes = ['autofocus', 'readonly'];
    attributes.forEach((attr) => {
        if (object[attr] !== undefined) {
            reactForm += ` ${attr}`;
        }
    }); */

    //end
    reactForm += `/>\n
    {errors.${object.name} && (<p> {errors.${object.name}.message} </p> )}\n`;

    return reactForm;
}

/* generating 1 zod object */
function generateZodSchema(object) {
    let zodSchema = `${object.name}: z`;

    // base type
    if (object.type === 'string') zodSchema += '.string()';
    if (object.type === 'number') zodSchema += '.number()';
    if (object.type === 'boolean') zodSchema += '.boolean()';
    if (object.type === 'date') zodSchema += '.date()';
    if (object.type === 'array') zodSchema += '.array()';
    if (object.type === 'object') zodSchema += '.object()';
    if (object.type === 'enum') zodSchema += `.enum()`;
    if (object.type === 'any') zodSchema += '.any()';
    if (object.type === 'unknown') zodSchema += '.unknown()';
    if (object.type === 'null') zodSchema += '.null()';
    if (object.type === 'undefined') zodSchema += '.undefined()';

    // --- String-specific ---
    if (object.minLength) zodSchema += `.min(${object.minLength}, "too short")`;
    if (object.maxLength) zodSchema += `.max(${object.maxLength}, "too long")`;
    if (object.length) zodSchema += `.length(${object.length}, "must be exact length")`;
    if (object.email) zodSchema += `.email("invalid email")`;
    if (object.url) zodSchema += `.url("invalid url")`;
    if (object.uuid) zodSchema += `.uuid("invalid uuid")`;
    if (object.cuid) zodSchema += `.cuid("invalid cuid")`;
    if (object.regex) zodSchema += `.regex(${object.regex}, "pattern not matched")`;
    if (object.startsWith) zodSchema += `.startsWith("${object.startsWith}")`;
    if (object.endsWith) zodSchema += `.endsWith("${object.endsWith}")`;
    if (object.trim) zodSchema += `.trim()`;

    // --- Number-specific ---
    if (object.min) zodSchema += `.min(${object.min}, "too small")`;
    if (object.max) zodSchema += `.max(${object.max}, "too big")`;
    if (object.int) zodSchema += `.int()`;
    if (object.positive) zodSchema += `.positive()`;
    if (object.negative) zodSchema += `.negative()`;
    if (object.nonnegative) zodSchema += `.nonnegative()`;
    if (object.nonpositive) zodSchema += `.nonpositive()`;
    if (object.multipleOf) zodSchema += `.multipleOf(${object.multipleOf})`;

    // --- Array-specific ---
    if (object.minItems) zodSchema += `.min(${object.minItems}, "not enough items")`;
    if (object.maxItems) zodSchema += `.max(${object.maxItems}, "too many items")`;
    if (object.nonempty) zodSchema += `.nonempty("cannot be empty")`;

    // --- Date-specific ---
    if (object.minDate) zodSchema += `.min(new Date("${object.minDate}"), "too early")`;
    if (object.maxDate) zodSchema += `.max(new Date("${object.maxDate}"), "too late")`;

    // --- Common to all ---
    if (object.optional) zodSchema += `.optional()`;
    if (object.nullable) zodSchema += `.nullable()`;
    if (object.default) zodSchema += `.default(${JSON.stringify(object.default)})`;

    zodSchema += `,\n`;
    return zodSchema;
}

/* generating interface */
function generatingInterface(object) {
    let content = `${object.name}:`;

    switch (object.type) {
        case 'string':
            content += `string,\n`;
            break;
        case 'number':
            content += `number,\n`;
            break;
        case 'boolean':
            content += `boolean,\n`;
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
        case 'enum':
            content += `"",\n`;
            break;
        case 'any':
            content += `null,\n`;
            break;
        case 'unknown':
            content += `null,\n`;
            break;
        case 'null':
            content += `null,\n`;
            break;
        case 'undefined':
            content += `undefined,\n`;
            break;
        default:
            content += `"",\n`;
            break;
    }

    return content;
}

/* generating full form */
export function generatingRZForm(JSON_DATA) {
    let form = `import { zodResolver } from '@hookform/resolvers/zod'; \n
    import * as z from 'zod';\n
    import { useForm, type SubmitHandler } from 'react-hook-form';\n
    type ${JSON_DATA.title}Data = {\n`;

    JSON_DATA.fields.forEach((field) => {
        form += generatingInterface(field);
    });

    form += `};\n
    function ${JSON_DATA.title}(){\n
    const zodSchema = z.object({`;

    //yup schema
    JSON_DATA.fields.forEach((field) => {
        form += generateZodSchema(field);
    });

    form += `});\n
    const { register, handleSubmit, watch, formState: { errors } } = useForm<${JSON_DATA.title}Data>(resolver: zodResolver(zodSchema));\n
    const onSubmit = handleSubmit(data => console.log(data));\n
    return(\n<>\n
    <form onSubmit={onSubmit}>\n`;

    /* form */
    JSON_DATA.fields.forEach((field) => {
        form += generateInputWithRhf(field);
    });

    /* end */
    form += `</form>\n</>\n
    );
    }`;

    return form;
}
