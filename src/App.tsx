import HomePage from "./pages/HomePage.tsx";
import QueryProvider from "./lib/QueryProvider";

function App() {
  return (
    /* Wrap the app in react query provider */
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}

export default App;
