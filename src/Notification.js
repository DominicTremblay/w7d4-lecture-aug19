import React from 'react';
import './Notification.scss';

const Notification = ({ content }) => {
  return <div className="message system">{content}</div>;
};

export default Notification;
