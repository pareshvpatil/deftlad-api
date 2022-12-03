import dotenv from "dotenv"

export const envs = {
  REDIS_HOST: '0.0.0.0',
  REDIS_PORT: 6380,
  REDIS_USERNAME: undefined,
  REDIS_PASSWORD: undefined,
  PCLOUD_API_KEY: '12323',
  NEOCITIES_API_KEY: '123123',
  ...dotenv.config().parsed,
  pCloud: {
    blogsFolderId: 15466638451,
    projectsFolderId: 15510387377,
    metadataFolderId: 15506648734,
    blogsMetadataFile: 'blogs.json',
    projectsMetadataFile: 'projects.json' 
  },
  blogsLocation: "content/BLOG",
  projectsLocation: "content/PROJECT",
  blogCategories: {
    tech: "tech",
    music: "music",
    sports: "sports/cricket"
  },
  ...process.env
};

export const isProduction = process.env.NODE_ENV === "production";
