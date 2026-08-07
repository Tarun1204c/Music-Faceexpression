import { RouterProvider} from "react-router"
import { router } from "./app.routes.jsx"
import "./features/shared/styles/global.scss"
import { AuthProvider } from "./features/auth/auth.context.jsx";

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;
