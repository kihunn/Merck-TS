import React, { useEffect, useState } from "react";

import "./styles.css";

interface TextOptions {
    defaultValue: string;
    size?: number;
    bold?: boolean;
}

export type EditableTextSelectEvent<T = Element> = (event: React.MouseEvent<T, MouseEvent>, paragraphRef: React.RefObject<HTMLParagraphElement>) => void;

interface EditableTextProps {
    text: TextOptions;
    id?: string;
    selected?: boolean;
    onSelect?: EditableTextSelectEvent;
    onEditStart?: (event: React.MouseEvent) => void;
    onEdit?: (event: React.ChangeEvent<HTMLInputElement>, text: string) => void;
    onEditEnd?: (event: React.FocusEvent | KeyboardEvent) => void;
    onDoubleClick?: React.MouseEventHandler<HTMLInputElement | HTMLParagraphElement>;
}

const EditableText: React.FC<React.PropsWithChildren<EditableTextProps>> = ({ children, ...props }) => {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const paragraphRef = React.useRef<HTMLParagraphElement>(null);

    const [text, setText] = useState<string>(props.text.defaultValue);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onClick = (event: React.MouseEvent) => {
        props.onSelect?.(event, paragraphRef);
    }

    const onDoubleClick = (event: React.MouseEvent) => {
        props.onEditStart?.(event);
        setIsEditing(true);
    }

    const onKeyDownInput = (event: KeyboardEvent) => {
        console.log(event);
        if (event.key === 'Enter') {
            props.onEditEnd?.(event);
            setIsEditing(false);
        }
    }

    const onKeyDownParagraph = (event: KeyboardEvent) => {
        console.log(event);
        if (event.key === 'Enter') {
            props.onEditStart?.(event as unknown as React.MouseEvent);
            setIsEditing(true);
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('keydown', onKeyDownInput);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', onKeyDownInput);
            }
        }
    }, []);

    const InputElement: React.FC = () => {

        return (
            <input
                className="editable-text-input"
                style={{ 
                    width: `${text.length}ch`, 
                    fontSize: `${props.text.size ?? 16}px`,
                    fontWeight: props.text.bold ? 'bold' : 'normal' 
                }}
                value={text}
                onChange={(event) => {
                    props.onEdit?.(event, event.target.value);
                    setText(event.target.value);
                }}
                onBlur={(event) => {
                    props.onEditEnd?.(event);
                    setIsEditing(false)
                }}
                ref={inputRef}
                id={props.id}
                autoFocus
            />
        )
    }

    const ParagraphElement = () => {
        return (
            <p
                className="editable-text-p"
                style={{
                    fontSize: `${props.text.size}px`,
                    fontWeight: props.text.bold ? 'bold' : 'normal',
                    ...(props.selected ? { outline: '1px solid black' } : { outline: 'none' })
                }}
                onMouseDown={onClick}
                onDoubleClick={onDoubleClick}
                ref={paragraphRef}
                id={props.id}
            >
                {text}
            </p>
        )
    }
    
    return (
        !isEditing ? <ParagraphElement /> : <InputElement />
    )

}

export default EditableText;