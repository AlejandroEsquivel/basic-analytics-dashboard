import React from 'react';

const boldStyle = { opacity: '0.7',fontWeight: 'lighter' };

const Header = ()=> <h2>Quietly <span style={boldStyle}>Analytics Dashboard</span></h2>;
const SmallHeader = ()=> <div><span>Quietly</span> <span style={boldStyle}>Analytics Dashboard</span></div>;

export { SmallHeader };

export default Header;