import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  schema?: Record<string, unknown> | null;
};

const SITE_URL = "https://mreslam.cc.cd";

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  schema,
}: SEOProps) {
  useEffect(() => {
    const fullCanonical =
      canonical || `${SITE_URL}${window.location.pathname}`;

    // Title
    document.title = title;

    // Description
    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.name = "description";
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.content = description;

    // Canonical
    let canonicalTag = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.href = fullCanonical;

    // Open Graph title
    setMetaProperty("og:title", title);

    // Open Graph description
    setMetaProperty("og:description", description);

    // Open Graph URL
    setMetaProperty("og:url", fullCanonical);

    // Open Graph type
    setMetaProperty("og:type", type);

    // Open Graph image
    if (image) {
      setMetaProperty("og:image", image);
    }

    // Twitter
    setMetaName("twitter:title", title);
    setMetaName("twitter:description", description);

    if (image) {
      setMetaName("twitter:image", image);
    }

    // Structured Data
    const oldSchema = document.getElementById("dynamic-schema");

    if (oldSchema) {
      oldSchema.remove();
    }

    if (schema) {
      const script = document.createElement("script");

      script.id = "dynamic-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);

      document.head.appendChild(script);
    }

    return () => {
      const dynamicSchema = document.getElementById("dynamic-schema");

      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, canonical, image, type, schema]);

  return null;
}

function setMetaProperty(property: string, content: string) {
  let tag = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function setMetaName(name: string, content: string) {
  let tag = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}