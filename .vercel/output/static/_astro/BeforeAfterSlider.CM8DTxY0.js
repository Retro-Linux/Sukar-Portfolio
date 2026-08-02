import{o as e,t}from"./react.Od-laFSK.js";import{t as n}from"./jsx-runtime.5oAs05S-.js";var r=e(t(),1),i=n();function a({beforeSrc:e,afterSrc:t,beforeAlt:n=`Process sketch`,afterAlt:a=`Final render`,beforeLabel:o=`Sketch`,afterLabel:s=`Final`,aspectRatio:c=`3/2`}){let l=(0,r.useRef)(null),[u,d]=(0,r.useState)(50),[f,p]=(0,r.useState)(!1),m=(0,r.useCallback)(e=>{let t=l.current;if(!t)return;let n=t.getBoundingClientRect(),r=e-n.left,i=Math.max(0,Math.min(100,r/n.width*100));d(i)},[]),h=(0,r.useCallback)(e=>{e.preventDefault(),e.currentTarget.setPointerCapture(e.pointerId),p(!0),m(e.clientX)},[m]),g=(0,r.useCallback)(e=>{f&&m(e.clientX)},[f,m]),_=(0,r.useCallback)(()=>{p(!1)},[]);return(0,i.jsxs)(`div`,{className:`ba-slider-wrapper`,children:[(0,i.jsxs)(`div`,{ref:l,className:`ba-slider${f?` ba-slider--dragging`:``}`,style:{aspectRatio:c},onPointerDown:h,onPointerMove:g,onPointerUp:_,onPointerCancel:_,onKeyDown:e=>{e.key===`ArrowLeft`||e.key===`ArrowDown`?(e.preventDefault(),d(e=>Math.max(0,e-5))):(e.key===`ArrowRight`||e.key===`ArrowUp`)&&(e.preventDefault(),d(e=>Math.min(100,e+5)))},role:`slider`,"aria-label":`Before and after comparison`,"aria-valuenow":Math.round(u),"aria-valuemin":0,"aria-valuemax":100,tabIndex:0,children:[(0,i.jsx)(`div`,{className:`ba-slider__layer ba-slider__after`,children:(0,i.jsx)(`img`,{src:t,alt:a,draggable:!1})}),(0,i.jsx)(`div`,{className:`ba-slider__layer ba-slider__before`,style:{clipPath:`inset(0 ${100-u}% 0 0)`},children:(0,i.jsx)(`img`,{src:e,alt:n,draggable:!1})}),(0,i.jsxs)(`div`,{className:`ba-slider__handle`,style:{left:`${u}%`},children:[(0,i.jsx)(`div`,{className:`ba-slider__handle-line`}),(0,i.jsx)(`div`,{className:`ba-slider__handle-grip`,children:(0,i.jsxs)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,children:[(0,i.jsx)(`path`,{d:`M8 5l-5 7 5 7`}),(0,i.jsx)(`path`,{d:`M16 5l5 7-5 7`})]})})]}),(0,i.jsx)(`span`,{className:`ba-slider__label ba-slider__label--before`,style:{opacity:+(u>12)},children:o}),(0,i.jsx)(`span`,{className:`ba-slider__label ba-slider__label--after`,style:{opacity:+(u<88)},children:s})]}),(0,i.jsx)(`style`,{children:`
        .ba-slider-wrapper {
          width: 100%;
        }
        .ba-slider {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 6px;
          cursor: ew-resize;
          user-select: none;
          touch-action: none;
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.06),
            0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .ba-slider--dragging {
          cursor: grabbing;
        }

        .ba-slider__layer {
          position: absolute;
          inset: 0;
        }

        .ba-slider__layer img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .ba-slider__after {
          z-index: 1;
        }

        .ba-slider__before {
          z-index: 2;
        }

        /* ── Handle ──────────────────── */
        .ba-slider__handle {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 3;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .ba-slider__handle-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #FFFFFF;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        }

        .ba-slider__handle-grip {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid #7ED4E6;
          color: #7ED4E6;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.12),
            0 0 0 4px rgba(126, 212, 230, 0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ba-slider--dragging .ba-slider__handle-grip {
          transform: scale(1.1);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.15),
            0 0 0 6px rgba(126, 212, 230, 0.25);
        }

        /* ── Labels ──────────────────── */
        .ba-slider__label {
          position: absolute;
          bottom: 1rem;
          z-index: 4;
          padding: 0.3rem 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FFFFFF;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 100px;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .ba-slider__label--before {
          left: 1rem;
        }

        .ba-slider__label--after {
          right: 1rem;
        }

        @media (max-width: 640px) {
          .ba-slider__handle-grip {
            width: 34px;
            height: 34px;
          }

          .ba-slider__label {
            font-size: 0.62rem;
            padding: 0.25rem 0.6rem;
          }
        }
      `})]})}export{a as default};