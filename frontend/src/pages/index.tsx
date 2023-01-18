import { useAuthContext } from "../context/AuthProvider"
import Dashboard from "./dashboard";
import Analyze from "./analyze";
import Landing from "./landing"

export default function DefaultRoute() {
    const context = useAuthContext();

    return (
        <>
            {context?.authenticated ?
                <Analyze />
                :
                <Landing />
            }
        </>
    )
}
