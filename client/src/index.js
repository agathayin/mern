import ReactDOM from "react-dom/client";
import App from "./App";
// import css
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "../node_modules/ag-grid-community/styles/ag-grid.css";
import "../node_modules/ag-grid-community/styles/ag-theme-alpine.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
