import React, { Component } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <main className="h-auto">{this.props.children}</main>
        <Footer />
      </>
    );
  }
}
