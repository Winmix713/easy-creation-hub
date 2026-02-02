import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { EditorProvider } from "./context/EditorContext.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <EditorProvider>
      <App />
    </EditorProvider>
  );
