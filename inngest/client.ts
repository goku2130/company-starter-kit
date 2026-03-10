import { Inngest } from "inngest";
import { siteConfig } from "@/site.config";

/**
 * Inngest client — one per company site.
 *
 * The ID is derived from the site config so each deployed company
 * gets its own namespace in the Inngest dashboard.
 */
export const inngest = new Inngest({
  id: siteConfig.domain.replace(/\./g, "-"),
});
