import { Router, Request, Response } from 'express';

// import { AppDataSource } from '../tests/dataSourceTestLite';
import { AppDataSource } from "../db/dataSource";
import { Invitation } from "../db/entities/Invitation";
import { Space } from '../db/entities/Space';
import spaceAdminMW from '../middlewares/spaceAdminMW';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Get invitee's all invitations
router.get('/invitations', authMiddleware, async (req: Request, res: Response) => {
  const invitee_id = parseInt(req.jwt.sub);

  try {
    const invitations = await AppDataSource.manager.find(Invitation, {
      relations: {
        invitee: true,
        inviter: true,
        space: true
      },
      where: {
        invitee:
        { user_id: invitee_id },
      }
    });

    if (invitations.length === 0) {
      return res.status(404).json({ success: false, message: "No invitations found for this user" });
    }

    const transformedInvitations = invitations.map(invitation => ({
      invitation_id: invitation.invitation_id,
      status: invitation.status,
      space_id: invitation.space.space_id,
      invitee_id: invitation.invitee.user_id,
      inviter_id: invitation.inviter.user_id
    }));

    return res.status(200).json({ 
      success: true, 
      message: "Retrieved invitations successfully", 
      invitations: transformedInvitations,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
})

// Accept invitation
router.post('/invitation/:invitation_id/accept', authMiddleware, async (req: Request, res: Response) => {
  const invitation_id = parseInt(req.params.invitation_id, 10);
  const invitee_id = parseInt(req.jwt.sub);

  try {
    const invitation = await AppDataSource.manager.findOne(Invitation, {
      where: { invitation_id: invitation_id,
        invitee: {user_id: invitee_id}
       },
      relations: ['invitee', 'space']
    }) as Invitation;

    if (!invitation || invitation.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Invitation not found or already responded' });
    }

    invitation.status = 'accepted';

    const space = await AppDataSource.manager.findOne(Space, {
      where: { space_id: invitation.space.space_id },
      relations: ['users']
    }) as Space;

    console.log('Before:', space.users);
    space.users.push(invitation.invitee);
    await AppDataSource.manager.save(space);
    console.log('After:', space.users);

    await AppDataSource.manager.save(invitation);

    return res.status(200).json({ 
      success: true, 
      message: 'Invitation accepted',
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject invitation
router.post('/invitation/:invitation_id/reject', authMiddleware, async (req: Request, res: Response) => {
  const invitation_id = parseInt(req.params.invitation_id, 10);
  const invitee_id = parseInt(req.jwt.sub);

  try {
    const invitation = await AppDataSource.manager.findOneBy(Invitation, {
      invitation_id: invitation_id,
      invitee: { user_id: invitee_id }
    });

    if (!invitation || invitation.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Invitation not found or already responded' });
    }

    invitation.status = 'rejected';
    await AppDataSource.manager.save(invitation);

    return res.status(200).json({ 
      success: true, 
      message: 'Invitation rejected',
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// body { space_id: space_id }
// Remove an invitation
router.delete('/invitation/:invitation_id', authMiddleware, spaceAdminMW, async(req: Request, res: Response) => {
  const invitation_id = parseInt(req.params.invitation_id, 10);

  try {
    const invitation = await AppDataSource.manager.findOneBy(Invitation, {
      invitation_id: invitation_id,
    });

    if (!invitation) {
      return res.status(404).json({ success: false, message: "Invitation doesn't exist" })
    }

    await AppDataSource.manager.delete(Invitation, {invitation_id});

    return res.status(200).json({ 
      success: true, 
      message: 'Invitation removed successfully',
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;