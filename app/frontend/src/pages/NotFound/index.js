import React from 'react';
import { Section } from '../../components/Common/PageElement'
import NotFoundimg from '../../assets/NotFound.svg'
import { Container, Grid } from '@mui/material';

const NotFound = () => (
    <div>
        <Section>
                <Grid container justifyContent={'center'} alignItems={'center'}>
                    <Grid item xs={4}>
                        <img src={NotFoundimg} alt='notfound' />
                    </Grid>
                </Grid>
        </Section>
    </div>
);


export default NotFound;
