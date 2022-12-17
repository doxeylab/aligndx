import { useAuthContext } from "../context/AuthProvider"
import Dashboard from "./dashboard";
import Landing from "./landing"

export default function DefaultRoute() {
    const context = useAuthContext();

    return (
        <>
            {context?.authenticated ?
                <Dashboard />
                :
                <Landing />
            }
        </>
    )
}
