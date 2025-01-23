import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError({});
  console.error(publicError);
  response.status(publicError.status_code).json(publicError);
}

function onErrorHandler(err, request, response) {
  const publicError = new InternalServerError({
    cause: err,
    status_code: err.status_code,
  });
  console.error(publicError);
  response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
