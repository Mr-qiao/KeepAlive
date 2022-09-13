import React, { useRef } from 'react'

import CacheContext from './CacheContext'
import { KeepOutlets } from './keepOutlets'
import { IKeepElementRef, IProps } from './type'

const KeepAlive = (props: React.PropsWithChildren<IProps>) => {
	const { activeName, include = [], maxLen = 10 } = props
	const keepElements = useRef<{ string: IKeepElementRef }>({} as { string: IKeepElementRef })

	// 清楚缓存
	function dropByCacheKey(path: string) {
		;(keepElements.current as any)[path] = {} as IKeepElementRef
	}
	return (
		<CacheContext.Provider value={{ activeName, keepElements, dropByCacheKey, include, maxLen }}>
			{props.children}
			<KeepOutlets />
		</CacheContext.Provider>
	)
}

export default KeepAlive
