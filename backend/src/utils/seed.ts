import { Video } from '../models/video.model';

// Ultra-reliable public test videos with open CORS and proper MIME types (never blocked)
const SAMPLE_VIDEOS = [
  {
    url: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumb: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80',
    title: 'Oceans Exploration',
    duration: 13,
  },
  {
    url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'Sintel Fantasy Story',
    duration: 52,
  },
  {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
    title: 'Blossoming Flower Close-Up',
    duration: 6,
  },
  {
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    title: 'Big Buck Bunny Classic',
    duration: 10,
  },
  {
    url: 'https://www.w3schools.com/html/movie.mp4',
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    title: 'Wildlife & Nature Wonders',
    duration: 12,
  },
];

const TAGS_POOL = [
  ['nature', 'wildlife', 'cinematic'],
  ['adventure', 'travel', 'outdoor'],
  ['relax', 'summer', 'vibes'],
  ['ocean', 'water', 'exploration'],
];

const DESCRIPTIONS = [
  'A stunning visual loop capturing peaceful moments in nature.',
  'Relaxing scenery designed to bring calmness and inspiration.',
  'High-quality atmospheric footage showing natural beauty.',
  'Beautiful cinematic shot of light dancing through elements.',
];

const AUTHORS = [
  { name: 'Alex Rivera', avatarUrl: 'https://i.pravatar.cc/48?img=11' },
  { name: 'Priya Kapoor', avatarUrl: 'https://i.pravatar.cc/48?img=49' },
  { name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/48?img=12' },
  { name: 'Sam Taylor', avatarUrl: 'https://i.pravatar.cc/48?img=33' },
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function seedVideos(): Video[] {
  const videos: Video[] = [];

  for (let i = 0; i < 49; i++) {
    const source = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
    const tagSet = TAGS_POOL[i % TAGS_POOL.length];
    const description = DESCRIPTIONS[i % DESCRIPTIONS.length];
    const author = AUTHORS[i % AUTHORS.length];

    const repeatIndex = Math.floor(i / SAMPLE_VIDEOS.length);
    const title = repeatIndex > 0 ? `${source.title} (${repeatIndex + 1})` : source.title;

    videos.push({
      id: `vid_${String(i + 1).padStart(3, '0')}`,
      title,
      description,
      videoUrl: source.url,
      thumbnailUrl: source.thumb,
      tags: tagSet,
      duration: source.duration,
      likes: randomBetween(45, 6800),
      shares: randomBetween(12, 1800),
      views: randomBetween(300, 42000),
      author,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }

  return videos;
}
