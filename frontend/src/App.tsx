import { Route,createBrowserRouter,createRoutesFromElements, RouterProvider } from "react-router-dom"
import ProtectedRoute from "../src/components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyNotes from "./pages/MyNotes"
import NewNote from "./pages/NewNote"
import SettingsPage from "./pages/SettingsPage"
import { AuthProvider } from "./context/AuthContext"
import RootLayout from "./layouts/RootLayout"
import PageNotFound from "./pages/PageNotFound"
import PublicRoute from "./components/PublicRoute"
const noteRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<PublicRoute/>}>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Route>
    <Route path="/" element={<RootLayout/>}>
      <Route element={<ProtectedRoute/>}>
        <Route path="/new-note" element={<NewNote />}/>
        <Route path="/my-notes" element={<MyNotes />}/>
        <Route path="/settings" element={<SettingsPage />}/>
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