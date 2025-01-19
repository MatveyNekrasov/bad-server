import { Request, Express, NextFunction, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import BadRequestError from '../errors/bad-request-error'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const MIN_FILE_SIZE = 2 * 1024; // 2 KB

const ensureDirectoryExists = (directory: string) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const uploadPath = process.env.UPLOAD_PATH_TEMP
            ? `../public/${process.env.UPLOAD_PATH_TEMP}`
            : '../public'
        const fullPath = join(__dirname, uploadPath)
        ensureDirectoryExists(fullPath)
        cb(null, fullPath)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'))
    }

    return cb(null, true)
}

export const checkMinFileSize = (req: Request, _res: Response, next: NextFunction) => {
    if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) < MIN_FILE_SIZE) {
        return next(new BadRequestError('File size is too small'));
    }
    next();
};

const limits = {
    fileSize: 10 * 1024 * 1024,
}

export const upload = multer({ storage, fileFilter, limits })
