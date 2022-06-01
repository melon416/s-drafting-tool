  /**
   *  Header.js
   *  Author:
   *  Created:
   */
  
  /**
   * Change-Log:
   * - 2022-05-27, Wang,  Standalone 
   */


import React, { Component } from 'react';
import Logo from '../../Logo';
import HeaderUserContainer from '../HeaderUser/HeaderUserContainer';
import './Header.scss';

class Header extends Component {
  getCategories = () => [
    {
      name: 'Drafting Assistant',
    },
  ]

  render() {
    const { standAlone } = this.props;

    return (
      <div className="Header header_inner">
        <Logo lightMode />
        { (standAlone === true) ? (<div className="HeaderMenu"></div>) : (
          <div className="HeaderMenu">
            <ul>
              {this.getCategories().map((cat) => (
                <li key={cat.name}>
                  <button type="button" className="active">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) }
        <HeaderUserContainer standAlone={standAlone}/>
      </div>
    );
  }
}

export default Header;
