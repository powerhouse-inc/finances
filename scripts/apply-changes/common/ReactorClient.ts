import path from "path";
import { queryGraphQL } from "./gql-utils.js";
import { gql } from "graphql-request";

export type DriveResultNode = {
  id: string;
  parentFolder: string;
  name: string;
  documentType?: string;
};

export type DriveResult = {
  drive: DriveNodes;
};

export type DriveIdsResult = {
  drives: string[];
};

export type DriveNodes = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  nodes: DriveResultNode[];
};

export class ReactorClient {
  private endpointUrl: string | undefined;
  private driveEndpointUrl: string;
  private systemEndpointUrl: string;

  constructor(endpointUrl: string | undefined, driveName: string) {
    this.endpointUrl = endpointUrl;
    this.driveEndpointUrl = path.join(endpointUrl || "", "d", driveName);
    this.systemEndpointUrl = new URL("./system", endpointUrl || "").href;
  }

  public async queryReactor<ReturnType>(
    query: string,
    variables?: object,
  ): Promise<ReturnType> {
    const result = await queryGraphQL<ReturnType>(
      this.driveEndpointUrl,
      query,
      variables,
    );

    if (result.errors) {
      throw new Error(`GraphQL error when querying ${this.endpointUrl}`, {
        cause: result.errors,
      });
    }

    return result as ReturnType;
  }

  public async getDriveIds(): Promise<string[]> {
    const result = await queryGraphQL<DriveIdsResult>(
      this.systemEndpointUrl,
      gql`
        query getDriveIds {
          drives
        }
      `,
    );

    if (!result.drives) {
      if (result.errors) {
        throw new Error(
          `GraphQL error when querying ${this.systemEndpointUrl}`,
          { cause: result.errors },
        );
      } else {
        throw new Error(
          `Failed to fetch drive ids from ${this.systemEndpointUrl}`,
        );
      }
    }

    return result.drives;
  }

  public async getDriveNodes(): Promise<DriveNodes> {
    const result = await queryGraphQL<DriveResult>(
      this.driveEndpointUrl,
      gql`
        query getDriveNodes {
          drive {
            id
            slug
            name
            icon
            nodes {
              ... on DocumentDrive_FolderNode {
                id
                parentFolder
                name
              }
              ... on DocumentDrive_FileNode {
                id
                documentType
                parentFolder
                name
              }
            }
          }
        }
      `,
    );

    if (!result.drive) {
      if (result.errors) {
        throw new Error(`GraphQL error when querying ${this.endpointUrl}`, {
          cause: result.errors,
        });
      } else {
        throw new Error(`Failed to fetch drive info from ${this.endpointUrl}`);
      }
    }

    return result.drive;
  }
}
