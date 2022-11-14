import { useNProgress } from "@tanem/react-nprogress";
import Bar from "./Bar";
import Container from "./Container";

interface ProgressProps {
  isRouteChanging : boolean;
}

const Progress = (props: ProgressProps) => {
  const {isRouteChanging} = props
  const { animationDuration, isFinished, progress } = useNProgress({
   isAnimating: isRouteChanging
  });
  
  return (
   <Container animationDuration={animationDuration} isFinished=  {isFinished}>
     <Bar animationDuration={animationDuration} progress={progress}
     />
   </Container>
  );
};
export default Progress;