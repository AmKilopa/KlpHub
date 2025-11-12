import React from 'react';
import '../../styles/components/SkeletonLoader.css';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-layout">
      <div className="skeleton-sidebar">
        <div className="skeleton-title"></div>
        <div className="skeleton-input"></div>
        <div className="skeleton-textarea"></div>
        <div className="skeleton-button"></div>
      </div>
      <div className="skeleton-board">
        {[1, 2, 3].map((col) => (
          <div key={col} className="skeleton-column">
            <div className="skeleton-column-header"></div>
            {[1, 2, 3].map((task) => (
              <div key={task} className="skeleton-task"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
