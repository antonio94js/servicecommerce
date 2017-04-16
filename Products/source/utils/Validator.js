import moment from 'moment';

const dateValidator = date => { console.log(date); console.log(moment(date).isValid()); return true };

export default {dateValidator};
