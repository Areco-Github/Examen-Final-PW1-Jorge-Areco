import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { users } from "src/db/schema"; // tabla de usuarios
import { db } from "src/db/connection";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.username, username),
    });

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user?.id, username: user?.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Login exitoso" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
