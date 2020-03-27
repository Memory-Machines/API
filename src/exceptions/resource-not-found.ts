import HttpException from './http.exception';

class ResourceNotFound extends HttpException {
  public status = 404;
  public message = 'Resource Not Found';
  constructor(status: number, message: string) {
    super(status, message);
  }
}

export default ResourceNotFound;
