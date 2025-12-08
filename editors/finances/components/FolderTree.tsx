import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import {
  isFileNodeKind,
  setSelectedNode,
  useNodesInSelectedDrive,
  useSelectedDrive,
  useSelectedNode,
} from "@powerhousedao/reactor-browser";
import type { Node } from "document-drive";
import { useMemo } from "react";

function buildSidebarNodes(
  nodes: Node[],
  parentId: string | null | undefined,
): SidebarNode[] {
  return nodes
    .filter((n) => {
      if (parentId == null) {
        return n.parentFolder == null;
      }
      return n.parentFolder === parentId;
    })
    .map((node): SidebarNode => {
      if (node.kind === "folder") {
        return {
          id: node.id,
          title: node.name,
          icon: "FolderClose" as const,
          expandedIcon: "FolderOpen" as const,
          children: buildSidebarNodes(nodes, node.id),
        };
      }
      return {
        id: node.id,
        title: node.name,
        icon: "File" as const,
      };
    });
}

function transformNodesToSidebarNodes(
  nodes: Node[],
  driveName: string,
): SidebarNode[] {
  // Group nodes by document type
  const accountsNodes = nodes.filter(
    (n) => isFileNodeKind(n) && n.documentType === "powerhouse/accounts",
  );
  const transactionsNodes = nodes.filter(
    (n) => isFileNodeKind(n) && n.documentType === "powerhouse/account-transactions",
  );
  const snapshotNodes = nodes.filter(
    (n) => isFileNodeKind(n) && n.documentType === "powerhouse/finance-snapshot",
  );
  const otherNodes = nodes.filter(
    (n) =>
      !isFileNodeKind(n) ||
      !["powerhouse/accounts", "powerhouse/account-transactions", "powerhouse/finance-snapshot"].includes(
        n.documentType || "",
      ),
  );

  const children: SidebarNode[] = [];

  // === ACCOUNTS SECTION ===
  if (accountsNodes.length > 0) {
    children.push({
      id: "accounts-category",
      title: "Accounts",
      icon: "FolderClose" as const,
      expandedIcon: "FolderOpen" as const,
      children: buildSidebarNodes(accountsNodes, null),
    });
  }

  // === TRANSACTIONS SECTION ===
  if (transactionsNodes.length > 0) {
    children.push({
      id: "transactions-category",
      title: "Transactions",
      icon: "FolderClose" as const,
      expandedIcon: "FolderOpen" as const,
      children: buildSidebarNodes(transactionsNodes, null),
    });
  }

  // === SNAPSHOTS SECTION ===
  if (snapshotNodes.length > 0) {
    children.push({
      id: "snapshots-category",
      title: "Snapshots",
      icon: "FolderClose" as const,
      expandedIcon: "FolderOpen" as const,
      children: buildSidebarNodes(snapshotNodes, null),
    });
  }

  // === OTHER DOCUMENTS ===
  if (otherNodes.length > 0) {
    children.push(...buildSidebarNodes(otherNodes, null));
  }

  return [
    {
      id: "root",
      title: driveName,
      icon: "Drive" as const,
      children,
    },
  ];
}

/**
 * Hierarchical folder tree navigation component using Sidebar from document-engineering.
 * Displays folders and files in a tree structure with expand/collapse functionality, search, and resize support.
 */
export function FolderTree() {
  const [selectedDrive] = useSelectedDrive();
  const nodes = useNodesInSelectedDrive();
  const selectedNode = useSelectedNode();
  const driveName = selectedDrive.header.name;
  // Transform Node[] to hierarchical SidebarNode structure
  const sidebarNodes = useMemo(
    () => transformNodesToSidebarNodes(nodes || [], driveName),
    [nodes, driveName],
  );

  const handleActiveNodeChange = (node: SidebarNode) => {
    // If root node is selected, pass undefined to match existing behavior
    if (node.id === "root") {
      setSelectedNode(undefined);
    } else {
      setSelectedNode(node.id);
    }
  };
  // Map selectedNodeId to activeNodeId (use "root" when undefined)
  const activeNodeId =
    !selectedNode || selectedNode.id === selectedDrive.header.id
      ? "root"
      : selectedNode.id;

  return (
    <SidebarProvider nodes={sidebarNodes}>
      <Sidebar
        className="pt-1"
        nodes={sidebarNodes}
        activeNodeId={activeNodeId}
        onActiveNodeChange={handleActiveNodeChange}
        sidebarTitle="Drive Explorer"
        showSearchBar={true}
        resizable={true}
        allowPinning={false}
        showStatusFilter={false}
        initialWidth={256}
        defaultLevel={2}
      />
    </SidebarProvider>
  );
}
