import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import router from "./router";
import { queryClient } from "@/lib/query/queryClient";
import UpdatePrompt from "@/components/feedback/UpdatePrompt";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <UpdatePrompt />
  </QueryClientProvider>
);

export default App;
