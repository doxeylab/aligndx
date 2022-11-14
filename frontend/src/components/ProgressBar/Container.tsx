import Box from '@mui/material/Box'
const Container = ({animationDuration, isFinished, children}) => (
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