import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import path from 'path';
import { z } from "zod";
import bcrypt from "bcrypt"
import { JWT_USER_PASSWORD } from "./config"
import { User, Tag, Content, Link } from './db';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { userMiddleware } from "./middleware";
import { error } from "console";
import { random } from "./utils";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("DATABASE CONNECTED");
        app.listen(3000);
        console.log("Listening on 3000");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
}
connect();



app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const requiredbody = z.object({
        username: z.string().min(3, "username must be at least 3 characters").max(10, "username must be at max 10 characters"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be at most 20 characters")
            .regex(/[A-Z]/, "Must include an uppercase letter")
            .regex(/[a-z]/, "Must include a lowercase letter")
            .regex(/[0-9]/, "Must include a number")
            .regex(/[^A-Za-z0-9]/, "Must include a special character")
    });

    const safeParseResult = requiredbody.safeParse(req.body);
    if (!safeParseResult.success) {
        return res.status(411).json({
            message: "Error in inputs",
            error: safeParseResult.error.issues
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(403).json({
                message: "User already exists with this username"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });

        return res.status(200).json({
            message: "Signed up"
        });
    } catch (e) {
        return res.status(500).json({
            message: "Server error"
        });
    }
})

app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existinguser = await User.findOne({ username });
        if (!existinguser) {
            return res.status(403).json({
                message: "INVALID CREDENTIALS"
            });
        }

        const passwordmatch = await bcrypt.compare(password, existinguser.password);

        if (passwordmatch) {
            const token = jwt.sign(
                { id: existinguser._id },
                JWT_USER_PASSWORD
            );
            return res.json({ token });
        } else {
            return res.status(403).json({
                message: "INVALID CREDENTIALS"
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error"
        });
    }


})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { link, title, type, tags = [] } = req.body;
    try {
        await Content.create({
            link,
            title,
            type, // <-- add this line
            userId: req.userid,
            tags
        });

        res.status(200).json({
            message: "Content added succesfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userid;
    try {
        const content = await Content.find({ userId: userId }).populate("userId", "username");
        res.json({ content });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete("/api/v1/content/:id", userMiddleware, async (req, res) => {
    const contentId = req.params.id;
    const userId = req.userid;

    try {
        const content = await Content.findOne({ _id: contentId, userId: userId });
        if (!content) {
            return res.status(404).json({ message: "Content not found or not authorized" });
        }

        await Content.deleteOne({ _id: contentId });
        res.status(200).json({ message: "Content deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    const userId = req.userid;

    if (typeof share !== "boolean") {
        return res.status(400).json({ message: "Missing or invalid 'share' field" });
    }

    try {
        if (share) {
            // Check if link already exists for this user
            let linkDoc = await Link.findOne({ userId });
            if (!linkDoc) {
                const hash = random(10);
                linkDoc = await Link.create({ hash, userId });
            }
            // Return the shareable link
            return res.status(200).json({
                message:"success",
                link: `http://localhost:3000/api/v1/brain/sharelink?hash=${linkDoc.hash}`
            });
        } else {
            await Link.deleteOne({ userId });
            return res.status(200).json({
                message: "Share link removed"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/api/v1/brain/sharelink", async (req, res) => {
    const hash = req.query.hash as string;

    if (!hash) {
        return res.status(400).json({ message: "Missing hash parameter" });
    }

    try {
        const linkDoc = await Link.findOne({ hash });
        if (!linkDoc) {
            return res.status(404).json({ message: "Invalid or expired link" });
        }

        // Find ALL content for the user associated with this link
        const content = await Content.find({ userId: linkDoc.userId }).populate("userId", "username");
        return res.status(200).json({ content }); // content is always an array
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error" });
    }
});

