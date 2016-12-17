class ErrorHandler extends Error {

    constructor(name,message,statusCode) {
        super()
        this.message = message;
        this.statusCode = statusCode;
        this.name = name;
    }
}

export default ErrorHandler;
