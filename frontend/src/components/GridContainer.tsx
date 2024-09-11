import React from 'react';
import './GridContainer.css';

interface GridItemProps {
  content: any;
}

const GridItem: React.FC<GridItemProps> = ({ content }) => {
  return <div><div className="grid-item">{content?.title}</div><div className="grid-item">{content?.count}</div></div>;
};

const GridContainer: React.FC = () => {
  const gridItems = [
    {"title": "General details", "count":"90%" },
    {"title": "Requirement description", "count":"90%" },
    {"title": "Tax requirements", "count":"90%" },
    {"title": "UAT test plan", "count":"90%" }
  ];

  return (
    <div className="grid-container">
      {gridItems.map((item, index) => (
        <GridItem key={index} content={item} />
      ))}
    </div>
  );
};

export default GridContainer;