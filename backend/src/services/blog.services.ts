import Blog from '../models/blog.model';

export const getPublishedBlogs = async () => {
  return Blog.find({ status: 'published' }).populate('category author');
};
