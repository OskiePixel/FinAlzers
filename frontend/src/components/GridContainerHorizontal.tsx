import React from 'react';
import './GridContainer.css';
import file from "../../public/file.png";

interface GridItemProps {
  content: any;
}

const GridItem: React.FC<GridItemProps> = ({ content }) => {
  return <div> <div className="grid-item-hor"> <img className="fileIcon" src={file} /> {content?.title}</div></div>;
};

const GridContainerHorizontal: React.FC = () => {
  const gridItems = [
    {"title": "FBI Project BRD", "fileLink":"" },
    {"title": "FBI Project TRD", "fileLink":"" },
    {"title": "FBI Project LRD", "fileLink":"" },
    {"title": "FBI Project ARD", "fileLink":"" }
  ];

  return (
    <div className="grid-container-hor">
      {gridItems.map((item, index) => (
        <GridItem key={index} content={item} />
      ))}
    </div>
  );
};

export default GridContainerHorizontal;