import PromiseHandler from '../Promise';
const UnhandledError = new Error();

const StudioModule = function (serviceName) {

    return function (serviceCall) {
        return PromiseHandler.resolver(true);
    };
};

export default {UnhandledError,StudioModule};
