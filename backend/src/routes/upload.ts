import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import { checkImageContent, checkMinFileSize, upload } from '../middlewares/file'

const uploadRouter = Router()
uploadRouter.post('/', checkMinFileSize, checkImageContent, upload.single('file'), uploadFile)

export default uploadRouter
