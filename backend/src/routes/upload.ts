import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import { checkMinFileSize, upload } from '../middlewares/file'

const uploadRouter = Router()
uploadRouter.post('/', checkMinFileSize, upload.single('file'), uploadFile)

export default uploadRouter
