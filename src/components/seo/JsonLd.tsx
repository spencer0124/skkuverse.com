import type { ReactElement } from "react";

// Minimal typed shape we accept. schema.org objects vary heavily, so we
// allow any JSON-serializable structure rather than pinning every @type.
type JsonLdObject = Record<string, unknown>;

export default function JsonLd({
  data,
  id,
}: {
  data: JsonLdObject | JsonLdObject[];
  id?: string;
}): ReactElement {
  // Ensure @context is present on every top-level object for schema.org
  // validators; skip if the caller already provided one.
  const withContext = Array.isArray(data)
    ? data.map((obj) =>
        obj["@context"] ? obj : { "@context": "https://schema.org", ...obj }
      )
    : data["@context"]
      ? data
      : { "@context": "https://schema.org", ...data };

  return (
    <script
      id={id}
      type="application/ld+json"
      // JSON.stringify with no-op replacer guards against function-valued
      // fields that would throw. Crawlers expect exactly one JSON document
      // per <script>, so we emit Array form as-is (valid JSON-LD v1.1).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(withContext) }}
    />
  );
}
