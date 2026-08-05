import { RouterProvider} from "react-router"
import { router } from "./app.routes.jsx"
import "./features/shared/styles/global.scss"

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App;
