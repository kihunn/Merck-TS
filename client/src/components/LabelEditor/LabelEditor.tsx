import { Button, Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";

import Draggable, { Position } from "./Draggable";

import "./styles.css";
import { useEffect, useRef, useState } from "react";
import EditableText, { EditableTextSelectEvent } from "./EditableText";
import React from "react";

type TextBlockInformation = {
    position: Position,
    textSize: number,
    text: string,
    bold: boolean;
}

type TextBlockInformationStore = {
    [key: string | number]: TextBlockInformation
}


const DEFAULT_TEXT_BLOCK_INFO: TextBlockInformation = {
    position: {
        x: 0,
        y: 0
    },
    textSize: 16,
    text: "double click to edit",
    bold: false
}

export const LabelEditor = () => {

    const [textBlocks, setTextBlocks] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [bold, setBold] = useState<boolean>(true);
    const [textBlockInfoStorage, setTextBlockInfoStorage] = useState<TextBlockInformationStore>({});

    const selectedTextBlockRef = useRef<HTMLParagraphElement | null>(null);

    const boldCurrentTextBlock = () => {
        setTextBlockInfoStorage({
            ...textBlockInfoStorage,
            [selectedId!]: { 
                ...textBlockInfoStorage[selectedId!], 
                bold 
            }
        })
    }

    const increaseCurrentTextBlockFontSize = (increment: number) => {
        setTextBlockInfoStorage({
            ...textBlockInfoStorage,
            [selectedId!]: { 
                ...textBlockInfoStorage[selectedId!], 
                textSize: textBlockInfoStorage[selectedId!].textSize + increment 
            }
        })
    }

    const onDragEnd = (event: MouseEvent, pos: React.RefObject<Position>) => {
        // @ts-ignore
        const id = event.target.id as string;
        // weird state shit going on here but timeout fixes it
        // assuming its because editableText is rerendering even though we are
        // technically passing the same state for text, textSize, and bold
        // TODO: probably going to need to split up how i'm storing the textBlockInfo
        setTimeout(() => {
            setTextBlockInfoStorage((previous) => { 
                return {
                    ...previous,
                    [id]: {
                        ...previous[id],
                        position: pos.current!
                    }
                }; 
            });
        }, 200);

    }

    const onTextBlockSelect: EditableTextSelectEvent = (event, textRef) => {
        // @ts-ignore
        const id = event.target.id as string;
        setSelectedId(id);
        console.log(textBlockInfoStorage)
        selectedTextBlockRef.current = textRef.current;
    }

    const onBoldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBold(!bold);
        boldCurrentTextBlock();
    }

    useEffect(() => {
        if (textBlocks === 0) return;
        setTextBlockInfoStorage((previous) => {
            return {
                ...previous,
                [textBlocks-1]: { ...DEFAULT_TEXT_BLOCK_INFO }
            }
        })
    }, [textBlocks]);

    useEffect(() => {
        console.log(textBlockInfoStorage)
    }, [textBlockInfoStorage]);

    return (
        <Paper className="label-editor">
            <Paper className="label-editor-controller">
                <Button onClick={() => setTextBlocks(textBlocks + 1)}>Add Text</Button>
                <Button 
                    disabled={selectedId === null}
                    onClick={() => increaseCurrentTextBlockFontSize(1)}
                >
                    Increase Font Size
                </Button>
                <FormGroup>
                    <FormControlLabel disabled={selectedId === null} control={<Checkbox value={bold} onChange={onBoldChange} />} label="Bold"/>
                </FormGroup>
            </Paper>
            <Paper className="label-editor-container">
                <Paper className="label-editor-label-container" >
                {
                    Array.from(Array(textBlocks).keys()).map((i) => {
                        return (
                            <Draggable 
                                onDragEnd={(event, pos) => onDragEnd(event, pos)} 
                                key={`${i}`}
                            >
                                <EditableText 
                                    text={{
                                        defaultValue: textBlockInfoStorage[i]?.text ?? DEFAULT_TEXT_BLOCK_INFO.text,
                                        size: textBlockInfoStorage[i]?.textSize ?? DEFAULT_TEXT_BLOCK_INFO.textSize,
                                        bold: textBlockInfoStorage[i]?.bold ?? DEFAULT_TEXT_BLOCK_INFO.bold
                                    }}
                                    onSelect={(event, ref) => onTextBlockSelect(event, ref)}
                                    id={`${i}`}
                                />
                            </Draggable>
                        )
                    })
                }
                </Paper>
            </Paper>
        </Paper>
    )
}