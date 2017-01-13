import PromiseHandler from '../Promise';

const UnhandledError = new Error();
const promise = {status:'resolveIt'};

const StudioModule = function (serviceName) {

    return function (serviceCall) {
        // console.log(promise);
        if(promise.status === 'resolveIt') return PromiseHandler.resolver(true);
        if(promise.status === 'rejectIt') return PromiseHandler.rejecter(true);
    };
};

export default {UnhandledError,StudioModule,promise};
