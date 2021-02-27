import React, { FC } from 'react';
import { MessageType } from '../models';

const Message: FC<{ message: string; type?: MessageType }> = ({ message, type = 'info' }) => {
  const getClass = () => {
    return `alert alert-${type}`;
  };

  return (
    <>
      <div className={getClass()} role="alert">
        {message}
      </div>
    </>
  );
};

export default Message;
