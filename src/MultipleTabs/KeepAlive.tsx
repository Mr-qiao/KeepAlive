import React, { useRef } from 'react'

import CacheContext from './CacheContext'
import { KeepOutlets } from './keepOutlets'
import { IKeepElementRef, IProps } from './type'

/**
 * 缓存组件状态
 * @param {IProps} props
 * include: 需要缓存的路由 例子：['/home', '/user/*']
 * exclude: 不需要缓存的路由
 * children: 子组件
 * @returns
 */

const KeepAlive = (props: React.PropsWithChildren<IProps>) => {
	const { className, include = [], exclude = [], maxLen = 10 } = props
	const keepElements = useRef<Record<string, IKeepElementRef>>(
		{} as Record<string, IKeepElementRef>
	)

	// 清楚缓存
	function dropByCacheKey(path: string) {
		;(keepElements.current as Record<string, unknown>)[path] =
			{} as IKeepElementRef
	}
	return (
		<CacheContext.Provider
			value={{
				keepElements,
				dropByCacheKey,
				className,
				include,
				exclude,
				maxLen
			}}
		>
			{props.children}
			<KeepOutlets />
		</CacheContext.Provider>
	)
}

export default KeepAlive
