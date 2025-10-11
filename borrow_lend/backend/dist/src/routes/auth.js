import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { hash, compare } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { z } from "zod";
const router = Router();
const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6)
});
router.post("/register", async (req, res) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, name, password } = parse.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return res.status(409).json({ error: "Email already registered" });
    const user = await prisma.user.create({
        data: { email, name, password: await hash(password) },
        select: { id: true, email: true, name: true }
    });
    const token = signJwt({ userId: user.id });
    return res.status(201).json({ user, token });
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
router.post("/login", async (req, res) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await compare(password, user.password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = signJwt({ userId: user.id });
    return res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});
export default router;
