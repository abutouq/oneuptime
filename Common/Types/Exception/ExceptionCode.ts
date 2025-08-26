enum ExceptionCode {
  NotImplementedException = 0,
  GeneralException = 1,
  APIException = 2,
  DatabaseNotConnectedException = 500,
  BadOperationException = 5,
  WebRequestException = 6,
  BadDataException = 400,
  BadRequestException = 400,
  ForbiddenException = 403,
  UnabletoReachServerException = 415,
  ServerException = 500,
  NotAuthorizedException = 422,
  NotAuthenticatedException = 401,
  PaymentRequiredException = 402,
  NotFoundException = 404,
  TimeoutException = 408,
  TenantNotFoundException = 405,
  SsoAuthorizationException = 406,
}

export default ExceptionCode;
