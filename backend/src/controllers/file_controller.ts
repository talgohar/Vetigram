import express, {Request, Response, NextFunction} from "express";
import path from "path";

const secureStaticMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userIdRaw = req.params.userid;
const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw; // Get the logged-in user's ID

  if (!userId) {
    res.status(403).json({ message: "Unauthorized access" });
    return;
}

  // Ensure user can only access their own folder
  const requestedPath = path.normalize(req.path).replace(/^\/+/, ""); // Remove leading slashes
  if (!requestedPath.startsWith(userId)) {
    res.status(403).json({ message: "Access denied" });
    return; 
  }

  next();
};

export default secureStaticMiddleware;
