import { Container } from "@mui/material";

export default function LoadingScreen() {
    return (
        <Container>
            <div className="loading-screen">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </Container>
    );
}