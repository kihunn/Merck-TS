import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar"
import LabelEditor, { LabelEntityInfoStore } from "../../components/LabelEditor/LabelEditor";
import { Team } from "../../constants";
import * as api from "../../api/index"

export const LabelEditorPage = () => {
	const [labelSize, setLabelSize] = useState({ width: 62, length: 100 });

	useEffect(() => {
		const labelSize = JSON.parse(localStorage.getItem('labelSize') || '{}');
		if (labelSize.width && labelSize.length) {
			setLabelSize(labelSize);
		}
	}, [])

	const onWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const width = parseInt(event.target.value);
		localStorage.setItem('labelSize', JSON.stringify({ width, length: labelSize.length }));
		setLabelSize({ width, length: labelSize.length });
	}

	const onLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const length = parseInt(event.target.value);
		localStorage.setItem('labelSize', JSON.stringify({ width: labelSize.width, length }));
		setLabelSize({ width: labelSize.width, length });
	}

    const onSave = async (entities: LabelEntityInfoStore, team: Team) => {
        await api.setLabelDesign({
            entities: Object.values(entities),
            labelSize
        }, team)
    }
	
	return (
        <>
            <NavBar />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <LabelEditor
                    editorSize={{ width: '75%', height: '60%'}}
                    labelSize={{ width: labelSize.width, length: labelSize.length }}
                    onSave={onSave}
                    footerComponents={
                        <>
                            <label htmlFor="width">
                                Width:
                                <input
                                    type="number"
                                    name="width"
                                    value={labelSize.width}
                                    onChange={onWidthChange}
                                    style={{
                                        width: '50px',
                                    }}
                                />
                            </label>

                            <label htmlFor="length">
                                Length:
                                <input
                                    type="number"
                                    name="length"
                                    value={labelSize.length}
                                    onChange={onLengthChange}
                                    style={{
                                        width: '50px',
                                    }}
                                />
                            </label>
                        </>
                    }
                />
            </div>
        </>
	);
}