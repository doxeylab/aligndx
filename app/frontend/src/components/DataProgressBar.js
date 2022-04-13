import CircularProgressWithLabel from './CircularProgressWithLabel'

const DataProgressBar = (props) => {
  return (
    <>
      {props.percentage === 100 ?
      <div>{props.endcaption}</div>
        :
      <div>{props.caption}</div>
      }
      <CircularProgressWithLabel value={props.percentage} />
      {/* <ProgressBar
        style={{ height: "50px" }}
        stripped
        animated
        variant="info"
        now={props.percentage}
        label={`${props.percentage.toFixed(1)}%`}
      /> */}
    </>
  );
};

export default DataProgressBar;
