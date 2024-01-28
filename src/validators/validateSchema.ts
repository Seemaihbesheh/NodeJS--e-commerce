export default function validateData(model, validationSchema, options = { abortEarly: false }) {
    return (instance, options) => {
        const { error, value } = validationSchema.validate(instance.dataValues, options);

        if (error) {
            throw new Error(`Validation error: ${error.details.map((d) => d.message).join(', ')}`);
        }

        return value;
    };
}