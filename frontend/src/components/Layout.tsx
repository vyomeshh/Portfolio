import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #020617)",
      color: "white",
      padding: "40px"
    }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "40px" }}>Vyomesh Mishra</h1>
        <p>AI Developer | Machine Learning Engineer</p>
      </header>

      {children}
    </div>
  );
};

export default Layout;