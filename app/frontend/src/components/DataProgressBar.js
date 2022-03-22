import ProgressBar from "react-bootstrap/ProgressBar";

const DataProgressBar = (props) => {
  return (
    <>
      <div>Data Remaining</div>
      <ProgressBar
        style={{ height: "50px" }}
        stripped
        animated
        variant="info"
        now={props.percentage}
        label={`${props.percentage}%`}
      />
    </>
  );
};

export default DataProgressBar;
