import Box from '@mui/material/Box'

interface BarProps {
  animationDuration: number;
  progress: number;
}

const Bar = ({ animationDuration, progress } : BarProps)  => (
  <Box
    sx={{
      bgcolor: "primary.main",
      height: "0.1rem",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 99999,
      ml: `${(-1 + progress) * 100}%`,
      transition: `margin-left ${animationDuration}ms linear`
    }}
  />
);
export default Bar;