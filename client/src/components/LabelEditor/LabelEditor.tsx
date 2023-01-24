import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";

import Draggable, { Position } from "./Draggable";

import "./styles.css";
import { useEffect, useRef, useState } from "react";
import EditableText, { EditableTextSelectEvent } from "./EditableText";
import React from "react";

import * as api from "../../api/index";
import { Team } from "../../constants";
import 'tui-image-editor/dist/tui-image-editor.css';

const AVAILABLE_FONT_SIZES: { [key: string]: number } = {
    BASIC_16: 16,
    BASIC_24: 24,
    BASIC_32: 32,
} as const;

type TextBlockInformation = {
    textSize: number,
    text: string,
    bold: boolean;
}

type TextBlockInformationStore = {
    [key: string | number]: TextBlockInformation
}


const DEFAULT_TEXT_BLOCK_INFO: TextBlockInformation = {
    textSize: 16,
    text: "double click to edit",
    bold: false
}

export const LabelEditor = () => {

    const [textBlocks, setTextBlocks] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dragMode, setDragMode] = useState<boolean>(false);
    const [textBlockInfos, setTextBlockInfos] = useState<TextBlockInformationStore>({});
    const [textBlockPositions, setTextBlockPositions] = useState<Record<number, Position>>({});

    const [labelSize, setLabelSize] = useState<[number, number]>([2.4, 3.9]);
    const [labelSizePX, setLabelSizePX] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        const PPI = 96;
        setLabelSizePX([labelSize[0] * PPI, labelSize[1] * PPI]);
    }, [labelSize]);

    const selectedTextBlockRef = useRef<HTMLParagraphElement | null>(null);

    const setTextBlockFontSize = (value: number) => {
        setTextBlockInfos({
            ...textBlockInfos,
            [selectedId!]: { 
                ...textBlockInfos[selectedId!], 
                textSize: value 
            }
        })
    }

    const onDragEnd = (event: MouseEvent, pos: React.RefObject<Position>) => {
        // @ts-ignore
        const id = event.target.id as string;
        setTextBlockPositions((previous) => {
            return {
                ...previous,
                [id]: pos.current!
            }
        });
    }

    const onTextBlockSelect: EditableTextSelectEvent = (event, textRef) => {
        // @ts-ignore
        const id = event.target.id as string;
        setSelectedId(id);
        selectedTextBlockRef.current = textRef.current;
    }

    const onBoldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextBlockInfos({
            ...textBlockInfos,
            [selectedId!]: { 
                ...textBlockInfos[selectedId!], 
                bold: event.target.checked
            }
        })
    }

    const saveLabel = async () => {
        const joined = Object.entries(textBlockPositions).map(([key, value]) => {
            return {
                ...textBlockInfos[key],
                position: value
            }
        });

        await api.setLabelDesign(joined, Team.ARND);
    }

    const onEditEnd = (event: any) => {
        // @ts-ignore
        const id = event.target.id as string;
        setTextBlockInfos({
            ...textBlockInfos,
            [id]: {
                ...textBlockInfos[id],
                text: event.target.value
            }
        })
    }

    useEffect(() => {
        if (textBlocks === 0) return;
        setTextBlockInfos((previous) => {
            return {
                ...previous,
                [textBlocks-1]: { ...DEFAULT_TEXT_BLOCK_INFO }
            }
        })
        setTextBlockPositions((previous) => {
            return {
                ...previous,
                [textBlocks-1]: { x: 0, y: 0 }
            }
        })
    }, [textBlocks]);

    return (
        <Paper className="label-editor">
            <Paper className="label-editor-controller">
                <Button onClick={() => setTextBlocks(textBlocks + 1)}>Add Text</Button>
                <FormControl sx={{ width: '30%', transform: 'scale(0.9)' }}>
                    <InputLabel>Font Size</InputLabel>
                    <Select
                        disabled={selectedId === null}
                        value={textBlockInfos[selectedId!]?.textSize ?? DEFAULT_TEXT_BLOCK_INFO.textSize}
                        label="Font Size"
                        onChange={(event) => {
                                // @ts-ignore
                                setTextBlockFontSize(event.target.value as number)
                            }
                        }
                    >
                        {
                            Object.values(AVAILABLE_FONT_SIZES).map((key) => {
                                return (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <Button onClick={() => setSelectedId(null)}>
                    Deselect 
                </Button>
                <FormGroup>
                    <FormControlLabel disabled={selectedId === null} control={<Checkbox value={selectedId === null ? false : textBlockInfos[selectedId!].bold} onChange={onBoldChange}/>} label="Bold"/>
                    <FormControlLabel control={<Checkbox value={dragMode} onChange={(event) => setDragMode(!dragMode)} />} label="Drag Mode"/>
                </FormGroup>
                <TextField
                    type='number'
                    value={labelSize[1]}
                    onChange={(event) => {
                        var value = event.target.value;
                        // @ts-ignore
                        setLabelSize([labelSize[0], value])
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">in</InputAdornment>,
                    }}
                />
                <TextField
                    type='number'
                    value={labelSize[0]}
                    onChange={(event) => {
                        const value = event.target.value;
                        // @ts-ignore
                        setLabelSize([value, labelSize[1]])
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">in</InputAdornment>,
                    }}
                />
                <Button onClick={saveLabel}>Save</Button>
            </Paper>
            <Paper 
                className="label-editor-container"
            >
                <Paper 
                    className="label-editor-label-container" 
                    sx={{ 
                        width: `${labelSizePX[1]}px`, height: `${labelSizePX[0]}px` 
                    }}   
                >
                {
                    Array.from(Array(textBlocks).keys()).map((i) => {
                        const selected = selectedId === i.toString();
                        return (
                            <Draggable 
                                disabled={!dragMode}
                                onDragEnd={(event, pos) => onDragEnd(event, pos)} 
                                key={`${i}`}
                            >
                                <EditableText 
                                    text={{
                                        defaultValue: textBlockInfos[i]?.text ?? DEFAULT_TEXT_BLOCK_INFO.text,
                                        size: textBlockInfos[i]?.textSize ?? DEFAULT_TEXT_BLOCK_INFO.textSize,
                                        bold: textBlockInfos[i]?.bold ?? DEFAULT_TEXT_BLOCK_INFO.bold
                                    }}
                                    selected={selected}
                                    onSelect={(event, ref) => onTextBlockSelect(event, ref)}
                                    onEditEnd={(event) => onEditEnd(event)}
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