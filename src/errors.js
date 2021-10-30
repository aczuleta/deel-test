class BaseError extends Error {
    constructor(code = 500, message = 'Internal server error') {
        super(message);
        this.code = code;
    }
}


class NotBelongError extends BaseError {
    constructor() {
        super(401, 'Unauthorized: The requested resource cannot be accesed');
    }
}

class BadRequestError extends BaseError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

class InsuficientFundsError extends BaseError {
    constructor() {
        super(400, 'The user does not have enough funds to complete the payment');
    }
}

class PaidJobError extends BaseError {
    constructor() {
        super(400, 'This contract has already been payed');
    }
}

class NotActiveError extends BaseError {
    constructor() {
        super(400, 'The contract is not currently active');
    }
}

class NotFoundError extends BaseError {
    constructor() {
        super(404, 'The requested resource was not found');
    }
}


class UnauthorizedError extends BaseError {
    constructor() {
        super(401, 'unauthorized');
    }
}

class DepositLimitError extends BaseError {
    constructor() {
        super(400, 'Deposit cannot be above 25% of total of jobs to pay');
    }
}

class InvalidUserError extends BaseError{
    constructor(message = 'Invalid user') {
        super(400, message);
    }
}


module.exports = {
    BaseError,
    NotBelongError,
    UnauthorizedError,
    InsuficientFundsError,
    PaidJobError,
    NotActiveError,
    BadRequestError,
    NotFoundError,
    DepositLimitError,
    InvalidUserError
}