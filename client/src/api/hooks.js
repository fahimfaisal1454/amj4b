import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBanner, getAbout, getProjects, getImpact, getStories,
  getNews, getNewsBySlug, sendContact
} from "./endpoints";

export const useBanner = () =>
  useQuery({ queryKey: ["banner"], queryFn: getBanner });

export const useAbout = () =>
  useQuery({ queryKey: ["about"], queryFn: getAbout, staleTime: 1000 * 60 * 5 });

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: getProjects });

export const useImpact = () =>
  useQuery({ queryKey: ["impact"], queryFn: getImpact });

export const useStories = () =>
  useQuery({ queryKey: ["stories"], queryFn: getStories });

export const useNews = () =>
  useQuery({ queryKey: ["news"], queryFn: getNews });

export const useNewsDetail = (slug) =>
  useQuery({
    queryKey: ["news", slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: !!slug,
  });

export const useContact = () =>
  useMutation({ mutationFn: sendContact });
