import express from "express";
import isAuth from "../middleware/isAuth.js";
import { GetTeam, createTeam, Invite, AcceptInvite, welcome, GetUsers, deleteTeamMember } from "../controllers/team.js";

const router = express.Router();

router.get("/getTeam", isAuth, GetTeam);
router.post("/createTeam", isAuth, createTeam);
router.post("/teamInvite", isAuth, Invite);
router.get("/teamAccept", isAuth, AcceptInvite);
router.post("/welcome", isAuth, welcome);
router.get("/getUsers/:team", isAuth, GetUsers);
router.delete("/removeMember/:user", isAuth, deleteTeamMember);

export default router;

