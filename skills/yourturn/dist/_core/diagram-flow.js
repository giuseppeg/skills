import{jsxs as B,jsx as m}from"react/jsx-runtime";import{useRef as q,useState as I,useMemo as K,useLayoutEffect as X,createElement as J}from"react";import{Prose as G}from"./yourturn.js";import"@json-render/react";import"zod";/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}],["path",{d:"M10 4v4"}],["path",{d:"M2 8h20"}],["path",{d:"M6 4v4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M4.929 4.929 19.07 19.071"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a1=[["path",{d:"M12 5v16"}],["path",{d:"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=[["path",{d:"M12 8V4H8"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2"}],["path",{d:"M2 14h2"}],["path",{d:"M20 14h2"}],["path",{d:"M15 13v2"}],["path",{d:"M9 13v2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=[["path",{d:"M12 18V5"}],["path",{d:"M15 13a4.17 4.17 0 01-3-4 4.17 4.17 0 01-3 4"}],["path",{d:"M17.707 6.294A3 3 0 1012 5a3 3 0 10-5.707 1.294"}],["path",{d:"M17.996 5.125a4 4 0 012.526 5.77"}],["path",{d:"M18 18a4 4 0 002-7.465"}],["path",{d:"M19.967 17.482a4 4 0 11-7.967.517 4 4 0 11-7.967-.517"}],["path",{d:"M6 18a4 4 0 01-2-7.465"}],["path",{d:"M6.004 5.125a4 4 0 00-2.526 5.77"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=[["path",{d:"M12 20v-9"}],["path",{d:"M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"}],["path",{d:"M14.12 3.88 16 2"}],["path",{d:"M21 21a4 4 0 0 0-3.81-4"}],["path",{d:"M21 5a4 4 0 0 1-3.55 3.97"}],["path",{d:"M22 13h-4"}],["path",{d:"M3 21a4 4 0 0 1 3.81-4"}],["path",{d:"M3 5a4 4 0 0 0 3.55 3.97"}],["path",{d:"M6 13H2"}],["path",{d:"m8 2 1.88 1.88"}],["path",{d:"M9 7.13V6a3 3 0 1 1 6 0v1.13"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m16 9-5.5 5.5L8 12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m15 9-6 6"}],["path",{d:"m9 9 6 6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 6v6l4 2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h1=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i1=[["path",{d:"M11 10.27 7 3.34"}],["path",{d:"m11 13.73-4 6.93"}],["path",{d:"M12 22v-2"}],["path",{d:"M12 2v2"}],["path",{d:"M14 12h8"}],["path",{d:"m17 20.66-1-1.73"}],["path",{d:"m17 3.34-1 1.73"}],["path",{d:"M2 12h2"}],["path",{d:"m20.66 17-1.73-1"}],["path",{d:"m20.66 7-1.73 1"}],["path",{d:"m3.34 17 1.73-1"}],["path",{d:"m3.34 7 1.73 1"}],["circle",{cx:"12",cy:"12",r:"2"}],["circle",{cx:"12",cy:"12",r:"8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p1=[["path",{d:"M12 20v2"}],["path",{d:"M12 2v2"}],["path",{d:"M17 20v2"}],["path",{d:"M17 2v2"}],["path",{d:"M2 12h2"}],["path",{d:"M2 17h2"}],["path",{d:"M2 7h2"}],["path",{d:"M20 12h2"}],["path",{d:"M20 17h2"}],["path",{d:"M20 7h2"}],["path",{d:"M7 20v2"}],["path",{d:"M7 2v2"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m1=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5"}],["path",{d:"M3 12A9 3 0 0 0 21 12"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M1=[["path",{d:"M10 21H2"}],["path",{d:"M10 3H7a2 2 0 00-2 2v16"}],["path",{d:"M14 12h.01"}],["path",{d:"M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z"}],["path",{d:"M22 21h-3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x1=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y1=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u1=[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f1=[["path",{d:"M15 6a9 9 0 0 0-9 9V3"}],["circle",{cx:"18",cy:"6",r:"3"}],["circle",{cx:"6",cy:"18",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g1=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"}],["path",{d:"M2 12h20"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v1=[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w1=[["path",{d:"M10 16h.01"}],["path",{d:"M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}],["path",{d:"M21.946 12.013H2.054"}],["path",{d:"M6 16h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b1=[["path",{d:"M5 22h14"}],["path",{d:"M5 2h14"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $1=[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k1=[["path",{d:"m2 21 9.6-9.6"}],["path",{d:"m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19"}],["circle",{cx:"15.5",cy:"7.5",r:"5.5"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L1=[["path",{d:"M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"}],["path",{d:"M20.054 15.987H3.946"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z1=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N1=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A1=[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V1=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C1=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H1=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S1=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R1=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"}],["path",{d:"M12 22V12"}],["polyline",{points:"3.29 7 12 12 20.71 7"}],["path",{d:"m7.5 4.27 9 5.15"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B1=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D1=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P1=[["path",{d:"M12 22v-5"}],["path",{d:"M15 8V2"}],["path",{d:"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"}],["path",{d:"M9 8V2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E1=[["path",{d:"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W1=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478"}],["circle",{cx:"12",cy:"12",r:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O1=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j1=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F1=[["path",{d:"M12 3v18"}],["path",{d:"m19 8 3 8a5 5 0 0 1-6 0zV7"}],["path",{d:"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"}],["path",{d:"m5 8 3 8a5 5 0 0 1-6 0zV7"}],["path",{d:"M7 21h10"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T1=[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z1=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{d:"m21.854 2.147-10.94 10.939"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I1=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _1=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q1=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G1=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2"}],["path",{d:"M12 18h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U1=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K1=[["path",{d:"M12 19h8"}],["path",{d:"m4 17 6-6-6-6"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X1=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J1=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q1=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y1=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{cx:"9",cy:"7",r:"4"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"}]];/**
 * @license lucide v1.65.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]],et={terminal:K1,plug:P1,server:I1,door:M1,package:R1,puzzle:E1,cog:i1,brain:o1,wrench:tt,shield:q1,book:a1,scale:F1,palette:B1,monitor:S1,phone:G1,laptop:L1,radio:W1,window:Q,ban:Y,file:y1,folder:u1,list:A1,hourglass:b1,play:D1,hand:v1,check:s1,cross:l1,warning:J1,user:Q1,users:Y1,globe:g1,database:m1,disk:w1,cloud:h1,lock:V1,key:k1,chat:H1,mail:C1,bell:t1,bolt:at,search:T1,branch:f1,code:d1,chip:p1,layers:z1,eye:x1,clock:r1,bot:e1,sparkles:U1,settings:_1,inbox:$1,send:Z1,refresh:O1,trash:X1,link:N1,box:n1,bug:c1,rocket:j1};function nt(l){if(l.stack)return{rows:l.nodes.map(a=>[a.id]),forward:[],back:[]};const f=l.nodes.map(a=>a.id),$=new Set(f),H=l.edges.map((a,h)=>({edge:a,index:h})).filter(({edge:a})=>$.has(a.from)&&$.has(a.to)),j=new Map(f.map(a=>[a,H.filter(({edge:h})=>h.from===a)])),x=new Map,k=new Set;function S(a){x.set(a,"open");for(const{edge:h,index:c}of j.get(a)??[])x.get(h.to)==="open"?k.add(c):x.has(h.to)||S(h.to);x.set(a,"done")}for(const a of f)x.has(a)||S(a);const E=H.filter(({index:a})=>!k.has(a)),w=new Map(f.map(a=>[a,0]));for(let a=0;a<f.length;a++)for(const{edge:h}of E)w.set(h.to,Math.max(w.get(h.to),w.get(h.from)+1));const g=[];for(const a of f)(g[w.get(a)]??=[]).push(a);const W=E.map(({edge:a,index:h})=>{const c=[];for(let s=w.get(a.from)+1;s<w.get(a.to);s++){const z=`·${h}·${s}`;g[s].push(z),c.push(z)}return{edge:a,index:h,via:c}}),O=new Map(l.nodes.map(a=>[a.id,a.group??""])),e=new Map;for(const{edge:a,via:h}of W){const c=[a.from,...h,a.to];for(let s=0;s<c.length-1;s++)e.set(c[s],[...e.get(c[s])??[],c[s+1]]),e.set(c[s+1],[...e.get(c[s+1])??[],c[s]])}for(let a=0;a<4;a++){const h=a%2===0?g.map((c,s)=>s):g.map((c,s)=>g.length-1-s);for(const c of h){let s=function(p){const y=D.filter(b=>b.group===p);return y.reduce((b,i)=>b+i.w,0)/y.length};const z=new Map(g.flatMap((p,y)=>y===c?[]:p.map((b,i)=>[b,i/Math.max(1,p.length-1)]))),D=g[c].map((p,y)=>{const b=(e.get(p)??[]).filter(r=>z.has(r)),i=b.length>0?b.reduce((r,N)=>r+z.get(N),0)/b.length:y/Math.max(1,g[c].length-1);return{id:p,w:i,group:O.get(p)??""}});g[c]=D.map(p=>({...p,w:p.group?s(p.group):p.w})).sort((p,y)=>p.w-y.w||p.group.localeCompare(y.group)).map(({id:p})=>p)}}const n=H.filter(({index:a})=>k.has(a)).map(({edge:a,index:h})=>{const c=g[w.get(a.from)],s=c.indexOf(a.from)-(c.length-1)/2;return{edge:a,index:h,low:s<0||s===0&&!l.down}});return{rows:g,forward:W,back:n}}const ot=4,_=10;function ct(l){const f=l.down;function $(e){return l.boxes.get(e)}function H(e){return{x:e.p.x+e.dir.x*e.by,y:e.p.y+e.dir.y*e.by}}function j(e){const n=H({p:e.start,dir:e.startDir,by:ot}),a=H({p:e.tip,dir:e.dir,by:2-_});return{a:n,z:H({p:e.tip,dir:e.dir,by:-14}),open:`M ${e.start.x} ${e.start.y} L ${n.x} ${n.y}`,close:`L ${a.x} ${a.y}`}}function x(e){return e.edge.label||l.steps.has(e.index)?{text:e.edge.label??null,...e.p}:null}const k=new Map;for(const{edge:e,index:n}of l.plan.forward)for(const a of[`${e.from}:out`,`${e.to}:in`])k.set(a,[...k.get(a)??[],n]);const S=new Map(l.plan.forward.map(({edge:e,index:n,via:a})=>[n,{out:a[0]??e.to,in:a.at(-1)??e.from}]));function E(e){return f?$(e).x+$(e).w/2:$(e).y+$(e).h/2}for(const[e,n]of k){const a=e.endsWith(":out")?"out":"in";n.sort((h,c)=>E(S.get(h)[a])-E(S.get(c)[a]))}function w(e){const n=$(e.id),a=k.get(`${e.id}:${e.side}`)??[e.index],c=.5+((a.indexOf(e.index)+1)/(a.length+1)-.5)*.6;return f?{x:n.x+n.w*c,y:e.side==="out"?n.y+n.h:n.y}:{x:e.side==="out"?n.x+n.w:n.x,y:n.y+n.h*c}}const g=f?{x:0,y:1}:{x:1,y:0},W=l.plan.forward.map(({edge:e,index:n,via:a})=>{const h=w({id:e.from,side:"out",index:n}),c=w({id:e.to,side:"in",index:n}),{a:s,z,open:D,close:p}=j({start:h,startDir:g,tip:c,dir:g}),y=[s,...a.flatMap(i=>{const r=$(i);return f?[{x:r.x+r.w/2,y:r.y},{x:r.x+r.w/2,y:r.y+r.h}]:[{x:r.x,y:r.y+r.h/2},{x:r.x+r.w,y:r.y+r.h/2}]}),z],b=y.slice(1).map((i,r)=>{const N=y[r],t=f?(i.y-N.y)*.35:(i.x-N.x)*.35;return f?`C ${N.x} ${N.y+t}, ${i.x} ${i.y-t}, ${i.x} ${i.y}`:`C ${N.x+t} ${N.y}, ${i.x-t} ${i.y}, ${i.x} ${i.y}`});return{index:n,from:e.from,to:e.to,kind:e.kind??"flow",d:[D,...b,p].join(" "),tip:c,dir:g,step:l.steps.get(n)??null,label:x({edge:e,index:n,p:{x:(y[0].x+y[1].x)/2,y:(y[0].y+y[1].y)/2}})}}),O=l.plan.back.map(({edge:e,index:n,low:a})=>{const h=$(e.from),c=$(e.to);function s(R){const v=R.box;return f?{x:a?v.x:v.x+v.w,y:v.y+v.h*R.share}:{x:v.x+v.w*R.share,y:a?v.y:v.y+v.h}}const z=f?{x:a?-1:1,y:0}:{x:0,y:a?-1:1},D={x:-z.x,y:-z.y},p=e.from===e.to,y=s({box:h,share:p?.25:.5}),b=s({box:c,share:p?.75:.5}),{a:i,z:r,open:N,close:t}=j({start:y,startDir:z,tip:b,dir:D}),o=a?-32:32,d=f?(a?Math.min(i.x,r.x):Math.max(i.x,r.x))+o:(a?Math.min(i.y,r.y):Math.max(i.y,r.y))+o,u=f?{x:d,y:i.y}:{x:i.x,y:d},M=f?{x:d,y:r.y}:{x:r.x,y:d};return{index:n,from:e.from,to:e.to,kind:e.kind??"flow",d:`${N} C ${u.x} ${u.y}, ${M.x} ${M.y}, ${r.x} ${r.y} ${t}`,tip:b,dir:D,step:l.steps.get(n)??null,label:x({edge:e,index:n,p:{x:(i.x+3*u.x+3*M.x+r.x)/8,y:(i.y+3*u.y+3*M.y+r.y)/8}})}});return[...W,...O]}function it(l){const f=q(null),$=q(new Map),[H,j]=I({arrows:[],zones:[]}),[x,k]=I({type:"none"}),[S,E]=I(null),w=l.direction!=="right"||S!==null,g=l.shape==="stack",W=!w&&!g,O=l.edges??[],e=l.groups??[],n=K(()=>nt({nodes:l.nodes,edges:O,stack:g,down:w}),[l.nodes,l.edges,g,w]),a=new Map(l.nodes.map(t=>[t.id,t])),h=l.nodes.map(t=>t.id).filter((t,o,d)=>d.indexOf(t)!==o),c=[...new Set(O.flatMap(t=>[t.from,t.to]).filter(t=>!a.has(t)))],s=new Map(O.map((t,o)=>({edge:t,index:o})).filter(({edge:t})=>t.step).map(({index:t},o)=>[t,o+1])),z=Math.max(...n.rows.map(t=>t.length)),D={gridTemplateColumns:n.rows.map(()=>"minmax(120px, max-content)").join(" minmax(var(--rank-gap), auto) "),gridTemplateRows:`repeat(${2*z}, 1fr)`};function p(t){return W?{gridColumn:2*t.r+1,gridRow:`${1+z-n.rows[t.r].length+2*t.x} / span 2`}:void 0}X(()=>{const t=f.current;function o(){const u=t.getBoundingClientRect(),M=new Map([...$.current].map(([L,A])=>{const V=A.getBoundingClientRect();return[L,{x:V.left-u.left,y:V.top-u.top,w:V.width,h:V.height}]}));if(l.direction==="right"&&!g){const L=Math.max(...[...M.values()].map(A=>A.x+A.w))-(t.clientWidth-parseFloat(getComputedStyle(t).paddingRight));if(S===null&&L>1){E(t.clientWidth+L);return}if(S!==null&&t.clientWidth>=S){E(null);return}}const R=e.flatMap(L=>{const A=l.nodes.filter(C=>C.group===L.id).map(C=>M.get(C.id));if(A.length===0)return[];const V=14,F=Math.min(...A.map(C=>C.x))-V,T=Math.min(...A.map(C=>C.y))-V-6,P=Math.max(...A.map(C=>C.x+C.w))+V-F,U=Math.max(...A.map(C=>C.y+C.h))+V-T;return[{group:L,box:{x:F,y:T,w:P,h:U}}]}),v=ct({boxes:M,plan:n,down:w,steps:s}),Z=R.map(L=>{const A=v.filter(P=>a.get(P.to)?.group===L.group.id&&a.get(P.from)?.group!==L.group.id).filter(P=>P.dir.y>0&&P.tip.y-L.box.y<40).map(P=>P.tip.x),V=A.length>0?Math.min(...A)-14:null,{x:F,w:T}=L.box;return{...L,name:V===null?{left:18,maxWidth:t.clientWidth-F-18}:{right:F+T-V,maxWidth:V}}});j({arrows:v,zones:Z})}o();const d=new ResizeObserver(o);return d.observe(t),t.addEventListener("scroll",o,{capture:!0}),()=>{d.disconnect(),t.removeEventListener("scroll",o,{capture:!0})}},[n,w,S,l.groups]);function y(t){return x.type==="none"||x.type==="node"&&(t.from===x.id||t.to===x.id)||x.type==="step"&&t.index===x.index}const b=new Set([...x.type==="node"?[x.id]:[],...H.arrows.filter(y).flatMap(t=>[t.from,t.to])]);function i(t){return x.type==="none"||b.has(t)}function r(t){return a.get(t)?.tone??""}function N(t){return o=>{o?$.current.set(t,o):$.current.delete(t)}}return B("figure",{className:`diagram ${x.type==="none"?"":"focused"}`,children:[l.title?m("figcaption",{className:"diagram-title",children:m(G,{text:l.title})}):null,l.caption?m("p",{className:"diagram-caption",children:m(G,{text:l.caption})}):null,B("div",{className:["diagram-frame",g?"stack":w?"down":"right",e.length>0?"grouped":"",n.back.some(t=>t.low)?"loop-low":"",n.back.some(t=>!t.low)?"loop-high":""].join(" "),style:W?D:void 0,ref:f,"data-sentence":"Diagram.","data-pause":Math.min(6e3,1e3+l.nodes.length*500),children:[H.zones.map(({group:t,box:o,name:d})=>m("div",{className:`diagram-zone ${t.tone??""}`,style:{left:o.x,top:o.y,width:o.w,height:o.h},children:m("span",{className:"diagram-zone-label",style:d,children:t.label})},t.id)),m("svg",{className:"diagram-svg","aria-hidden":"true",children:H.arrows.map(t=>{const{tip:o,dir:d}=t,u={x:o.x-d.x*_,y:o.y-d.y*_},M={x:-d.y*5.5,y:d.x*5.5},R=t.kind==="never"?`M ${o.x-5} ${o.y-5} L ${o.x+5} ${o.y+5} M ${o.x+5} ${o.y-5} L ${o.x-5} ${o.y+5}`:`M ${o.x} ${o.y} L ${u.x+M.x} ${u.y+M.y} L ${u.x-M.x} ${u.y-M.y} Z`;return B("g",{className:`diagram-arrow ${t.kind} ${r(t.from)} ${y(t)?x.type==="none"?"":"lit":"dim"}`,children:[m("path",{d:t.d,className:"diagram-line"}),m("path",{d:t.d,className:"diagram-pulse"}),m("path",{d:R,className:"diagram-head"})]},t.index)})}),W?n.rows.slice(1).map((t,o)=>m("span",{className:"diagram-gap",style:{gridColumn:2*o+2,gridRow:1},"aria-hidden":"true",children:n.forward.filter(({edge:d,index:u})=>n.rows[o].includes(d.from)&&(d.label||s.has(u))).map(({edge:d,index:u})=>B("span",{className:`diagram-edge-label ${s.has(u)?"numbered":""}`,children:[s.has(u)?m("b",{className:"diagram-badge",children:s.get(u)}):null,d.label?m("span",{children:d.label}):null]},u))},`gap${o}`)):null,n.rows.map((t,o)=>m("div",{className:"diagram-row",children:t.map((d,u)=>{const M=a.get(d);if(!M)return m("div",{className:"diagram-stop",ref:N(d),style:p({r:o,x:u})},d);const R=M.icon?et[M.icon]:null;return B("div",{ref:N(d),style:p({r:o,x:u}),className:`diagram-node ${M.tone??""} ${i(d)?"":"dim"}`,onPointerEnter:()=>k({type:"node",id:d}),onPointerLeave:()=>k({type:"none"}),children:[R?m("span",{className:"diagram-icon",children:m("svg",{viewBox:"0 0 24 24","aria-hidden":"true",children:R.map(([v,Z],L)=>J(v,{key:L,...Z}))})}):null,B("span",{className:"diagram-text",children:[m("span",{className:"diagram-label",children:M.label}),M.detail?m("span",{className:"diagram-detail",children:M.detail}):null]}),M.items&&M.items.length>0?m("span",{className:"diagram-items",children:M.items.map(v=>m("span",{className:"diagram-item",children:v},v))}):null]},d)})},o)),H.arrows.filter(t=>t.label).map(t=>B("span",{className:`diagram-edge-label ${t.kind} ${t.step?"numbered":""} ${y(t)?"":"dim"}`,style:{left:t.label.x,top:t.label.y},children:[t.step?m("b",{className:"diagram-badge",children:t.step}):null,t.label.text?m("span",{children:t.label.text}):null]},`${t.index}l`))]}),h.length>0?B("p",{className:"diagram-warning",children:["Duplicate box ids: ",h.join(", ")]}):null,c.length>0?B("p",{className:"diagram-warning",children:["Arrows point at missing boxes: ",c.join(", ")]}):null,s.size>0?m("ol",{className:"diagram-steps",children:[...s].map(([t,o])=>B("li",{tabIndex:0,className:x.type==="step"&&x.index===t?"lit":"",onPointerEnter:()=>k({type:"step",index:t}),onPointerLeave:()=>k({type:"none"}),onFocus:()=>k({type:"step",index:t}),onBlur:()=>k({type:"none"}),children:[m("b",{className:"diagram-badge",children:o}),m("span",{children:O[t].step})]},t))}):null]})}export{it as DiagramFlow,nt as layout,ct as measure};
