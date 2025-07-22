import { Router } from "express";
import { Request, Response } from "express";
import { login } from "src/controller/auth.controller";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "src/controller/product.controller";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "src/controller/categories.controller";

import verifyToken from "src/middleware/auth";

const router = Router();

router.get("/dashboard", (req: Request, res: Response) => {
  res.json({ message: "Bienvenido a la API de la tienda" });
});

router.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

router.post("/login", login);
router.get("/auth/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Productos
router.get("/products", verifyToken, getAllProducts);
function asyncHandler(fn: any) {
  return function (req: Request, res: Response, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post("/products", verifyToken, asyncHandler(createProduct));
router.put("/products/:id", verifyToken, asyncHandler(updateProduct));
router.delete("/products/:id", verifyToken, asyncHandler(deleteProduct));

// Categorías
router.get("/categories", verifyToken, getAllCategories);
router.post("/categories", verifyToken, asyncHandler(createCategory));
router.put("/categories/:id", verifyToken, asyncHandler(updateCategory));
router.delete("/categories/:id", verifyToken, asyncHandler(deleteCategory));

export default router;
