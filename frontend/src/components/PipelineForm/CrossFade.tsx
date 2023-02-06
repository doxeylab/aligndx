import * as React from 'react';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

type CrossFadeProps = {
  components: {
    in: boolean;
    component: React.ReactNode;
  }[];
};

const CrossFade: React.FC<CrossFadeProps> = ({ components }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      {components.map((component, index) => (
        <Fade key={index} in={component.in}>
          {component.in ?
            <Box
              sx={{
                width: '100%',
                height: '100%',
              }}
            >
              {component.component}
            </Box>
            :
            <Box>
            </Box>
          }
        </Fade>
      ))}
    </Box>
  );
};

export { CrossFade };