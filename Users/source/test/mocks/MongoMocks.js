import {UserMock} from './Fixtures';
import PromiseHandler from '../Promise';


const DuplicatedError = {
    "code": 11001
};

const findOne = (user) => {

    let [userEmail, userUsername] = user.$or;

    if(UserMock.email === userEmail.email || UserMock.username === userUsername.username ) {

        return {populate: () => PromiseHandler.resolver(UserMock)}
    }
    else {

        return {populate: () => PromiseHandler.resolver(null)}
    }
}

export default {findOne,DuplicatedError}
