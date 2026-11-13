import { Route,createBrowserRouter,createRoutesFromElements, RouterProvider } from "react-router-dom"
import ProtectedRoute from "../src/components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyNotes from "./pages/MyNotes"
import NewNote from "./pages/NewNote"
import Settings from "./pages/Settings"
import { AuthProvider } from "./context/AuthContext"
import RootLayout from "./layouts/RootLayout"
import PageNotFound from "./pages/PageNotFound"
import PublicRoute from "./components/PublicRoute"
import ForgotPassword from "./components/ForgotPassword"
const noteRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/forgot-password" element={<ForgotPassword/>} />
    <Route element={<PublicRoute/>}>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Route>
    <Route path="/" element={<RootLayout/>}>
      <Route element={<ProtectedRoute/>}>
        <Route path="/new-note" element={<NewNote />}/>
        <Route path="/my-notes" element={<MyNotes />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/" element={<NewNote />}/>
      </Route>
    </Route>
    <Route path="*" element={<PageNotFound />}/>
  </>
  )
)
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={noteRouter}/>
    </AuthProvider>
  )
}

export default App