import { Router, Request, Response } from "express";

import { AppDataSource } from "../db/dataSource";
import { Comment } from "../db/entities/Comment";
import { Space } from "../db/entities/Space"
import authMiddleware from "../middlewares/authMiddleware";
import spaceAccessMW from "../middlewares/spaceAccessMW";

const router = Router();

// POST a comment
router.post('/comment', authMiddleware, spaceAccessMW, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const { space_id, content, parentComment, transaction } = req.body;

  if(!user_id || !space_id || !content || content.length === 0) {
    return res.status(400).json({ success: false, message: "Missing required data in the body" });
  };

  if((parentComment && transaction) || (!parentComment && !transaction)) {
    return res.status(400).json({ success: false, message: "Comments cannot have both a parent comment and a transaction, or neither."});
  }
  
  try {
    const space = await AppDataSource.manager.findOneBy(Space, space_id);

    if(!space) return res.status(404).json({ success: false, message: "Space does not exist" });

    const commentData: any = {
      space: { space_id: space_id },
      user: { user_id: user_id },
      content: content,
    };

    if (parentComment) {
      commentData.parentComment = { comment_id: parentComment };
    }

    if (transaction) {
      commentData.transaction = { transaction_id: transaction };
    }

    const newComment = AppDataSource.manager.create(Comment, commentData);
    await AppDataSource.manager.save(newComment);

    return res.status(201).json({ 
      success: true, 
      message: "Comment created successfully", 
      comment: newComment,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});


// Get a comment's info
router.get('/comment/:comment_id', authMiddleware, spaceAccessMW, async (req: Request, res: Response) => {
  const comment_id = parseInt(req.params.comment_id);

  if (isNaN(comment_id)) {
    return res.status(400).json({ success: false, message: 'Invalid space ID' });
  }

  try {
    const comment = await AppDataSource.manager.findOneBy(Comment, {
      comment_id
    });

    if (!comment) {
      return res.status(404).json({ success: true, message: "Comment does not exist" });
    }
        
    return res.status(200).json({ success: true, message: "Comment retrieved", comment, authInfo: req.jwt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// Delete a comment
router.delete('/comment/:comment_id', authMiddleware, async (req: Request, res: Response) => {
  const comment_id = parseInt(req.params.comment_id);

  if (isNaN(comment_id)) {
    return res.status(400).json({ success: false, message: 'Invalid space ID' });
  }

  try {
    const comment = await AppDataSource.manager.find(Comment, {
      relations: {
        user: true,
      },
      where: {
        comment_id,
        user: req.jwt.sub
      }
    })

    if (!comment) {
      return res.status(403).json({ success: false, message: "Comment not found or you are not the owner"});
    }

    const result = await AppDataSource.manager.delete(Comment, {
      comment_id
    });

    if (result.affected === 0) {
      return res.status(404).json({ success: true, message: "Comment does not exist" });
    }
        
    return res.status(200).json({ success: true, message: "Comment deleted", result, authInfo: req.jwt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
})

export default router;
