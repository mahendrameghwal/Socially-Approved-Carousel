import { Request, Response, NextFunction } from 'express';
import * as VideoService from '../services/video.service';

// ── GET /api/v1/videos ─────────────────────────────────────────────────────────
export const getVideos = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    if (page < 1 || limit < 1) {
      res.status(400).json({
        error: true,
        message: 'page and limit must be positive integers',
        statusCode: 400,
      });
      return;
    }

    const result = VideoService.getVideos(page, limit);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/videos/:id ─────────────────────────────────────────────────────
export const getVideoById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = String(req.params.id);
    const video = VideoService.getVideoById(id);

    if (!video) {
      res.status(404).json({
        error: true,
        message: `Video with id "${id}" not found`,
        statusCode: 404,
      });
      return;
    }

    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/videos/:id/like ──────────────────────────────────────────────
export const likeVideo = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = String(req.params.id);
    const rawSession = req.headers['x-session-id'];
    const sessionId = Array.isArray(rawSession)
      ? rawSession[0]
      : rawSession || 'anonymous';

    const result = VideoService.toggleLike(id, sessionId);

    if (!result) {
      res.status(404).json({
        error: true,
        message: `Video with id "${id}" not found`,
        statusCode: 404,
      });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/videos/:id/share ─────────────────────────────────────────────
export const shareVideo = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = String(req.params.id);
    const result = VideoService.incrementShare(id);

    if (!result) {
      res.status(404).json({
        error: true,
        message: `Video with id "${id}" not found`,
        statusCode: 404,
      });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/videos/:id/view ──────────────────────────────────────────────
export const viewVideo = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = String(req.params.id);
    const result = VideoService.incrementView(id);

    if (!result) {
      res.status(404).json({
        error: true,
        message: `Video with id "${id}" not found`,
        statusCode: 404,
      });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
