/**
 * The address of a lab, always with its trailing slash.
 *
 * Every lab is served as a directory, `labs/<slug>/index.html`, so the
 * address without the slash makes the server answer with a redirect to the
 * one with it. That redirect used to come back as plain http, even when the
 * request was https: a browser that insists on secure connections then
 * stopped on a "this site doesn't support a secure connection" warning,
 * and a visitor who clicked through got a page without the secure context
 * the hashing lab needs. Linking to the directory itself asks for no
 * redirect at all, so every link, canonical address and sitemap entry is
 * built here.
 */
export const labPath = (slug: string): string => `/labs/${slug}/`;
