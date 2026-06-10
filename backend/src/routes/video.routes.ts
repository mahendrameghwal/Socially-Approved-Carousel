import { Router } from 'express';
import {
  getVideos,
  getVideoById,
  likeVideo,
  shareVideo,
  viewVideo,
} from '../controllers/video.controller';

const router = Router();

// GET  /api/v1/videos             → paginated list
router.get('/', getVideos);

// GET  /api/v1/videos/:id         → single video detail
router.get('/:id', getVideoById);

// POST /api/v1/videos/:id/like    → toggle like
router.post('/:id/like', likeVideo);

// POST /api/v1/videos/:id/share   → increment share count
router.post('/:id/share', shareVideo);

// POST /api/v1/videos/:id/view    → increment view count
router.post('/:id/view', viewVideo);

export default router;
