import Box from '@mui/material/Box'
import { ReactNode } from "react"

interface ContainerProps {
  animationDuration: number;
  isFinished : boolean;
  children?: ReactNode;
}

const Container = ({animationDuration, isFinished, children} : ContainerProps) => (
  <Box 
    sx={{
     pointerEvents: "none",
     opacity: isFinished ? 0 : 1,
     transition: `opacity ${animationDuration}ms linear`,
    }}
  >
   {children}
  </Box>
);
export default Container