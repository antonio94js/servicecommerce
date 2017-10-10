import PromiseHandler from '../Promise';
const UnhandledError = new Error();

const StudioModule = function (serviceName = null) {

    return function (serviceMethod) {
        return PromiseHandler.resolver(!serviceName ? true : serviceName);
    };
};

export default {UnhandledError,StudioModule};
