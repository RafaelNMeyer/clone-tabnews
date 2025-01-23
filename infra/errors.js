export class InternalServerError extends Error {
  constructor({ cause, status_code }) {
    super("Unexpected internal error occurred", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact support";
    this.status_code = status_code || 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service currently unavailable", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verify if service is available";
    this.status_code = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor({ cause }) {
    super("Method not allowed for this endopoint.", {
      cause,
    });
    this.name = "MethodNotAllowedError";
    this.action = "Verify if http method is validy for this endpoint.";
    this.status_code = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}
