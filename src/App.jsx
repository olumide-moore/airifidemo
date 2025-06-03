import DbDataContextProvider from "./contexts/db_data";
import Home from "./pages/Home";

export default function App() {
  return (
    <DbDataContextProvider>
      <div>
        <Home />
      </div>
    </DbDataContextProvider>
  );
}
