// src/controllers/products.ts
import { Request, Response } from "express";
import { db } from "../db/connection";
import { products, categories } from "../db/schema";
import { eq, and, not } from "drizzle-orm";

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Crear producto con validación por categoría
export const createProduct = async (req: Request, res: Response) => {
  const { name, price, category_id } = req.body;

  if (!name || price == null || category_id == null) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Validar que la categoría exista
    const catExist = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(category_id)));
    if (catExist.length === 0) {
      return res.status(400).json({ message: "Categoría no válida" });
    }

    // Validar que no exista otro producto con el mismo nombre en la misma categoría
    const existingProduct = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.name, name.trim()),
          eq(products.category_id, Number(category_id))
        )
      );

    if (existingProduct.length > 0) {
      return res.status(400).json({
        message: "Ya existe un producto con ese nombre en esta categoría",
      });
    }

    const result = await db.insert(products).values({
      name: name.trim(),
      price,
      category_id: Number(category_id),
    });

    res.status(201).json({ message: "Producto creado", result });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

// Actualizar producto con validación por categoría
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, category_id } = req.body;

  if (!name || price == null || category_id == null) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Validar que la categoría exista
    const catExist = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(category_id)));
    if (catExist.length === 0) {
      return res.status(400).json({ message: "Categoría no válida" });
    }

    // Validar que no exista otro producto con el mismo nombre en la misma categoría (excluyendo el actual)
    const existingProduct = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.name, name.trim()),
          eq(products.category_id, Number(category_id)),
          // Aquí excluimos el producto que estamos actualizando
          not(eq(products.id, Number(id)))
        )
      );

    if (existingProduct.length > 0) {
      return res.status(400).json({
        message: "Ya existe un producto con ese nombre en esta categoría",
      });
    }

    await db
      .update(products)
      .set({
        name: name.trim(),
        price,
        category_id: Number(category_id),
      })
      .where(eq(products.id, Number(id)));

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.delete(products).where(eq(products.id, Number(id)));
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
