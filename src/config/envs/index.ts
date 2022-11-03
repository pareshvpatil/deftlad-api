import dotenv from "dotenv"

export const envs = {
  ...process.env,
  ...dotenv.config().parsed,
  neocities: {
    apiKey: '9378f758e68f87d9aa63fbe0926dcf13'
  },
  ...{
    blogsLocation: "content/BLOG",
    projectsLocation: "content/PROJECT",
    blogCategories: {
      tech: "tech",
      music: "music",
      sports: "sports/cricket"
    }
  }
};

export const isProduction = process.env.NODE_ENV === "production";
