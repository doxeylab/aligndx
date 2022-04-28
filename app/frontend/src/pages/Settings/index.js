import { useRef, useState } from 'react';
import { useQuery } from 'react-query'
import { usePayments } from '../../api/Payments'

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
import UserProfile from '../../containers/Settings/UserProfile';
import ManageUsers from '../../containers/Settings/ManageUsers';

const Settings = () => {
    const userProfileRef = useRef();
    const currentPlanRef = useRef();
    const changePlanRef = useRef();
    const paymentMethodRef = useRef();
    const transactionsRef = useRef();
    const cancelPlanRef = useRef();
    const manageUsersRef = useRef();
    const payments = usePayments();
    const [settingsData, setSettingsData] = useState(null);

    const scrollTo = (ref) => {
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const onSuccess = (data) => {
        if (data) {
            setSettingsData(data.data)
        }
    }

    const onError = (error) => {
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail)
            return;
        }
        console.error(error)
    }

    const {refetch, isLoading} = useQuery('settings_page_data', () => payments.get_settings_page_data(), {
        enabled: true,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    return (
        <Section id='settings-page'>
            <Container>
                { isLoading ? <p>loading...</p> : 
                    <Row>
                        <Col md={4} lg={{span: 3, offset:1}}>
                            <div className='side-menu'>
                                <div className='side-menu-header'>
                                    <span>Settings <Gear /></span>
                                </div>
                                <ul className='side-menu-list'>
                                    <li className='side-menu-item'>
                                        <div onClick={() => scrollTo(userProfileRef)}>User Profile</div>
                                    </li>
                                    <li className='side-menu-item'>
                                        <div onClick={() => scrollTo(currentPlanRef)}>Current Plan</div>
                                    </li>
                                    { settingsData.current_user.is_admin && settingsData.subscription?.is_active && <>
                                        <li className='side-menu-item'>
                                            <div onClick={() => scrollTo(changePlanRef)}>Change Plan</div>
                                        </li>
                                        <li className='side-menu-item'>
                                            <div onClick={() => scrollTo(paymentMethodRef)}>Payment Method</div>
                                        </li>
                                        <li className='side-menu-item'>
                                            <div onClick={() => scrollTo(manageUsersRef)}>Manager Users</div>
                                        </li>
                                        <li className='side-menu-item'>
                                            <div onClick={() => scrollTo(cancelPlanRef)}>Cancel Plan</div>
                                        </li>
                                    </>}
                                    { settingsData.current_user.is_admin && 
                                        <li className='side-menu-item'>
                                            <div onClick={() => scrollTo(transactionsRef)}>Transactions</div>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </Col>
                        <Col md={8} lg={{span: 7, offset:1}}>
                            <div ref={userProfileRef}>
                                <UserProfile user={settingsData.current_user} />
                            </div>
                            <div ref={currentPlanRef}>
                                <CurrentPlan
                                    plan={settingsData.current_plan}
                                    sub={settingsData.subscription}
                                />
                            </div>
                            { settingsData.current_user.is_admin && settingsData.subscription?.is_active &&
                                <>
                                    <div ref={changePlanRef}>
                                        <ChangePlan
                                            plans={settingsData.available_plans}
                                            current_plan={settingsData.current_plan}
                                            scheduled_plan={settingsData.scheduled_plan}
                                            refreshData={refetch}
                                        />
                                    </div>
                                    <div ref={paymentMethodRef}>
                                        <PaymentMethod customer={settingsData.customer} refreshData={refetch} />
                                    </div>
                                    <div ref={cancelPlanRef}>
                                        <CancelPlan sub={settingsData.subscription} refreshData={refetch} />
                                    </div>
                                    <div ref={manageUsersRef}>
                                        <ManageUsers users={settingsData.users}/>
                                    </div>
                                </>
                            }
                            { settingsData.current_user.is_admin &&
                                <div ref={transactionsRef}>
                                    <Transactions invoices={settingsData.invoices}/>
                                </div>
                            }
                        </Col>
                    </Row>
                }
            </Container>
        </Section>
    );
}

export default Settings;