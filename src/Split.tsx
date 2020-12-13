import { useAsyncReference } from './Util'
import Split from 'react-split';
import React from 'react';

export default function MySplit({
    totalSize, gutterSize, direction, minSize = 0, splitPoints = [0, 25, 50, 75, 100], onDrag, children }:
    {
        totalSize: number,
        gutterSize: number,
        direction: string,
        minSize?: number,
        splitPoints?: number[],
        onDrag: () => void,
        children: JSX.Element[]
    }) {

    const [splitSize, setSplitSize] = useAsyncReference<number>(50)

    const split_max = (totalSize - gutterSize / 2) / totalSize * 100
    const split_min = (gutterSize / 2) / totalSize * 100

    const onDragEnd = (sizes: any) => {
        const size = sizes[0]
        if (Math.abs(size - split_max) <= 0.1) {
            setSplitSize(100)
        }
        else if (Math.abs(size - split_min) <= 0.1) {
            setSplitSize(0)
        }
        else {
            const old_size: number = splitSize.current
            const down = size <= old_size
            const newSize = down ?
                splitPoints.reduce((last, current) => current <= size ? current : last) :
                splitPoints.reduceRight((last, current) => current >= size ? current : last)
            setSplitSize(newSize)
        }
        onDrag()
    }

    return (
        <Split
            sizes={[splitSize.current, 100 - splitSize.current]}
            className='full-size'
            onDragEnd={onDragEnd}
            direction={direction}
            gutterSize={gutterSize}
            minSize={minSize}
        >
            <div className='split full-size'>
                {children[0]}
            </div>
            <div className={'split full-size'}>
                {children[1]}
            </div>
        </Split>
    )
}