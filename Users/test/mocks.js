const UserCreated = {
    "firstname": 'PAPI RICO',
    "lastname": 'Commerce',
    "password": '$2a$10$mZ4Wf8h.M/g0zbSJLdV8KuX9tWaA2r3xStXavtLGlpRUVJnBq3fKW',
    "email": 'servi@gmail.com',
    "id": '2697bd30-1fbd-4d79-8cc5-26e052141235'
}

const DuplicatedError = {
    "code": 11001,
    "value":"asdfas"
};



const UnhandledError = new Error();

const StudioModule = function (serviceName) {
    // console.log("Mi nombre de servicio es " + serviceName);
    return function (serviceCall) {
        // console.log("Mi valor de llamada es " + serviceCall);
    }
}


export default {
    UserCreated, DuplicatedError,UnhandledError,StudioModule
};
