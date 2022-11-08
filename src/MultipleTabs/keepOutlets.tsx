import React, {
	memo,
	useCallback, // useCallback,
	useContext,
	useEffect, // useEffect,
	useRef, // useState
	useState
} from 'react'

import { createPortal } from 'react-dom'
import { Outlet, useLocation, useOutlet } from 'react-router-dom'

import CacheContext from './CacheContext'

import { IComponentProps } from './type'

/**
 * 缓存组件状态
 * @param include 需要缓存的路由 例子：['/home', '/user/*']
 * @param exclude  不需要缓存的路由
 * @param path 当前路由
 * @returns
 */

function isKeepPath(include: string[], exclude: string[], path: string) {
	let isKeep = false
	if (!!include.length && !!exclude.length) return true
	if (!include.length) {
		include?.some(item => {
			if (item.split('/*').length === 1 && item === path) {
				isKeep = true
			} else if (item.split('/*').length > 1) {
				isKeep = item.split('/*').every(route => {
					return path.includes(route)
				})
			}
			return isKeep
		})
	}
	if (!exclude.length) {
		if (exclude.includes(path)) return false
	}
	isKeep = true
	return isKeep
}

/**
 *
 * @param
 * @returns
 */
function Component({
	className,
	active,
	children,
	name,
	renderDiv,
	handleScroll,
	scrolls
}: IComponentProps) {
	const [targetElement] = useState(() => document.createElement('div'))
	const activatedRef = useRef(false)
	activatedRef.current = activatedRef.current || active
	useEffect(() => {
		const onScroll = handleScroll.bind(null, location.pathname)
		if (active) {
			renderDiv.current?.appendChild(targetElement)
			// eslint-disable-next-line no-undef
			;(targetElement.childNodes as NodeListOf<HTMLElement>).forEach(
				dom => (dom.scrollTop = scrolls)
			)
			targetElement.addEventListener('scroll', onScroll, true) // 监听捕获阶段
		} else {
			try {
				renderDiv.current?.removeChild(targetElement)
				targetElement.removeEventListener('scroll', onScroll)
			} catch (event) {}
		}
		return () => {
			targetElement.removeEventListener('scroll', onScroll)
		}
	}, [active, name, renderDiv, targetElement, handleScroll])
	useEffect(() => {
		targetElement.setAttribute('id', name)
		targetElement.setAttribute('class', className)
	}, [name, targetElement])
	return <>{activatedRef.current && createPortal(children, targetElement)}</>
}

export const KeepOutlets = memo(function KeepOutlets() {
	const { className, include, exclude, keepElements } = useContext(CacheContext)
	const containerRef = useRef<HTMLDivElement>(null)
	const location = useLocation()
	// 是否需要缓存
	const isKeep = isKeepPath(include, exclude, location.pathname)
	const element = useOutlet()
	const obj = {
		element,
		isKeep,
		scrolls: keepElements.current[location.pathname]?.scrolls
	}
	keepElements.current[location.pathname] = obj

	const handleScroll = useCallback(
		(path: string, event: Event) => {
			if (keepElements.current[path]) {
				const target: HTMLElement = event.target as HTMLElement
				keepElements.current[path].scrolls = target.scrollTop
			}
		},
		[element]
	)
	return (
		<>
			<div ref={containerRef} className={`keep-alive ${className}`} />
			{Object.entries(keepElements?.current)?.map(([pathname, ele]) => {
				return (
					<Component
						className={className || ''}
						scrolls={isKeep ? ele.scrolls : 0}
						renderDiv={containerRef}
						name={pathname}
						key={pathname}
						active={pathname === location.pathname}
						handleScroll={handleScroll}
					>
						{ele.isKeep ? ele.element : <Outlet />}
					</Component>
				)
			})}
		</>
	)
})
