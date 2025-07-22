// backend/db/queries.ts

// Consultas para la tabla de productos
export const productQueries = {
  getAll: "SELECT * FROM products",
  getById: "SELECT * FROM products WHERE id = ?",
  create: "INSERT INTO products (name, price) VALUES (?, ?)",
  update: "UPDATE products SET name = ?, price = ? WHERE id = ?",
  delete: "DELETE FROM products WHERE id = ?",
};

// Consultas para otras tablas pueden agregarse aquí
// Consultas para la tabla de categorías
export const categoryQueries = {
  getAll: "SELECT * FROM categories",
  getById: "SELECT * FROM categories WHERE id = ?",
  create: "INSERT INTO categories (name) VALUES (?)",
  update: "UPDATE categories SET name = ? WHERE id = ?",
  delete: "DELETE FROM categories WHERE id = ?",
};
