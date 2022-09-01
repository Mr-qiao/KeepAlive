import * as cacheType from "./cacheType";
/**
 *
 * @param state 缓存状态
 * @param action  改变状态的方法
 */
function cacheReducer(cacheState: any, action: any) {
  let payload = action.payload;
  let cacheId = payload.cacheId;
  switch (action.type) {
    case cacheType.CREATE:
      return {
        ...cacheState,
        [cacheId]: {
          cacheId: cacheId, // 缓存 ID
          reactElement: payload.reactElement, // 要渲染的虚拟 DOM
          doms: undefined, // 此虚拟 DOM 对应的真实 DOM
          status: cacheType.CREATE, // 缓存的状态是创建
          scrolls: {}, // 滚动信息保存对象，默认为是key 滚动的 DOM 值是滚动的位置
        },
      };
    // 表示真实 DOM 已经成功创建
    case cacheType.CREATED:
      return {
        ...cacheState,
        [cacheId]: {
          ...cacheState[cacheId],
          doms: payload.doms, // 真实 DOM
          status: cacheType.CREATED, // 缓存的状态是创建
        },
      };

    case cacheType.DESTROY:
      return {
        ...cacheState,
        [cacheId]: {
          ...cacheState[cacheId],
          status: cacheType.DESTROY, // 缓存的状态是销毁
        },
      };
    default:
      return cacheState;
  }
}

export default cacheReducer;
