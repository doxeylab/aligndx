import NavBar from "./NavBar";

const Layout = (props: any) => (
    <>
        <NavBar />
        {props.children}
    </>
);

export default Layout;