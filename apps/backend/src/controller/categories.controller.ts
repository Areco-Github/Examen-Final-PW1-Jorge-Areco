import { Request, Response } from "express";
import { db } from "../db/connection";
import { categories, products } from "../db/schema";
import { eq } from "drizzle-orm";

// Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    // Verificar si ya existe una categoría con ese nombre
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name.trim()));

    if (existing.length > 0) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const result = await db.insert(categories).values({ name: name.trim() });
    res.status(201).json({ message: "Categoría creada", result });
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    res.status(500).json({ message: "Error interno al crear la categoría" });
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    // Verificar que no exista otra categoría con ese nombre
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name.trim()));

    if (existing.length > 0 && existing[0].id !== Number(id)) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    await db
      .update(categories)
      .set({ name: name.trim() })
      .where(eq(categories.id, Number(id)));

    res.json({ message: "Categoría actualizada" });
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar si existen productos asociados a la categoría
    const productosRelacionados = await db
      .select()
      .from(products)
      .where(eq(products.category_id, Number(id)));

    if (productosRelacionados.length > 0) {
      // 🚫 No lanzar error, solo retornar aquí.
      res.status(400).json({
        message:
          "No se puede eliminar la categoría porque tiene productos asociados",
      });
      return; // ⚠️ Importante: cortar ejecución aquí
    }

    // ✅ Si no hay productos, eliminar la categoría
    await db.delete(categories).where(eq(categories.id, Number(id)));
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};
