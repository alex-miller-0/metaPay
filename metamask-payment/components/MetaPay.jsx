import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Button, Row, Col } from 'react-bootstrap';
import { Promise } from 'bluebird';
import { metaPay } from '../actions/index'

class MetaPayComponent extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch({ type: 'UPDATE_USD_AMT', result: 20. })
    dispatch(metaPay.getPrice())
    if (web3) {
      dispatch({ type: 'UPDATE_USER', result: web3.eth.accounts[0] })
      dispatch(metaPay.getNonce(web3))
      let provider = web3.version.network;
      console.log('provider', provider)
      dispatch({ type: 'UPDATE_WEB3_PROVIDER', result: provider })
    }
  }

  sendTxn() {
    let { dispatch, pay } = this.props;
    console.log('web3 provider', pay.web3_provider)
    let num_eth = parseFloat(pay.usd_amt) / pay.eth_price;
    dispatch(metaPay.sendTxn(web3, num_eth, pay.nonce))
  }

  renderMetamaskCheckout() {
    return (
      <Row>
      <Col md={4}></Col>
      <Col md={4}>
        <center>
        <h2>Checkout</h2>
        <h5>Horray! You're a Metamask user.</h5>
        <p>We'll give you the good stuff.</p>
        <div>
          <form>
            <br/>
            <FormGroup>
              <FormControl />
              Name
              <FormControl />
              Address
              <FormControl />
              City
              <FormControl />
              Country
            </FormGroup>
          </form>
          <br/>
          <Button bsStyle="primary" bsSize="large" onClick={this.sendTxn.bind(this)}>
            Pay ${this.props.pay.usd_amt}
          </Button>
        </div>
        </center>
      </Col>
      </Row>
    );
  }

  renderCheckout(network_err) {
    let wrongNetwork = '';
    if (network_err) {
      wrongNetwork = <h5>We detect metamask, but you're on the wrong network. Please switch to Ethereum Main Net</h5>
    }
    return (
      <Row>
      <Col md={3}></Col>
      <Col md={6}>
        <center>
          {wrongNetwork}
          <h2>Checkout</h2>
        </center>
        <h5>What a boring checkout. Too bad you aren't using Metamask.</h5>
        <div>
          <form>
            <FormGroup>
              <FormControl />
              Name
              <FormControl />
              Address
              <FormControl />
              City
              <FormControl />
              Country
            </FormGroup>
          </form>
          <Button bsStyle="primary" bsSize="large" block>Pay ${this.props.pay.usd_amt}</Button>
        </div>
      </Col>
      </Row>
    );
  }

  render(){
    let { pay } = this.props;
    if (web3 && pay.web3_provider == 1) {
      return this.renderMetamaskCheckout();
    } else if (web3) {
      return this.renderCheckout(true);
    } else {
      return this.renderCheckout();
    }

  }

}

const mapStoreToProps = (store) => {
  return {
    pay: store.metaPay
  };
}

const MetaPay = connect(mapStoreToProps)(MetaPayComponent);

export default MetaPay;
