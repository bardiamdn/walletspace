import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import { AppDataSource } from "../db/dataSource"; // Actual database
// import { AppDataSource } from "../tests/dataSourceTestLite"; // For testing
import { User } from "../db/entities/User";
import { Category } from "../db/entities/Category";
import authMiddleware from "../middlewares/authMiddleware";

dotenv.config()

const router = Router();


// POST category - create a new category
router.post('/category', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const { category_name, category_type, category_color } = req.body;
  
  if (isNaN(user_id) || !category_name || !category_type) {
    return res.status(400).json({ success: false, message: 'Invalid user ID or missing category info' });
  }

  try {
    const category = await AppDataSource.manager.findOneBy(Category, { 
      user: { user_id: user_id }, 
      category_name: category_name
    }) as Category;
    
    if(category) {
      return res.status(409).json({ success: false, message: "Category name already exists, try another name"});
    }
    const newCategory = AppDataSource.manager.create(Category, {
      user: { user_id: user_id},
      category_name,
      category_type: category_type || 'expense',
      category_color: category_color || process.env.BASE_COLOR,
    });

    await AppDataSource.manager.save(newCategory);
    return res.status(201).json({ 
      success: true, 
      message: 'Category created successfully', 
      category: {
        category_id: newCategory.category_id,
        category_name: newCategory.category_name,
        category_type: newCategory.category_type,
        category_color: newCategory.category_color,
        created_at: newCategory.created_at,
        last_updated: newCategory.last_updated
      },
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET all categories of a user
router.get('/categories', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  
  try {
    const categories = await AppDataSource.manager.findBy(Category, { user: { user_id: user_id } }) as Category[];
    
    return res.status(200).json({ 
      success: true,
      message: "Category data retrieved successfully",
      categories: categories,
      authInfo: req.jwt 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// GET category info
router.get('/category/:category_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const category_id = parseInt(req.params.category_id, 10);
  
  try {
    const category = await AppDataSource.manager.findOneBy(Category, {
      user: { user_id: user_id}, // Check the ownership
      category_id: category_id
    }) as Category;

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      category: category,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// PATCH category - update a category
router.patch('/category/:category_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const category_id = parseInt(req.params.category_id, 10);
  const { category_name, category_type, category_color } = req.body;
  
  try {
    const category = await AppDataSource.manager.findOneBy(Category, {
      user: { user_id: user_id}, // Again, check the ownership
      category_id: category_id
    }) as Category;

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category_name !== undefined) {
      const existingCategoryName = await AppDataSource.manager.findOneBy(Category, {
        user: { user_id: user_id},
        category_name: category_name
      }) as Category;
      if (!existingCategoryName){
        category.category_name = category_name;
      } else {
        return res.status(409).json({ success: false, message: 'Category name exists, try another name'})
      }
    }
    if (category_type === ('expense' || 'income' || 'transfer')) {
      category.category_type = category_type;
    }
    if (category_color !== undefined) {
      category.category_color = category_color;
    }

    const updatedCategory = await AppDataSource.manager.save(category);

    return res.status(200).json({ 
      success: true, 
      message: 'Category updated successfully', 
      category: updatedCategory,
      authInfo: req.jwt
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

// // DELETE a category
router.delete('/category/:category_id', authMiddleware, async (req: Request, res: Response) => {
  const user_id = parseInt(req.jwt.sub);
  const category_id = parseInt(req.params.category_id, 10);
  
  try {
    const category = await AppDataSource.manager.findOneBy(Category, {
      user: { user_id: user_id }, 
      category_id: category_id
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await AppDataSource.manager.delete(Category, category_id);

    return res.status(200).json({ 
      success: true, 
      message: 'Category deleted successfully', 
      deletedCategory: category,
      authInfo: req.jwt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error'})
  }
});

export default router