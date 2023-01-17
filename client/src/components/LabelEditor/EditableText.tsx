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
    const [selected, setSelected] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onClick = (event: React.MouseEvent) => {
        props.onSelect?.(event, paragraphRef);
        setTimeout(() => {
            setSelected(!selected);
        }, 150)
    }

    const onDoubleClick = (event: React.MouseEvent) => {
        props.onEditStart?.(event);
        setIsEditing(true);
    }

    const InputElement: React.FC = () => {
        const onKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                props.onEditEnd?.(event);
                setIsEditing(false);
            }
        }

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.addEventListener('keypress', onKeyPress);
            }

            return () => {
                if (inputRef.current) {
                    inputRef.current.removeEventListener('keypress', onKeyPress);
                }
            }
        }, []);

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
                    setSelected(false);
                }}
                ref={inputRef}
                id={props.id}
                autoFocus
            />
        )
    }

    useEffect(() => {
        console.log(props.text.size);
    }, [props.text.size]);

    const ParagraphElement = () => {
        return (
            <p
                className="editable-text-p"
                style={{
                    fontSize: `${props.text.size}px`,
                    fontWeight: props.text.bold ? 'bold' : 'normal',
                    ...(selected ? { border: '1px solid black' } : { border: 'none' })
                }}
                onClick={onClick}
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