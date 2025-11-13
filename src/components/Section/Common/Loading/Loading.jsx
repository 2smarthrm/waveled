
"use client"
import React from 'react';

const Loading = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="tekup-preloader-dwrap">
       
    </div>
    )
  );
};

export default Loading;

