import { Router, Request, Response } from "express";

// Change to AppDataSourceTest on test runs
import { AppDataSource } from "../db/dataSource"; // Actual database
import { AppDataSourceTest } from "../tests/dataSourceTestLite"; // For testing
import { Profile } from "../db/entities/Profile";

const router = Router()

// GET profile by user_id
router.get('/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  try {
    const profile = await AppDataSource.manager.findOne(Profile, {
      where: { user: { user_id: user_id } },
      // No need to fetch related user info
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT to update profile username by user_id
router.put('/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { username } = req.query;
  try {
    const profile = await AppDataSource.manager.findOne(Profile, {
      where: { user: { user_id: user_id } },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.username = username as string;
    await AppDataSource.manager.save(profile);

    return res.status(200).json({ success: true, message: 'Username updated successfully' });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// No need for a create (POST) route, since profile is automatically created on register
// No need for a delete route

export default router;