import centralLogger from '../config/central-logger';

const setErrorLogger = (Component) => {
    for (const property in Component) {
        Component[property].retry({
            afterCall: errorLogger
        })
    }
}

const errorLogger = (options) => {

    if (options.status === 'ERROR') {
        const {message,name,statusCode} = options.error;

        const body = {
            origin: options.service,
            message,
            name,
            status: !!statusCode ? statusCode : 500
        }
        centralLogger.error(JSON.stringify(body))
    }
}

export default {setErrorLogger};
