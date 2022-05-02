import { Section } from "../components/Common/PageElement";

import { Grid, Typography, Container, Paper } from "@mui/material";
import Button from "../components/Button";
import Demo from '../assets/demo.gif'
import { useNavigate, useLocation } from "react-router-dom";

const Splash = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        navigate('/signup', { state: { from: location }, replace: true });
    }

    return (
        <>
            <Section id="hero" center>
                <Container >
                    <Grid container direction={'column'} justifyContent={'center'} alignItems="center" xs rowSpacing={2}>
                        <Grid item container direction='row' justifyContent={'center'} alignItems="center" >
                            <Grid item container direction={'column'} justifyContent={'center'} alignItems="center" spacing={2} xs>

                                <Grid item xs>
                                    <Typography variant="h3"> AlignDx Analysis Platform</Typography>
                                </Grid>
                                <Grid item xs >
                                    <Typography variant="h6"> What we provide</Typography>
                                </Grid>
                                <Grid item xs >
                                    <Typography> Rapid, and easy to use bioinformatics pipelines for analyzing your sequencing data. </Typography>
                                </Grid>
                                <Grid item xs >
                                    <Button onClick={handleClick}> Register Now</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Paper>
                                    <img src={Demo} width={'100%'} />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item container direction='row' justifyContent={'center'} alignItems="center">
                        </Grid>
                    </Grid>
                </Container>
            </Section>
        </>
    );
}

export default Splash;