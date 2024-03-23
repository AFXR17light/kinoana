'use client'
import React, { useState } from "react";

function ExpandableTabs({ children }: { children: React.ReactNode }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const handleButtonClick = (id: number) => {
    setExpandedId(id === expandedId ? null : id);
  };
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return;
        const isExpanded = index === expandedId;
        // const isExpanded = expandedIds.includes(index);
        const { title } = child?.props;
        return (
          <button key={index} className="borderlessButton"
            onClick={() => handleButtonClick(index)}
            style={{
              marginRight: '.5em',
              fontSize: '1em',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isExpanded ? ".25em solid" : ".1em solid",
              transition: "all .2s",
            }}
          >
            {title}
          </button>
        );
      })}
      {React.Children.map(children, (child, index) => {
        const isExpanded = index === expandedId;
        // const isExpanded = expandedIds.includes(index);
        return (
          <span className="expandable-item" key={index}>
            <span className="expandable-content"
              style={{
                overflowX: "hidden",
                height: isExpanded ? "auto" : 0,
                display: 'flex',
                // display: isExpanded ? '' : 'none',
                opacity: isExpanded ? 1 : 0,
                transition: "opacity .2s",
              }}
            >{child}
            </span>
          </span>
        );
      })}
    </>
  );
};

export default ExpandableTabs;
