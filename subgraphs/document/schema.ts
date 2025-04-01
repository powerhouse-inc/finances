import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  type Query {
    document(driveId: String, docId: PHID): IDocument
  }
`;
