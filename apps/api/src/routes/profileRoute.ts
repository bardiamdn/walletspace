import { Router, Request, Response } from "express";

import { AppDataSource } from "../db/dataSource"; // Actual database
// import { AppDataSource } from "../tests/dataSourceTestLite"; // For testing
import { Profile } from "../db/entities/Profile";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router()

// GET profile by user_id
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  try {
    const profile = await AppDataSource.manager.findOne(Profile, {
      where: { user: { user_id: user_id } },
      // No need to fetch related user info
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({
      success: true,
      message: "Profile data retrieved successfully",
      profile,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PATCH to update profile username by user_id
router.patch('/profile', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const { username } = req.body;
  try {
    const profile = await AppDataSource.manager.findOne(Profile, {
      where: { user: { user_id: user_id } },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.username = username as string;
    await AppDataSource.manager.save(profile);

    return res.status(200).json({ 
      success: true, 
      message: 'Username updated successfully',
      profile,
      authInfo: req.jwt
     });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;