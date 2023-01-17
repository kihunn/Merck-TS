import { useEffect, useRef } from "react";

interface DraggableProps {
    position?: Position;
    onDragStart?: (event: MouseEvent, position: React.RefObject<Position>) => void;
    onDragEnd?: (event: MouseEvent, position: React.RefObject<Position>) => void;
    onDrag?: (event: MouseEvent, position: React.RefObject<Position>) => void;
    disabled?: boolean;
}

export interface Position {
    x: number;
    y: number;
}

const Draggable: React.FC<React.PropsWithChildren<DraggableProps>> = ({
    children,
    onDragStart,
    onDragEnd,
    onDrag,
    disabled = false,
    ...props
}) => {
    const draggableRef = useRef<HTMLDivElement>(null);

    const position = useRef<Position>(props.position ?? { x: 0, y: 0 });
    const isClicked = useRef<boolean>(false);
    const lastClickPosition = useRef<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const target = draggableRef.current;

        if (!target) throw new Error("Element with given id doesn't exist");

        const container = target.parentElement;
        if (!container) throw new Error("target element must have a parent");

        target.style.position = 'absolute';
        target.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
        const maxX = container.offsetWidth;
        const maxY = container.offsetHeight;

        const onMouseDown = (e: MouseEvent) => {
            if (disabled) return;
            lastClickPosition.current = { x: e.clientX, y: e.clientY };
            onDragStart?.(e, position);
            isClicked.current = true;
        }

        const onMouseUp = (e: MouseEvent) => {
            if (disabled) return;
            if (!isClicked.current) return;
            onDragEnd?.(e, position);
            isClicked.current = false;
        }

        const onMouseMove = (e: MouseEvent) => {
            if (disabled) return;
            if (!isClicked.current) return;

            const dx = e.clientX - lastClickPosition.current.x; 
            const dy = e.clientY - lastClickPosition.current.y;

            const pos = {
                x: position.current.x + dx,
                y: position.current.y + dy
            }

            if (pos.x < 0) pos.x = 0;
            if (pos.y < 0) pos.y = 0;
            if (pos.x + target.offsetWidth > maxX) pos.x = maxX - target.offsetWidth;
            if (pos.y + target.offsetHeight > maxY) pos.y = maxY - target.offsetHeight;

            position.current = pos;
            onDrag?.(e, position);
            lastClickPosition.current = { x: e.clientX, y: e.clientY };

            target.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }

        const fixMouseUpBug = (e: MouseEvent) => {
            if (disabled) return;
            if (isClicked.current) {
                isClicked.current = false;
            }
        }

        target.addEventListener('mousedown', onMouseDown);
        target.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseUp);
        container.addEventListener('mouseup', fixMouseUpBug);

        const cleanup = () => {
            target.removeEventListener('mousedown', onMouseDown);
            target.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
            container.removeEventListener('mouseup', fixMouseUpBug);
        }

        return cleanup;
    }, []);

    return (
        <div className="draggable-item-container" ref={draggableRef}>
            {children}
        </div>
    )
}

export default Draggable;