import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Table } from 'react-bootstrap';
import { FileEarmarkArrowDown } from 'react-bootstrap-icons';

import './transactionsStyles.css'

const Transactions = () => {
    const href = 'https://pay.stripe.com/receipts/acct_1FC7mnGOyRovo75V/ch_3KnQhmGOyRovo75V1CBnr5i7/rcpt_LUPXQCYJAdYIAsgKHNvRwGkIgra5Uop'
    return (
        <div className="custom-card">
            <div className='header'>
                <Row>
                    <Col>
                        <h2>All Transactions</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <Row>
                    <Col>
                        <Table striped bordered hover id='transactions-table'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Invoice Number</th>
                                    <th>Amount</th>
                                    <th>Payment Card</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>11th April, 2022</td>
                                    <td>2A16685B-0001</td>
                                    <td>C$ 282.50</td>
                                    <td>Visa •••• 4242</td>
                                    <td>
                                        <a href={href} target='_blank' rel="noreferrer noopener"><FileEarmarkArrowDown color="royalblue" size={30} /></a>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Transactions;