import { useSelectedFinanceSnapshotDocument } from "../hooks/useFinanceSnapshotDocument.js";

export function Editor() {
  const [document] = useSelectedFinanceSnapshotDocument();

  const state = (document?.state as any)?.global || {};
  const header = document?.header || {};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Finance Snapshot Editor</h1>
      <h2>Document State (Snapshot Content):</h2>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", fontSize: "12px" }}>
        {JSON.stringify(state, null, 2)}
      </pre>
      <h2>Document Header (Document Metadata):</h2>
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", fontSize: "12px" }}>
        {JSON.stringify(header, null, 2)}
      </pre>
      <h2>Explanation:</h2>
      <div style={{ backgroundColor: "#fff3cd", padding: "10px", fontSize: "14px" }}>
        <p><strong>Header ID:</strong> {header.id} (Document instance ID)</p>
        <p><strong>State ID:</strong> {state.id || 'null'} (Snapshot content ID)</p>
        <p>{state.id ? 'Snapshot has been created!' : 'No snapshot created yet - state is empty'}</p>
      </div>
    </div>
  );
}