class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors = [],
        statck = "",

    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        this.message = message;

        if(statck){
            this.stack = statck;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}