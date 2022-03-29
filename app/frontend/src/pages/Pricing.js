import {Button} from "react-bootstrap";
  import {SendCheck, CheckCircleFill,} from "react-bootstrap-icons";
    const Pricing = () => {
        return(
            <div className="maincontainer">
      <section>
        <div className="container py-5">
          <div className="row text-center align-items-end">
            <h2>Analyze your data for free up to 1GB</h2>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="bg-white p-5 rounded-lg shadow">
                <SendCheck color="DodgerBlue" size={96} />
                <h1 className="h2 text-uppercase font-weight-bold mb-4">
                  Basic
                </h1>
                <div>
                  <span className="h1 font-weight-bold">$100</span>
                  <span className="h3 font-weight-normal ml-2">/ month</span>
                </div>
                <div className="custom-separator my-4 mx-auto bg-primary"></div>
                <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">&nbsp;Data:</span>Up
                    to 50 GB
                  </li>
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">
                      &nbsp;Description:
                    </span>
                  </li>
                </ul>
                <Button className="btn btn-primary btn-block p-2 shadow rounded-pill">
                  Join Now
                </Button>
              </div>
            </div>

            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="bg-white p-5 rounded-lg shadow">
                <SendCheck color="DodgerBlue" size={96} />
                <h1 className="h2 text-uppercase font-weight-bold mb-4">
                  Premium
                </h1>
                <div>
                  <span className="h1 font-weight-bold">$1000</span>
                  <span className="h3 font-weight-normal ml-2">/ month</span>
                </div>
                <div className="custom-separator my-4 mx-auto bg-primary"></div>
                <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">&nbsp;Data:</span>Up
                    to 500 GB
                  </li>
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">
                      &nbsp;Description:
                    </span>
                  </li>
                </ul>
                <Button className="btn btn-primary btn-block p-2 shadow rounded-pill">
                  Join Now
                </Button>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-5 rounded-lg shadow">
                <SendCheck color="DodgerBlue" size={96} />
                <h1 className="h2 text-uppercase font-weight-bold mb-4">
                  Custom
                </h1>
                <div>
                  <span className="h1 font-weight-bold">Contact Us</span>
                  <span className="h3 font-weight-normal ml-2"></span>
                </div>
                <div className="custom-separator my-4 mx-auto bg-primary"></div>
                <ul className="list-unstyled my-5 text-small text-left font-weight-normal">
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">&nbsp;Data:</span>
                    Unlimited
                  </li>
                  <li className="mb-3">
                    <CheckCircleFill color="green" size={20} />
                    <span className="h4 font-weight-bold">
                      &nbsp;Description:
                    </span>
                  </li>
                </ul>
                <Button className="btn btn-primary btn-block p-2 shadow rounded-pill">
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
        );
    }
    export default Pricing;