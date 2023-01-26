import React, { useEffect, useRef, useState } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import LabelText from "./LabelText";

import { v4 as uuidv4 } from 'uuid';

import "./LabelEditor.css"
import qr_image from "../../images/basic_qr_code.png";
import { Team } from "../../constants";

interface Position {
    x: number,
    y: number,
}

interface LabelEntityInfo {
    text: string,
    size?: number, // Only used for the qr code, size in px
    position: Position,
    fontColor: string,
    fontSizePX: number,
}

export interface LabelEntityInfoStore {
    [key: string]: LabelEntityInfo
}

interface LabelEditorProps {
    /**
     * The size of the label in millimeters
     */
    labelSize: { width: string | number, length: string | number },
    editorSize?: { width: string | number, height: string | number },
    onEntityInfoChange?: (textInfo: LabelEntityInfoStore) => void,
    onSave?: (entityInfo: LabelEntityInfoStore, team: Team) => void,
    footerComponents?: React.ReactNode,
    toolbarComponents?: React.ReactNode,
}

const LabelEditor: React.FC<React.PropsWithChildren<LabelEditorProps>> = ({
    labelSize,
    toolbarComponents,
    footerComponents,
    editorSize = { width: 'auto', height: 'auto' },
    onEntityInfoChange = () => {},
    onSave = () => {},
}) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastMousePositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    const [entityIDs, setEntityIDs] = useState<string[]>([]);

    // For performance reasons, this could be split up into a couple different states if need be
    const [entities, setEntities] = useState<LabelEntityInfoStore>({});
    const [qrCodeID, setQRCodeID] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team>(Team.ARND);

    const [selectedEntityID, setSelectedEntityID] = useState<string | null>(null);

    const [isSelectedEntityHeld, setIsSelectedEntityHeld] = useState<boolean>(false);

    // Radius used when searching for nearby text in px
    const [alignmentSearchRadius, setAlignmentSearchRadius] = useState<number>(10);

    // Text used when adding new text
    const [newText, setNewText] = useState<string>("New Text");

    // Size used when adding new text
    const [newFontSize, setNewFontSize] = useState<number>(16);

    // Color used when adding new text
    const [newFontColor, setNewFontColor] = useState<string>("#000000");

    const loadSavedLayout = () => {
        const storedText: LabelEntityInfo[] = JSON.parse(localStorage.getItem(selectedTeam) ?? "[]");
        const restoredTexts: LabelEntityInfoStore = {};
        var newQRCodeID = null;
        for (const text of storedText) {
            const { id, text: textInfo } = generateText(text);
            if (text.size !== undefined) {
                newQRCodeID = id;
            }
            restoredTexts[id] = textInfo;
        }
        setQRCodeID(newQRCodeID)
        setSelectedEntityID(null);
        setEntityIDs(Object.keys(restoredTexts));
        setEntities(restoredTexts);
        setNewFontColor(localStorage.getItem("newFontColor") ?? "#000000");
        setNewFontSize(parseInt(localStorage.getItem("newFontSize") ?? "16"));
        setNewText(localStorage.getItem("newText") ?? "New Text");
    }

    useEffect(() => {
        if (editorRef.current) {
            lastMousePositionRef.current = { x: editorRef.current.offsetLeft, y: editorRef.current.offsetTop };
            loadSavedLayout();
        }
    }, [loadSavedLayout]);

    useEffect(() => {
        onEntityInfoChange(entities);
    }, [entities]);

    useEffect(() => {
        loadSavedLayout();
    }, [selectedTeam, loadSavedLayout])

    const updateLastMousePosition = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
    }

    const findNearbyText = (currentTextPosition: Position, axis: 'x' | 'y', exclude?: string[]) => {
        for (const textID of entityIDs) {
            if (exclude && exclude.includes(textID)) 
                continue;
            const text = entities[textID];

            const diff = Math.abs(text.position[axis] - currentTextPosition[axis]);

            if (diff <= alignmentSearchRadius) {
                return text.position[axis];
            }
        }
        return null;
    }

    const generateText = (info?: LabelEntityInfo) => {
        const id = uuidv4();
        const text = { 
            ...{
                text: newText,
                position: { x: 0, y: 0 },
                fontColor: newFontColor,
                fontSizePX: newFontSize,
            },
            ...info,
        };
        return {
            id,
            text
        }
    }

    const addTextEntity = (info?: LabelEntityInfo) => {
        const { id, text } = generateText(info);

        setEntityIDs([...entityIDs, id]);
        setEntities({
            ...entities,
            [id]: text
        });
    }

    const addQRCodeEntity = () => {
        if (qrCodeID === null) {
            const { id, text } = generateText();
            text.text = "";
            text.fontSizePX = 0;
            text.size = 50;

            setQRCodeID(id);
            setEntityIDs([...entityIDs, id]);
            setEntities({
                ...entities,
                [id]: text
            });
        }
    }

    const onTextSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.currentTarget.value);

        if (selectedEntityID === null) {
            localStorage.setItem("newFontSize", newSize.toString());
            return setNewFontSize(newSize);
        }

        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                fontSizePX: newSize,
            }
        })
    }

    const onTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.currentTarget.value;

        if (selectedEntityID === null) {
            localStorage.setItem("newFontColor", newColor);
            return setNewFontColor(newColor);
        }

        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                fontColor: newColor,
            }
        })
    }

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedText = event.currentTarget.value;

        if (selectedEntityID === null) {
            localStorage.setItem("newText", updatedText);
            return setNewText(updatedText);
        }

        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                text: updatedText,
            }
        });
    }

    const onTextClickDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (isSelectedEntityHeld) 
            return;

        if (selectedEntityID !== null) {
            const selectedText = document.getElementById(selectedEntityID);
            if (selectedText !== null)
                selectedText.classList.remove("label-text-selected")
        }

        event.currentTarget.classList.add("label-text-selected");
        const textID = event.currentTarget.id;

        updateLastMousePosition(event);
        setIsSelectedEntityHeld(true);
        setSelectedEntityID(textID);
    }

    const onTextClickUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        updateLastMousePosition(event);
        setIsSelectedEntityHeld(false);
    }

    const onTextDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        if (!isSelectedEntityHeld)
            return;

        const id = selectedEntityID as string;
        const text = document.getElementById(id);
        if (text === null)
            return;

        const editor = editorRef.current;
        if (editor === null)
            return;


        const dx = event.clientX - lastMousePositionRef.current.x;
        const dy = event.clientY - lastMousePositionRef.current.y;

        var x = entities[id].position.x as number + dx;
        var y = entities[id].position.y as number + dy;

        if (event.shiftKey) {
            var nearbyTextX = findNearbyText({ x, y }, 'x', [id]); 
            var nearbyTextY = findNearbyText({ x, y }, 'y', [id]); 

            if (nearbyTextX !== null) {
                x = nearbyTextX;
            }

            if (nearbyTextY !== null) {
                y = nearbyTextY;
            }
        } 

        const editorRect = editor.getBoundingClientRect();

        // only update the position if the text will be within the editor
        if (x < 0 || x + text.offsetWidth > editorRect.width || y < 0 || y + text.offsetHeight > editorRect.height)
            return;

        setEntities({
            ...entities,
            [id]: {
                ...entities[id],
                position: { x, y },
            }
        })

        updateLastMousePosition(event);
    }

    const onDeleteClick = () => {
        if (selectedEntityID === null)
            return; 

        const newTextIDs = entityIDs.filter(id => id !== selectedEntityID);

        if (selectedEntityID === qrCodeID)
            setQRCodeID(null);

        setSelectedEntityID(null);
        setEntityIDs(newTextIDs);
        delete entities[selectedEntityID];
        setEntities({ ...entities });
    }

    const onSaveClick = () => {
        const labelTexts = Object.values(entities);
        localStorage.setItem(selectedTeam, JSON.stringify(labelTexts));
        onSave(entities, selectedTeam);
    }

    const onEditorClick = () => {
        if (selectedEntityID !== null) {
            const selectedText = document.getElementById(selectedEntityID);
            if (selectedText !== null)
                selectedText.classList.remove("label-text-selected")
        }
        setIsSelectedEntityHeld(false);
        setSelectedEntityID(null);
    }

    const onResetPositionClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEntities({
            ...entities,
            [selectedEntityID as string]: {
                ...entities[selectedEntityID as string],
                position: {
                    x: 0,
                    y: 0,
                }
            }
        });
    }

    const onQRCodeSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQRCodeSize = event.currentTarget.valueAsNumber;
        if (isNaN(newQRCodeSize))
            return;

        setEntities({
            ...entities,
            [qrCodeID as string]: {
                ...entities[qrCodeID as string],
                size: newQRCodeSize,
            }
        });
    }

    return (
        <div 
            className="label-editor-container"
            style={{
                width: `${editorSize.width}${typeof editorSize.width === "number" ? "px" : ""}`,
                height: `${editorSize.height}${typeof editorSize.height === "number" ? "px" : ""}`,
            }}
        >
            <div className="label-editor-toolbar">
                <Button 
                    onClick={() => addTextEntity()}
                >
                    Add Text
                </Button>

                <Button
                    disabled={qrCodeID !== null}
                    onClick={() => addQRCodeEntity()}
                >
                    Add QR Code
                </Button>

                <Button
                    disabled={selectedEntityID === null}
                    onClick={onDeleteClick}
                >
                    Delete Text
                </Button>

                <Button
                    disabled={selectedEntityID === null}
                    onClick={onResetPositionClick}
                >
                    Reset Position
                </Button>

                <input 
                    type="number" 
                    onChange={onTextSizeChange} 
                    disabled={selectedEntityID !== null && selectedEntityID === qrCodeID}
                    value={
                        selectedEntityID !== null ? entities[selectedEntityID].fontSizePX : newFontSize
                    } 
                />

                <input
                    type="color"
                    onChange={onTextColorChange}
                    disabled={selectedEntityID !== null && selectedEntityID === qrCodeID}
                    value={
                        selectedEntityID !== null ? entities[selectedEntityID].fontColor : newFontColor
                    }
                />

                {toolbarComponents}

                <Select
                    onChange={(event) => setSelectedTeam(event.target.value as Team)}
                    value={selectedTeam}
                >
                    <MenuItem value={Team.ARND}>ARND</MenuItem>
                    <MenuItem value={Team.PSCS}>PSCS</MenuItem>
                </Select>

                <Button
                    onClick={onSaveClick}
                >
                    Save
                </Button>
            </div>

            <div 
                className="label-editor" 
                onMouseUp={onEditorClick}
                onMouseLeave={onTextClickUp}
                ref={editorRef}
                style={{
                    width: `${labelSize.length}${typeof labelSize.length === "number" ? "mm" : ""}`,
                    height: `${labelSize.width}${typeof labelSize.width === "number" ? "mm" : ""}`,
                }}
            >
                {
                    entityIDs.map((entityID) => {
                        const entityInfo = entities[entityID];
                        return (
                            <LabelText
                                key={entityID}
                                id={entityID}
                                position={entityInfo.position}
                                textColor={entityInfo.fontColor}
                                textSizePX={entityInfo.fontSizePX}
                                onMouseDown={onTextClickDown}
                                onMouseUp={onTextClickUp}
                                onMouseMove={onTextDrag}
                            >
                                {entityInfo.text}
                            </LabelText>
                        );
                    })
                }
                {
                    qrCodeID !== null 
                    ? <div 
                        id={qrCodeID}
                        className="label-qr-code-container"
                        style={{
                            position: "absolute",
                            top: `${entities[qrCodeID].position.y}px`,
                            left: `${entities[qrCodeID].position.x}px`,
                            width: `${entities[qrCodeID].size}px`,
                            height: `${entities[qrCodeID].size}px`,
                            zIndex: 0
                        }}
                        onMouseDown={onTextClickDown}
                        onMouseUp={onTextClickUp}
                        onMouseMove={onTextDrag}
                    >
                        <img 
                            src={qr_image} 
                            style={{
                                userSelect: "none",
                                width: "100%",
                                height: "100%",  
                                zIndex: 0
                            }}
                            draggable={false}
                        ></img>
                    </div>
                    : null
                }
            </div>

            <div className="label-editor-text-input-container">
                <input
                    className="label-editor-text-input"
                    type="text"
                    onChange={onTextChange}
                    disabled={selectedEntityID !== null && selectedEntityID === qrCodeID}
                    value={
                        selectedEntityID !== null ? entities[selectedEntityID].text : newText
                    }
                />
                <p>
                    {selectedEntityID !== null 
                        ? `(${entities[selectedEntityID].position.x}, ${entities[selectedEntityID].position.y})`
                        : `(0, 0)`
                    }
                </p>
                {
                    selectedEntityID !== null && selectedEntityID == qrCodeID
                    ? <label htmlFor="qr-code-size">
                        QR Code Size
                        <input
                            type="number"
                            name="qr-code-size"
                            value={entities[qrCodeID].size}
                            onChange={onQRCodeSizeChange}
                            style={{
                                width: '50px'
                            }}
                        />
                    </label>
                    : null
                }
            </div>

            <div className="label-editor-footer">
                {footerComponents}
            </div>
            
        </div>
    );
}

export default LabelEditor;