import Split from 'react-split';
import React, { useEffect, useState } from 'react';

export default function MySplit({
    totalSize, gutterSize, direction, minSize = 0,
    splitPoints = [0, 25, 50, 75, 100],
    onDrag, children, collapsed }:
    {
        totalSize: number,
        gutterSize: number,
        direction: string,
        minSize?: number,
        splitPoints?: number[],
        onDrag: () => void,
        children: JSX.Element[],
        collapsed: boolean
    }) {

    const [splitSize, setSplitSize] = useState<number>(50)

    const split_max = (totalSize - gutterSize / 2) / totalSize * 100
    const split_min = (gutterSize / 2) / totalSize * 100

    const onDragEnd = (sizes: any) => (splitSize: number) => {
        const size = sizes[0]
        if (Math.abs(size - split_max) <= 0.1) {
            return 100
        }
        else if (Math.abs(size - split_min) <= 0.1) {
            return 0
        }
        else {
            const oldSize: number = splitSize
            const down = size <= oldSize
            const newSize = down ?
                splitPoints.reduce((last, current) => current <= size ? current : last) :
                splitPoints.reduceRight((last, current) => current >= size ? current : last)
            return newSize
        }
    }

    useEffect(() => {
        if (collapsed && direction === 'vertical') {
            setSplitSize(0)
        }
    }, [collapsed])

    useEffect(onDrag, [splitSize])

    return (
        <Split
            sizes={[splitSize, 100 - splitSize]}
            className='full-size'
            onDragEnd={(sizes: any) => setSplitSize(onDragEnd(sizes))}
            direction={direction}
            gutterSize={gutterSize}
            minSize={minSize}
        >
            <div className='split full-size'>
                {children[0]}
            </div>
            <div className='split full-size'>
                {children[1]}
            </div>
        </Split>
    )
}