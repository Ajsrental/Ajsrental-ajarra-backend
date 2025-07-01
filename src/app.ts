import express, { NextFunction, urlencoded } from "express";
import type { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import * as prometheus from "prom-client";
import { swaggerSpec } from "./utils/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { BaseError, HttpStatusCode } from "./exceptions";
import session from "express-session";
import passport from "passport";

const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    JWT_ISSUER: process.env.JWT_ISSUER,
    PORT: process.env.PORT,
};

const app = express();
const port = config.PORT || 3000;

app.enable("trust proxy");
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Add session and passport initialization before routes
app.use(session({ secret: "your-secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: "10mb" }));
app.use(urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));

app.get("/", (req: Request, res: Response) => {
    res.redirect("/docs");
});

prometheus.collectDefaultMetrics();
app.get("/metrics", (req: Request, res: Response) => {
    res.set("Content-Type", prometheus.register.contentType);
    res.end(prometheus.register.metrics());          
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

console.log(`Docs available at http://localhost:${port}/docs`);
app.use("/api", router);

// ─── 404 CATCH-ALL ─────
app.use((req, res) => {
    if (!res.headersSent) {
        return res
            .status(HttpStatusCode.NOT_FOUND)
            .json({ status: "error", message: "Route not found" });
    }
});

// ─── CENTRAL ERROR HANDLER ───
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    errorHandler.handleError(err, res);

    if (!(err instanceof BaseError)) {
        res
            .status(HttpStatusCode.INTERNAL_SERVER)
            .json({ status: "error", message: "Internal server error" });
    }
});



export default app;