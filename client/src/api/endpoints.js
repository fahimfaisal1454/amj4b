import api from "./axios";

// Banner / Hero
export const getBanner = () => api.get("/api/banner/").then(r => r.data);

// About (single document)
export const getAbout = () => api.get("/api/about/").then(r => r.data);

// Projects (aka Programs) — you exposed /api/projects/
export const getProjects = () => api.get("/api/projects/").then(r => r.data);

// Impact stats (counters)
export const getImpact = () => api.get("/api/impact/").then(r => r.data);

// Stories
export const getStories = () => api.get("/api/stories/").then(r => r.data);

// News (list + detail by slug)
export const getNews = () => api.get("/api/news/").then(r => r.data);
export const getNewsBySlug = (slug) => api.get(`/api/news/${slug}/`).then(r => r.data);

// Contact form
export const sendContact = (payload) => api.post("/api/contact/", payload).then(r => r.data);

// If you later need to upload images (gallery/news):
export const uploadFile = (url, file, extra = {}) => {
  const form = new FormData();
  form.append("image", file);
  Object.entries(extra).forEach(([k, v]) => form.append(k, v));
  return api.post(url, form, { headers: { "Content-Type": "multipart/form-data" } })
           .then(r => r.data);
};
