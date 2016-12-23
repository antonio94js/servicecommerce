import {UserMock} from './Fixtures';
import PromiseHandler from '../Promise';


const DuplicatedError = {
    "code": 11001
};

const findOne = (user) => {

    if(UserMock.email === user.email) {

        return PromiseHandler.resolver(UserMock)
    }
    else {

        return PromiseHandler.resolver(null)
    }
}

export default {findOne,DuplicatedError}
