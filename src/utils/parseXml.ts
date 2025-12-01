import type { Category } from "../types";

export async function loadCatalogXml(url = "/catalog.xml"): Promise<Category[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load catalog.xml");
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");
  // basic error check
  const parseError = xml.querySelector("parsererror");
  if (parseError) {
    console.error(parseError.textContent);
    throw new Error("XML parse error");
  }

  const cats = Array.from(xml.querySelectorAll("category")).map((node) => {
    const id = node.getAttribute("id") || "";
    const name = node.querySelector("name")?.textContent?.trim() || "";
    // imageUrl may contain spaces, encode if needed
    const imageUrl = node.querySelector("imageUrl")?.textContent?.trim() || "";
    const webUrl = node.querySelector("webUrl")?.textContent?.trim() || "";
    return { id, name, imageUrl, webUrl } as Category;
  });

  return cats;
}
