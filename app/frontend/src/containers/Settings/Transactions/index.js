import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Table } from 'react-bootstrap';
import { FileEarmarkArrowDown } from 'react-bootstrap-icons';

import './transactionsStyles.css'

const Transactions = (props) => {
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
                                {props.invoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td>{invoice.invoice_date}</td>
                                        <td>{invoice.stripe_invoice_number}</td>
                                        <td>C$ {parseFloat(invoice.amount_paid/100).toFixed(2)}</td>
                                        <td>{invoice.payment_card_type.toUpperCase()} •••• {invoice.payment_card_last4}</td>
                                        <td>
                                            <a href={invoice.stripe_payment_receipt_url} target='_blank' rel="noreferrer noopener"><FileEarmarkArrowDown color="royalblue" size={30} /></a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Transactions;