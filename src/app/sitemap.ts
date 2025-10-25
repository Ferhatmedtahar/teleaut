import { getAllUsers } from "@/actions/auth/getAllUsers";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: users } = await getAllUsers();

  const usersUrls = users.map((user) => ({
    url: `${baseUrl}/profile/${user.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-up/info`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-up/details`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-up/verify`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sign-up/verify-email`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sign-up/fail-auth`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sign-up/waitlist`,
      lastModified: new Date(),
      priority: 0.7,
    },

    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/aide`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/appointments`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/medical-notes`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/doctors`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/patients-list`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/doctor-list`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/dashboard`,
      lastModified: new Date(),
      priority: 1.0,
    },
    ...usersUrls,
  ];
}
