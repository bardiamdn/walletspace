import { Router, Request, Response } from "express";

import { AppDataSource } from "../db/dataSource"; // Actual database
// import { AppDataSource } from "../tests/dataSourceTestLite"; // For testing
import { Space } from "../db/entities/Space";
import { Invitation } from "../db/entities/Invitation";
import { User } from "../db/entities/User";
import { Comment } from "../db/entities/Comment";
import authMiddleware from "../middlewares/authMiddleware";
import spaceAdminMW from "../middlewares/spaceAdminMW";
import spaceAccessMW from "../middlewares/spaceAccessMW";
import { Transaction } from "../db/entities/Transaction";

const router = Router();


// POST space - create a new space
router.post('/space', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const { space_name } = req.body;
  
  if (!user_id || !space_name ) {
    return res.status(400).json({ success: false, message: 'Invalid user ID or missing space name' });
  }

  try {
    const space = await AppDataSource.manager.findOneBy(Space, {
        users: { user_id: user_id },
        space_name: space_name
    }) as Space;
    
    if(space) {
      return res.status(409).json({ success: false, message: "Space name already exists, try another name"});
    }
    const newSpace = AppDataSource.manager.create(Space, {
      users: [{ user_id: user_id }],
      space_name,
      admin: { user_id: user_id },
      // User shouldn't be added on space creation
      // users: users ? [ ...users.map((userId: number) => ({ user_id: userId })), { user_id: user_id } ] : [{ user_id: user_id }]
    });

    await AppDataSource.manager.save(newSpace);
    return res.status(201).json({ 
      success: true, 
      message: 'Space created successfully', 
      space: newSpace,
      authInfo: req.jwt
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET all spaces of a user
router.get('/spaces', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);

    
  if (!user_id) {
    return res.status(400).json({ succcess: false, message: "Missing data" });
  };
  
  try {
    const spaces = await AppDataSource.manager.find(Space, {
      where: {
         users: {
           user_id: user_id 
         }
      }
    }) as Space[];
    
    return res.status(200).json({ 
      success: true, 
      message: "Data retrieved successfully", 
      spaces: spaces,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET space info
router.get('/space/:space_id/info', authMiddleware, spaceAccessMW, async (req: Request, res: Response) => {
  
  try {
    const transformedUsers = req.spaceInfo.users.map((user: User) => ({ user_id: user.user_id }));

    return res.status(200).json({ 
      success: true,
      message: "Data retrieved successfully",
      space: {
        ...req.spaceInfo,
        users: transformedUsers
      },
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// PATCH space - update a space
router.patch('/space/:space_id', authMiddleware, spaceAdminMW,  async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const space_id = parseInt(req.params.space_id);
  const { space_name } = req.body;
  
  if (!user_id || !space_id || !space_name) {
    return res.status(400).json({ succcess: false, message: "Missing data" });
  };
  
  try {
    const space = await AppDataSource.manager.findOneBy(Space, {
      admin: { user_id: user_id},
      space_id: space_id
    });

    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found' });
    }

    if (space_name !== undefined) {
      const existingSpaceName = await AppDataSource.manager.findOne(Space, {
        where: { space_name: space_name, admin: { user_id: user_id } }
      });

      if (existingSpaceName) {
        return res.status(409).json({ success: false, message: 'Space name exists, try another name' });
      }

      space.space_name = space_name;
    }

    const updatedSpace = await AppDataSource.manager.save(space);

    return res.status(200).json({ 
      success: true, 
      message: 'Space updated successfully', 
      space: updatedSpace,
      authInfo: req.jwt
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});


// POST a new invitation - add a new invitation
router.post('/space/:space_id/invite', authMiddleware, spaceAdminMW, async (req:Request, res: Response) => {
  const inviter_id = parseInt(req.jwt.sub);
  const space_id = parseInt(req.params.space_id);
  const { invitee_id } = req.body;

  if (!space_id || !inviter_id || !invitee_id) {
    return res.status(400).json({ succcess: false, message: "Missing data" });
  };

  try {
    // Space and user existance are validated in the spaceAdmin middleware
    const invitee = await AppDataSource.manager.findOneBy(User, {user_id: invitee_id});

    if (!invitee) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingInvitation = await AppDataSource.manager.findOne(Invitation, {
      relations:{
        space: true,
        inviter: true,
        invitee: true
      },
      where: {
        space:{
          space_id: space_id,
        },
        inviter: {
          user_id: inviter_id
        },
        invitee: {
          user_id: invitee_id
        }
      }
    });
    if (existingInvitation) {
      return res.status(409).json({ success: false, message: "Invitation already sent"})
    }

    const newInvitation = AppDataSource.manager.create(Invitation, {
      space: { space_id: space_id },
      inviter: { user_id: inviter_id },
      invitee: { user_id: invitee_id},
      status: 'pending'
    });

    await AppDataSource.manager.save(newInvitation);

    return res.status(200).json({ 
      success: true, 
      message: "Invitaion created successfully",
      authInfo: req.jwt
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  };
});


// Get latest space data
router.get('/space/:space_id', authMiddleware, async (req: Request, res: Response) => {
  const space_id = parseInt(req.params.space_id);
  const limit = parseInt(req.query.limit as string) || 25; 
  const offset = parseInt(req.query.offset as string) || 0;


  if (isNaN(space_id)) {
    return res.status(400).json({ success: false, message: 'Invalid space ID' });
  }

  try {
    const space = await AppDataSource
      .getRepository(Space)
      .createQueryBuilder("space")
      .leftJoinAndSelect("space.users", "user")
      .where("space.space_id = :space_id", { space_id })
      .andWhere("user.user_id = :user_id", { user_id: req.jwt.sub })
      .getOne();

    if (!space) {
      return res.status(404).json({ success: false, message: "User not found in the space" });
    }

    // Only include user IDs
    const userIds = space.users.map(user => ({ user_id: user.user_id }));

    // Fetch paginated transactions
    const [transactions, totalTransactions] = await AppDataSource.manager.findAndCount(Transaction, {
      where: { space: { space_id } },
      take: limit,
      skip: offset
    });

    // Fetch paginated comments
    const [comments, totalComments] = await AppDataSource.manager.findAndCount(Comment, {
      where: { space: { space_id } },
      take: limit,
      skip: offset
    });

    return res.status(200).json({ 
      success: true, 
      message: "Space data retrieved", 
      space: {
        ...space,
        users: userIds,
        transactions,
        totalTransactions,
        comments,
        totalComments,
      },
      limit, // Number of items returned
      offset, // Offset used for this query
      authInfo: req.jwt 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
})


// GET all comments of a space
router.get('/space/:space_id/comments', authMiddleware, spaceAccessMW, async (req: Request, res: Response) => {
  const space_id = parseInt(req.params.space_id);
  // TODO: Add Inifinite scrolling and pagination

  if (isNaN(space_id)) {
    return res.status(400).json({ success: false, message: 'Invalid space ID' });
  }

  try {
    const comments = await AppDataSource.manager.findBy(Comment, {
      space: { space_id }
    });

    if (comments.length === 0) {
      return res.status(404).json({ success: true, message: "There is no comment" });
    }
        
    return res.status(200).json({ 
      success: true, 
      message: "Comments retrieved", 
      comments, 
      authInfo: req.jwt 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});


// GET all transactions of a space
router.get('/space/:space_id/transactions', authMiddleware, spaceAccessMW, async (req: Request, res: Response) => {
  const space_id = parseInt(req.params.space_id);
  // TODO: Add Inifinite scrolling and pagination to the query

  if (isNaN(space_id)) {
    return res.status(400).json({ success: false, message: 'Invalid space ID' });
  }

  try {
    const transactions = await AppDataSource.manager.findBy(Transaction, {
      space: { space_id }
    });

    if (transactions.length === 0) {
      return res.status(404).json({ success: true, message: "There is no transaction" });
    }
        
    return res.status(200).json({ 
      success: true, 
      message: "Transactions retrieved", 
      transactions, 
      authInfo: req.jwt 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});


// DELETE a space
router.delete('/space/:space_id', authMiddleware, spaceAdminMW, async (req: Request, res: Response) => {
  const space_id = parseInt(req.params.space_id);
  
  try {
    // Ownership is checked in the spaceAdmin middleware
    await AppDataSource.manager.delete(Space, space_id);
    console.log(req.spaceInfo)

    return res.status(200).json({ 
      success: true, 
      message: 'Space deleted successfully', 
      deletedSpace: req.spaceInfo,
      // {
      //   space_id: req.spaceInfo.space_id,
      //   space_name: req.spaceInfo.space_name,
      //   admin: req.spaceInfo.admin.user_id,
      //   users: req.spaceInfo.users,
      // },
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

export default router