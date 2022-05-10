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
    return (
      <div className="Header header_inner">
        <Logo lightMode />
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
        <HeaderUserContainer />
      </div>
    );
  }
}

export default Header;
