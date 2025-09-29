import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Prompt = defineDocumentType(() => ({
  name: "Prompt",
  filePathPattern: `prompts/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    category: { type: "string", required: true },
    order: { type: "number", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("prompts/", ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Prompt],
  disableImportAliasWarning: true,
});
