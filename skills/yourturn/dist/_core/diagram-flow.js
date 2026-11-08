import{jsxs as B,jsx as m}from"react/jsx-runtime";import{useRef as j,useState as F,useMemo as T,useLayoutEffect as W,createElement as q}from"react";import{Prose as Z}from"./yourturn.js";import"@json-render/react";import"zod";/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}],["path",{d:"M10 4v4"}],["path",{d:"M2 8h20"}],["path",{d:"M6 4v4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M4.929 4.929 19.07 19.071"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M12 5v16"}],["path",{d:"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M12 18V5"}],["path",{d:"M15 13a4.17 4.17 0 01-3-4 4.17 4.17 0 01-3 4"}],["path",{d:"M17.707 6.294A3 3 0 1012 5a3 3 0 10-5.707 1.294"}],["path",{d:"M17.996 5.125a4 4 0 012.526 5.77"}],["path",{d:"M18 18a4 4 0 002-7.465"}],["path",{d:"M19.967 17.482a4 4 0 11-7.967.517 4 4 0 11-7.967-.517"}],["path",{d:"M6 18a4 4 0 01-2-7.465"}],["path",{d:"M6.004 5.125a4 4 0 00-2.526 5.77"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"M12 20v-9"}],["path",{d:"M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"}],["path",{d:"M14.12 3.88 16 2"}],["path",{d:"M21 21a4 4 0 0 0-3.81-4"}],["path",{d:"M21 5a4 4 0 0 1-3.55 3.97"}],["path",{d:"M22 13h-4"}],["path",{d:"M3 21a4 4 0 0 1 3.81-4"}],["path",{d:"M3 5a4 4 0 0 0 3.55 3.97"}],["path",{d:"M6 13H2"}],["path",{d:"m8 2 1.88 1.88"}],["path",{d:"M9 7.13V6a3 3 0 1 1 6 0v1.13"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m16 9-5.5 5.5L8 12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m15 9-6 6"}],["path",{d:"m9 9 6 6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 6v6l4 2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=[["path",{d:"M11 10.27 7 3.34"}],["path",{d:"m11 13.73-4 6.93"}],["path",{d:"M12 22v-2"}],["path",{d:"M12 2v2"}],["path",{d:"M14 12h8"}],["path",{d:"m17 20.66-1-1.73"}],["path",{d:"m17 3.34-1 1.73"}],["path",{d:"M2 12h2"}],["path",{d:"m20.66 17-1.73-1"}],["path",{d:"m20.66 7-1.73 1"}],["path",{d:"m3.34 17 1.73-1"}],["path",{d:"m3.34 7 1.73 1"}],["circle",{cx:"12",cy:"12",r:"2"}],["circle",{cx:"12",cy:"12",r:"8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=[["path",{d:"M12 20v2"}],["path",{d:"M12 2v2"}],["path",{d:"M17 20v2"}],["path",{d:"M17 2v2"}],["path",{d:"M2 12h2"}],["path",{d:"M2 17h2"}],["path",{d:"M2 7h2"}],["path",{d:"M20 12h2"}],["path",{d:"M20 17h2"}],["path",{d:"M20 7h2"}],["path",{d:"M7 20v2"}],["path",{d:"M7 2v2"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h1=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5"}],["path",{d:"M3 12A9 3 0 0 0 21 12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=[["path",{d:"M10 21H2"}],["path",{d:"M10 3H7a2 2 0 00-2 2v16"}],["path",{d:"M14 12h.01"}],["path",{d:"M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z"}],["path",{d:"M22 21h-3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i1=[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p1=[["path",{d:"M15 6a9 9 0 0 0-9 9V3"}],["circle",{cx:"18",cy:"6",r:"3"}],["circle",{cx:"6",cy:"18",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}],["path",{d:"M2 12h20"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M1=[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y1=[["path",{d:"M10 16h.01"}],["path",{d:"M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}],["path",{d:"M21.946 12.013H2.054"}],["path",{d:"M6 16h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x1=[["path",{d:"M5 22h14"}],["path",{d:"M5 2h14"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u1=[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f1=[["path",{d:"m2 21 9.6-9.6"}],["path",{d:"m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19"}],["circle",{cx:"15.5",cy:"7.5",r:"5.5"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g1=[["path",{d:"M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"}],["path",{d:"M20.054 15.987H3.946"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v1=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w1=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $1=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b1=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k1=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z1=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L1=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A1=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"}],["path",{d:"M12 22V12"}],["polyline",{points:"3.29 7 12 12 20.71 7"}],["path",{d:"m7.5 4.27 9 5.15"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V1=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N1=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H1=[["path",{d:"M12 22v-5"}],["path",{d:"M15 8V2"}],["path",{d:"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"}],["path",{d:"M9 8V2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C1=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S1=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478"}],["circle",{cx:"12",cy:"12",r:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B1=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D1=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P1=[["path",{d:"M12 3v18"}],["path",{d:"m19 8 3 8a5 5 0 0 1-6 0zV7"}],["path",{d:"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"}],["path",{d:"m5 8 3 8a5 5 0 0 1-6 0zV7"}],["path",{d:"M7 21h10"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R1=[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E1=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{d:"m21.854 2.147-10.94 10.939"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O1=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j1=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F1=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z1=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2"}],["path",{d:"M12 18h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I1=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T1=[["path",{d:"M12 19h8"}],["path",{d:"m4 17 6-6-6-6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W1=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q1=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G1=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U1=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{cx:"9",cy:"7",r:"4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _1=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K1=[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]],X1={terminal:T1,plug:H1,server:O1,door:d1,package:A1,puzzle:C1,cog:o1,brain:Q,wrench:_1,shield:F1,book:K,scale:P1,palette:V1,monitor:L1,phone:Z1,laptop:g1,radio:S1,window:G,ban:U,file:l1,folder:i1,list:$1,hourglass:x1,play:N1,hand:M1,check:t1,cross:a1,warning:q1,user:G1,users:U1,globe:m1,database:h1,disk:y1,cloud:n1,lock:b1,key:f1,chat:z1,mail:k1,bell:_,bolt:K1,search:R1,branch:p1,code:c1,chip:s1,layers:v1,eye:r1,clock:e1,bot:X,sparkles:I1,settings:j1,inbox:u1,send:E1,refresh:B1,trash:W1,link:w1,box:J,bug:Y,rocket:D1};function J1(h){if(h.stack)return{rows:h.nodes.map(t=>[t.id]),forward:[],back:[]};const i=h.nodes.map(t=>t.id),u=new Set(i),k=h.edges.map((t,e)=>({edge:t,index:e})).filter(({edge:t})=>u.has(t.from)&&u.has(t.to)),R=new Map(i.map(t=>[t,k.filter(({edge:e})=>e.from===t)])),M=new Map,g=new Set;function H(t){M.set(t,"open");for(const{edge:e,index:c}of R.get(t)??[])M.get(e.to)==="open"?g.add(c):M.has(e.to)||H(e.to);M.set(t,"done")}for(const t of i)M.has(t)||H(t);const C=k.filter(({index:t})=>!g.has(t)),w=new Map(i.map(t=>[t,0]));for(let t=0;t<i.length;t++)for(const{edge:e}of C)w.set(e.to,Math.max(w.get(e.to),w.get(e.from)+1));const f=[];for(const t of i)(f[w.get(t)]??=[]).push(t);const D=C.map(({edge:t,index:e})=>{const c=[];for(let r=w.get(t.from)+1;r<w.get(t.to);r++){const p=`·${e}·${r}`;f[r].push(p),c.push(p)}return{edge:t,index:e,via:c}}),A=new Map(h.nodes.map(t=>[t.id,t.group??""])),V=new Map;for(const{edge:t,via:e}of D){const c=[t.from,...e,t.to];for(let r=0;r<c.length-1;r++)V.set(c[r],[...V.get(c[r])??[],c[r+1]]),V.set(c[r+1],[...V.get(c[r+1])??[],c[r]])}for(let t=0;t<4;t++){const e=t%2===0?f.map((c,r)=>r):f.map((c,r)=>f.length-1-r);for(const c of e){let r=function(l){const a=S.filter(n=>n.group===l);return a.reduce((n,s)=>n+s.w,0)/a.length};const p=new Map(f.flatMap((l,a)=>a===c?[]:l.map((n,s)=>[n,s/Math.max(1,l.length-1)]))),S=f[c].map((l,a)=>{const n=(V.get(l)??[]).filter(d=>p.has(d)),s=n.length>0?n.reduce((d,o)=>d+p.get(o),0)/n.length:a/Math.max(1,f[c].length-1);return{id:l,w:s,group:A.get(l)??""}});f[c]=S.map(l=>({...l,w:l.group?r(l.group):l.w})).sort((l,a)=>l.w-a.w||l.group.localeCompare(a.group)).map(({id:l})=>l)}}return{rows:f,forward:D,back:k.filter(({index:t})=>g.has(t))}}const Q1=4,O=10;function Y1(h){const i=h.down;function u(t){return h.boxes.get(t)}function k(t){return{x:t.p.x+t.dir.x*t.by,y:t.p.y+t.dir.y*t.by}}function R(t){const e=k({p:t.start,dir:t.startDir,by:Q1}),c=k({p:t.tip,dir:t.dir,by:2-O});return{a:e,z:k({p:t.tip,dir:t.dir,by:-14}),open:`M ${t.start.x} ${t.start.y} L ${e.x} ${e.y}`,close:`L ${c.x} ${c.y}`}}function M(t){return t.edge.label||h.steps.has(t.index)?{text:t.edge.label??null,...t.p}:null}const g=new Map;for(const{edge:t,index:e}of h.plan.forward)for(const c of[`${t.from}:out`,`${t.to}:in`])g.set(c,[...g.get(c)??[],e]);const H=new Map(h.plan.forward.map(({edge:t,index:e,via:c})=>[e,{out:c[0]??t.to,in:c.at(-1)??t.from}]));function C(t){return i?u(t).x+u(t).w/2:u(t).y+u(t).h/2}for(const[t,e]of g){const c=t.endsWith(":out")?"out":"in";e.sort((r,p)=>C(H.get(r)[c])-C(H.get(p)[c]))}function w(t){const e=u(t.id),c=g.get(`${t.id}:${t.side}`)??[t.index],p=.5+((c.indexOf(t.index)+1)/(c.length+1)-.5)*.6;return i?{x:e.x+e.w*p,y:t.side==="out"?e.y+e.h:e.y}:{x:t.side==="out"?e.x+e.w:e.x,y:e.y+e.h*p}}const f=i?{x:0,y:1}:{x:1,y:0},D=h.plan.forward.map(({edge:t,index:e,via:c})=>{const r=w({id:t.from,side:"out",index:e}),p=w({id:t.to,side:"in",index:e}),{a:S,z:l,open:a,close:n}=R({start:r,startDir:f,tip:p,dir:f}),s=[S,...c.map(o=>({x:u(o).x+u(o).w/2,y:u(o).y+u(o).h/2})),l],d=s.slice(1).map((o,x)=>{const $=s[x],N=i?(o.y-$.y)*.35:(o.x-$.x)*.35;return i?`C ${$.x} ${$.y+N}, ${o.x} ${o.y-N}, ${o.x} ${o.y}`:`C ${$.x+N} ${$.y}, ${o.x-N} ${o.y}, ${o.x} ${o.y}`});return{index:e,from:t.from,to:t.to,kind:t.kind??"flow",d:[a,...d,n].join(" "),tip:p,dir:f,step:h.steps.get(e)??null,label:M({edge:t,index:e,p:{x:(s[0].x+s[1].x)/2,y:(s[0].y+s[1].y)/2}})}}),A=i?h.width/2:h.height/2,V=h.plan.back.map(({edge:t,index:e})=>{const c=u(t.from),r=u(t.to),p=i?c.x+c.w/2<A:c.y+c.h/2<A;function S(E){const L=E.box;return i?{x:p?L.x:L.x+L.w,y:L.y+L.h*E.share}:{x:L.x+L.w*E.share,y:p?L.y:L.y+L.h}}const l=i?{x:p?-1:1,y:0}:{x:0,y:p?-1:1},a={x:-l.x,y:-l.y},n=t.from===t.to,s=S({box:c,share:n?.25:.5}),d=S({box:r,share:n?.75:.5}),{a:o,z:x,open:$,close:N}=R({start:s,startDir:l,tip:d,dir:a}),z=p?-32:32,v=i?(p?Math.min(o.x,x.x):Math.max(o.x,x.x))+z:(p?Math.min(o.y,x.y):Math.max(o.y,x.y))+z,y=i?{x:v,y:o.y}:{x:o.x,y:v},P=i?{x:v,y:x.y}:{x:x.x,y:v};return{index:e,from:t.from,to:t.to,kind:t.kind??"flow",d:`${$} C ${y.x} ${y.y}, ${P.x} ${P.y}, ${x.x} ${x.y} ${N}`,tip:d,dir:a,step:h.steps.get(e)??null,label:M({edge:t,index:e,p:{x:(o.x+3*y.x+3*P.x+x.x)/8,y:(o.y+3*y.y+3*P.y+x.y)/8}})}});return[...D,...V]}function o0(h){const i=j(null),u=j(new Map),[k,R]=F({arrows:[],zones:[]}),[M,g]=F({type:"none"}),H=h.direction!=="right",C=h.shape==="stack",w=h.edges??[],f=h.groups??[],D=T(()=>J1({nodes:h.nodes,edges:w,stack:C}),[h.nodes,h.edges,C]),A=new Map(h.nodes.map(a=>[a.id,a])),V=h.nodes.map(a=>a.id).filter((a,n,s)=>s.indexOf(a)!==n),t=[...new Set(w.flatMap(a=>[a.from,a.to]).filter(a=>!A.has(a)))],e=new Map(w.map((a,n)=>({edge:a,index:n})).filter(({edge:a})=>a.step).map(({index:a},n)=>[a,n+1]));W(()=>{function a(){const s=i.current;if(!s)return;const d=s.getBoundingClientRect(),o=new Map([...u.current].map(([z,v])=>{const y=v.getBoundingClientRect();return[z,{x:y.left-d.left,y:y.top-d.top,w:y.width,h:y.height}]})),x=f.flatMap(z=>{const v=h.nodes.filter(b=>b.group===z.id).map(b=>o.get(b.id));if(v.length===0)return[];const y=14,P=Math.min(...v.map(b=>b.x))-y,E=Math.min(...v.map(b=>b.y))-y-6,L=Math.max(...v.map(b=>b.x+b.w))+y-P,I=Math.max(...v.map(b=>b.y+b.h))+y-E;return[{group:z,box:{x:P,y:E,w:L,h:I}}]}),$=Y1({boxes:o,plan:D,down:H,steps:e,width:d.width,height:d.height}),N=x.map(z=>{const v=$.filter(y=>A.get(y.to)?.group===z.group.id&&A.get(y.from)?.group!==z.group.id).filter(y=>y.dir.y>0&&y.tip.y-z.box.y<40).map(y=>y.tip.x);return{...z,labelEnd:v.length>0?Math.min(...v)-14:null}});R({arrows:$,zones:N})}a();const n=new ResizeObserver(a);return n.observe(i.current),()=>n.disconnect()},[D,H,h.groups]);function c(a){return M.type==="none"||M.type==="node"&&(a.from===M.id||a.to===M.id)||M.type==="step"&&a.index===M.index}const r=new Set([...M.type==="node"?[M.id]:[],...k.arrows.filter(c).flatMap(a=>[a.from,a.to])]);function p(a){return M.type==="none"||r.has(a)}function S(a){return A.get(a)?.tone??""}function l(a){return n=>{n?u.current.set(a,n):u.current.delete(a)}}return B("figure",{className:`diagram ${M.type==="none"?"":"focused"}`,children:[h.title?m("figcaption",{className:"diagram-title",children:m(Z,{text:h.title})}):null,h.caption?m("p",{className:"diagram-caption",children:m(Z,{text:h.caption})}):null,B("div",{className:`diagram-frame ${C?"stack":H?"down":"right"} ${f.length>0?"grouped":""}`,ref:i,"data-sentence":"Diagram.","data-pause":Math.min(6e3,1e3+h.nodes.length*500),children:[k.zones.map(({group:a,box:n,labelEnd:s})=>m("div",{className:`diagram-zone ${a.tone??""}`,style:{left:n.x,top:n.y,width:n.w,height:n.h},children:m("span",{className:"diagram-zone-label",style:s===null?{left:18}:{right:n.x+n.w-s},children:a.label})},a.id)),m("svg",{className:"diagram-svg","aria-hidden":"true",children:k.arrows.map(a=>{const{tip:n,dir:s}=a,d={x:n.x-s.x*O,y:n.y-s.y*O},o={x:-s.y*5.5,y:s.x*5.5},x=a.kind==="never"?`M ${n.x-5} ${n.y-5} L ${n.x+5} ${n.y+5} M ${n.x+5} ${n.y-5} L ${n.x-5} ${n.y+5}`:`M ${n.x} ${n.y} L ${d.x+o.x} ${d.y+o.y} L ${d.x-o.x} ${d.y-o.y} Z`;return B("g",{className:`diagram-arrow ${a.kind} ${S(a.from)} ${c(a)?M.type==="none"?"":"lit":"dim"}`,children:[m("path",{d:a.d,className:"diagram-line"}),m("path",{d:a.d,className:"diagram-pulse"}),m("path",{d:x,className:"diagram-head"})]},a.index)})}),D.rows.map((a,n)=>m("div",{className:"diagram-row",children:a.map(s=>{const d=A.get(s);if(!d)return m("div",{className:"diagram-stop",ref:l(s)},s);const o=d.icon?X1[d.icon]:null;return B("div",{ref:l(s),className:`diagram-node ${d.tone??""} ${p(s)?"":"dim"}`,onPointerEnter:()=>g({type:"node",id:s}),onPointerLeave:()=>g({type:"none"}),children:[o?m("span",{className:"diagram-icon",children:m("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:o.map(([x,$],N)=>q(x,{key:N,...$}))})}):null,B("span",{className:"diagram-text",children:[m("span",{className:"diagram-label",children:d.label}),d.detail?m("span",{className:"diagram-detail",children:d.detail}):null]}),d.items&&d.items.length>0?m("span",{className:"diagram-items",children:d.items.map(x=>m("span",{className:"diagram-item",children:x},x))}):null]},s)})},n)),k.arrows.filter(a=>a.label).map(a=>B("span",{className:`diagram-edge-label ${a.kind} ${a.step?"numbered":""} ${c(a)?"":"dim"}`,style:{left:a.label.x,top:a.label.y},children:[a.step?m("b",{className:"diagram-badge",children:a.step}):null,a.label.text?m("span",{children:a.label.text}):null]},`${a.index}l`))]}),V.length>0?B("p",{className:"diagram-warning",children:["Duplicate box ids: ",V.join(", ")]}):null,t.length>0?B("p",{className:"diagram-warning",children:["Arrows point at missing boxes: ",t.join(", ")]}):null,e.size>0?m("ol",{className:"diagram-steps",children:[...e].map(([a,n])=>B("li",{tabIndex:0,className:M.type==="step"&&M.index===a?"lit":"",onPointerEnter:()=>g({type:"step",index:a}),onPointerLeave:()=>g({type:"none"}),onFocus:()=>g({type:"step",index:a}),onBlur:()=>g({type:"none"}),children:[m("b",{className:"diagram-badge",children:n}),m("span",{children:w[a].step})]},a))}):null]})}export{o0 as DiagramFlow,J1 as layout,Y1 as measure};
