import * as jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.header('x-access-token');

    if (!accessToken){
        return res.status(403).send('No access token provided.');
    }

    try{
        jwt.verify(accessToken, <string>process.env.JWT_SECRET);
        next();
    }
    catch(exception){
        return res.status(401).send('Unauthorized.');
    }
}

module.exports = {
    verifyToken: verifyToken
};