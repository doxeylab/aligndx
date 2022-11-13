import Landing from "./landing"
import Dashboard from "./dashboard"
import { useAuthContext } from "../context/AuthProvider"

export default function DefaultRoute() {
    const context = useAuthContext();
    return (
        <> 
            {
                context.auth?
                <Dashboard />
                :
                <Landing />
            }
        </>
    )
}
