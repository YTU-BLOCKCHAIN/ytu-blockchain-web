import { members, type Member } from '@/data/members';
import { projects, type Project } from '@/data/projects';

/** Tüm projeleri döndürür. */
export function getProjects(): readonly Project[] {
  return projects;
}

/** Slug'a göre tek bir proje döndürür (yoksa undefined). */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Tüm üyeleri döndürür. */
export function getMembers(): readonly Member[] {
  return members;
}

/** Slug'a göre tek bir üye döndürür (yoksa undefined). */
export function getMemberBySlug(slug: string): Member | undefined {
  return members.find((member) => member.slug === slug);
}
