import NavBar from "./NavBar";

const Layout = (props: any) => {

    const pages = ['About','SignUp', 'Login'];
    const settings = ['Settings', 'Logout'];
    return (
        <>
            <NavBar settings={settings}/>
            {props.children}
        </>
    )
};

export default Layout;