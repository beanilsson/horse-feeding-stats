const check = (error) => {
    if (error.errors.name.kind === 'unique') {
        return true;
    } else {
        return false;
    }
};

const createMessage = (model, error) => {
    return 'Det finns redan en ' + model + ' med namnet ' + error.errors.name.value + '. Var god välj ett annat namn.';
};

module.exports.check = check;
module.exports.createMessage = createMessage;
