import { useRef } from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Gear } from 'react-bootstrap-icons';

// Custom CSS
import './settingsStyles.css';

import { Section } from '../../components/Common/PageElement'
import CurrentPlan from '../../containers/Settings/CurrentPlan';
import ChangePlan from '../../containers/Settings/ChangePlan';
import PaymentMethod from '../../containers/Settings/PaymentMethod';
import Transactions from '../../containers/Settings/Transactions';
import CancelPlan from '../../containers/Settings/CancelPlan';

const Settings = () => {
    const currentPlanRef = useRef();
    const changePlanRef = useRef();
    const paymentMethodRef = useRef();
    const transactionsRef = useRef();
    const cancelPlanRef = useRef();

    const scrollTo = (ref) => {
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    return (
        <Section id='settings-page'>
            <Container>
                <Row>
                    <Col md={4} lg={{span: 3, offset:1}}>
                        <div className='side-menu'>
                            <div className='side-menu-header'>
                                <span>Settings <Gear /></span>
                            </div>
                            <ul className='side-menu-list'>
                                <li className='side-menu-item'>
                                    <div onClick={() => scrollTo(currentPlanRef)}>Current Plan</div>
                                </li>
                                <li className='side-menu-item'>
                                    <div onClick={() => scrollTo(changePlanRef)}>Change Plan</div>
                                </li>
                                <li className='side-menu-item'>
                                    <div onClick={() => scrollTo(paymentMethodRef)}>Payment Method</div>
                                </li>
                                <li className='side-menu-item'>
                                    <div onClick={() => scrollTo(transactionsRef)}>Transactions</div>
                                </li>
                                <li className='side-menu-item'>
                                    <div>Manager Users</div>
                                </li>
                                <li className='side-menu-item'>
                                    <div onClick={() => scrollTo(cancelPlanRef)}>Cancel Plan</div>
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <Col md={8} lg={{span: 7, offset:1}}>
                        <div ref={currentPlanRef}>
                            <CurrentPlan />
                        </div>
                        <div ref={changePlanRef}>
                            <ChangePlan />
                        </div>
                        <div ref={paymentMethodRef}>
                            <PaymentMethod />
                        </div>
                        <div ref={transactionsRef}>
                            <Transactions />
                        </div>
                        <div ref={cancelPlanRef}>
                            <CancelPlan />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default Settings;