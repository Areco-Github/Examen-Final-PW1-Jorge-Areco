import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  // Lógica de autenticación
  const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default router;
