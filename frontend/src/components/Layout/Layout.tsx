import NavBar from "./NavBar";

const Layout = (props: any) => {

    const settings = ['Settings', 'Logout'];
    return (
        <>
            <NavBar settings={settings} />
            {props.children}
        </>
    )
};

export default Layout;