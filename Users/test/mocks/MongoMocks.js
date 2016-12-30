import {UserMock} from './Fixtures';
import PromiseHandler from '../Promise';


const DuplicatedError = {
    "code": 11001
};

const findOne = (user) => {
// console.log(user);
    let [userEmail, userUsername] = user.$or;

    if(UserMock.email === userEmail.email || UserMock.username === userUsername.username ) {

        return PromiseHandler.resolver(UserMock)
    }
    else {

        return PromiseHandler.resolver(null)
    }
}

export default {findOne,DuplicatedError}
