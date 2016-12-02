import bcrypt from 'bcrypt'

const validateUpdateField = (data) => {
    let {field,value} = data;

    if (['email', 'password', 'address'].includes(field)) {
        if (!value || value === '') {
            return false;
        }

        if (field === 'password') {
            data.value = bcrypt.hashSync(value, 10);
        }


        data.fieldData = function() {
            return field;
        };

        return true;

    } else {

        return false;
    }
    // return true;
};

export default {validateUpdateField}
