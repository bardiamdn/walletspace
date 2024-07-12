import { Request, Response, NextFunction } from 'express';
import { Space } from '../db/entities/Space';
import { AppDataSource } from '../db/dataSource';

export default async function spaceAdminMW(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const space_id = parseInt(req.params.space_id ?? req.body.space_id, 10);
  const user_id = parseInt(req.jwt.sub);

  try {
    if(!space_id || !user_id) {
      return res.status(400).json({ success: false, message: "Can't find space_id or user_id" });
    }

    const space = await AppDataSource.manager.findOne(Space, {
      where: {
        space_id: space_id ,
        admin: { user_id: user_id }
      }
    });

    if (!space) {
      return res.status(404).json({ success: false, message: "Space not found or you are not admin" });
    }
    
    // if (space.admin.user_id === user_id) {
      req.spaceInfo = space;
      // req.jwt = req.jwt;
      return next();
    // }

    return res.status(403).json({ success: false, message: "Sorry, only admin can visit this route "});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error"});
  };
};