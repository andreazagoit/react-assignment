import HomePage from "./pages/HomePage.tsx";
import QueryProvider from "./lib/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}

export default App;
