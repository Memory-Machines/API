import { Router } from 'express';

import { FileController } from '../controllers';
import { handleValidation, FileValidator } from '../validators';
import { authenticateApi, authorizeApi } from '../middlewares';

const FileRouter = Router();

FileRouter.route('/upload').post(
  authenticateApi(),
  authorizeApi([]),
  handleValidation(FileValidator.upload),
  FileController.uploadFile
);

export default FileRouter;
