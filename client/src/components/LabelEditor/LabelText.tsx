import React from "react";

import "./LabelText.css"

interface LabelTextProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseMove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    position?: { x: string | number, y: string | number };
    textColor?: string;
    textSizePX?: number;
    id?: string;
    children: string;
}

const LabelText: React.FC<React.PropsWithChildren<LabelTextProps>> = ({
    onClick = () => {},
    onDoubleClick = () => {},
    onMouseDown = () => {},
    onMouseUp = () => {},
    onMouseMove = () => {},
    position = { x: 0, y: 0 },
    textColor = "black",
    textSizePX = 16,
    id = "",
    children,
}) => {
    
    const text: string = children;

    // If we are given a number default to using px as our units
    const x = `${position.x}${typeof position.x === 'number' ? 'px' : ''}`;
    const y = `${position.y}${typeof position.y === 'number' ? 'px' : ''}`;

    return (
        <div 
            className="label-text-container" 
            style={{
                top: y,
                left: x,
                fontSize: `${textSizePX}px`,
                color: textColor,
            }}
            onClick={(event) => { onClick(event); }}
            onDoubleClick={(event) => { onDoubleClick(event); }}
            onMouseDown={(event) => { onMouseDown(event); }}
            onMouseUp={(event) => { onMouseUp(event); }}
            onMouseMove={(event) => { onMouseMove(event); }}
            id={id}
        >
            {text}
        </div>
    )
}

export default LabelText;