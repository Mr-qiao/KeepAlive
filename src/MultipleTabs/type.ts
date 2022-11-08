import React, { ReactNode, RefObject } from 'react'

export interface IProps {
	className?: string
	include?: string[]
	exclude?: string[]
	maxLen?: number
}
export interface IKeepElementRef {
	element: ReactNode
	scrolls: number
	isKeep: boolean
}

export interface ComponentReactElement {
	children?: ReactNode | ReactNode[]
}
export interface IComponentProps extends ComponentReactElement {
	className: string
	active: boolean
	name: string
	renderDiv: RefObject<HTMLDivElement>
	scrolls: number
	handleScroll: (path: string, event: Event) => void
}
export interface IContext {
	dropByCacheKey: (path: string) => void
	keepElements: React.MutableRefObject<Record<string, IKeepElementRef>>
	className?: string
	include: string[]
	exclude: string[]
	maxLen?: number
}
