import{o as e,t}from"./react.Od-laFSK.js";import{t as n}from"./jsx-runtime.5oAs05S-.js";var r=e(t(),1),i=n(),a=[{value:`#000000`,label:`Black`},{value:`#7ED4E6`,label:`Ice Blue`},{value:`#E74C3C`,label:`Crimson`},{value:`#F39C12`,label:`Amber`},{value:`#2ECC71`,label:`Emerald`},{value:`#8E44AD`,label:`Amethyst`}],o=[{value:2,label:`Fine`},{value:5,label:`Medium`},{value:10,label:`Broad`}];function s(){let e=(0,r.useRef)(null),t=(0,r.useRef)(null),n=(0,r.useRef)(!1),s=(0,r.useRef)(null),c=(0,r.useRef)([]),l=(0,r.useRef)(!1),[u,d]=(0,r.useState)(`#000000`),[f,p]=(0,r.useState)(5),m=(0,r.useCallback)(()=>{let n=e.current;if(!n)return;let r=n.parentElement;if(!r)return;let i=window.devicePixelRatio||1,a=r.getBoundingClientRect(),o=document.createElement(`canvas`),s=o.getContext(`2d`);n.width>0&&n.height>0&&s&&(o.width=n.width,o.height=n.height,s.drawImage(n,0,0)),n.width=a.width*i,n.height=a.height*i,n.style.width=`${a.width}px`,n.style.height=`${a.height}px`;let c=n.getContext(`2d`);c&&(c.scale(i,i),o.width>0&&o.height>0&&c.drawImage(o,0,0,o.width,o.height,0,0,a.width,a.height),c.lineCap=`round`,c.lineJoin=`round`,c.imageSmoothingEnabled=!0,t.current=c)},[]);(0,r.useEffect)(()=>{m();let e=()=>m();return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[m]);function h(t){let n=e.current.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top}}let g=(0,r.useCallback)(()=>{let e=t.current,n=c.current,r=s.current;if(l.current=!1,!e||n.length===0||!r)return;e.strokeStyle=u,e.lineWidth=f,e.beginPath(),e.moveTo(r.x,r.y);for(let t=0;t<n.length;t++){let i=n[t],a=t===0?r:n[t-1],o={x:(a.x+i.x)/2,y:(a.y+i.y)/2};e.quadraticCurveTo(a.x,a.y,o.x,o.y)}let i=n[n.length-1];e.lineTo(i.x,i.y),e.stroke(),s.current=i,c.current=[]},[u,f]);function _(e){e.preventDefault(),e.target.setPointerCapture(e.pointerId),n.current=!0;let r=h(e);s.current=r,c.current=[];let i=t.current;i&&(i.strokeStyle=u,i.lineWidth=f,i.beginPath(),i.arc(r.x,r.y,f/2,0,Math.PI*2),i.fill())}function v(e){if(!n.current)return;let t=h(e);c.current.push(t),l.current||(l.current=!0,requestAnimationFrame(g))}function y(){n.current&&(n.current=!1,c.current.length>0&&g(),s.current=null)}function b(){let n=e.current,r=t.current;if(!n||!r)return;let i=window.devicePixelRatio||1;r.clearRect(0,0,n.width/i,n.height/i)}function x(){let t=e.current;t&&t.toBlob(e=>{if(!e)return;let t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`doodle.png`,n.click(),URL.revokeObjectURL(t)},`image/png`)}return(0,i.jsxs)(`div`,{className:`doodle-pad`,children:[(0,i.jsxs)(`div`,{className:`doodle-pad__toolbar`,role:`toolbar`,"aria-label":`Drawing tools`,children:[(0,i.jsxs)(`fieldset`,{className:`doodle-pad__group`,role:`radiogroup`,"aria-label":`Brush colour`,children:[(0,i.jsx)(`legend`,{className:`sr-only`,children:`Brush colour`}),a.map(e=>(0,i.jsx)(`button`,{type:`button`,className:`doodle-pad__swatch${u===e.value?` doodle-pad__swatch--active`:``}`,style:{backgroundColor:e.value},onClick:()=>d(e.value),"aria-label":`${e.label} brush`,"aria-pressed":u===e.value,title:e.label},e.value))]}),(0,i.jsx)(`span`,{className:`doodle-pad__divider`,"aria-hidden":`true`}),(0,i.jsxs)(`fieldset`,{className:`doodle-pad__group`,role:`radiogroup`,"aria-label":`Brush size`,children:[(0,i.jsx)(`legend`,{className:`sr-only`,children:`Brush size`}),o.map(e=>(0,i.jsx)(`button`,{type:`button`,className:`doodle-pad__size-btn${f===e.value?` doodle-pad__size-btn--active`:``}`,onClick:()=>p(e.value),"aria-label":`${e.label} brush (${e.value}px)`,"aria-pressed":f===e.value,title:e.label,children:(0,i.jsx)(`span`,{className:`doodle-pad__size-dot`,style:{width:e.value+4,height:e.value+4}})},e.value))]}),(0,i.jsx)(`span`,{className:`doodle-pad__divider`,"aria-hidden":`true`}),(0,i.jsxs)(`div`,{className:`doodle-pad__group`,children:[(0,i.jsxs)(`button`,{type:`button`,className:`doodle-pad__action-btn`,onClick:b,"aria-label":`Clear canvas`,title:`Clear`,children:[(0,i.jsx)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,"aria-hidden":`true`,children:(0,i.jsx)(`path`,{d:`M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-.867 12.142A2 2 0 0116.138 20H7.862a2 2 0 01-1.995-1.858L5 6`})}),(0,i.jsx)(`span`,{children:`Clear`})]}),(0,i.jsxs)(`button`,{type:`button`,className:`doodle-pad__action-btn`,onClick:x,"aria-label":`Download drawing as PNG`,title:`Download`,children:[(0,i.jsx)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,"aria-hidden":`true`,children:(0,i.jsx)(`path`,{d:`M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3`})}),(0,i.jsx)(`span`,{children:`Save`})]})]})]}),(0,i.jsx)(`div`,{className:`doodle-pad__canvas-wrap`,children:(0,i.jsx)(`canvas`,{ref:e,className:`doodle-pad__canvas`,onPointerDown:_,onPointerMove:v,onPointerUp:y,onPointerCancel:y,"aria-label":`Drawing canvas`,role:`img`})}),(0,i.jsx)(`style`,{children:`
        .doodle-pad {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .doodle-pad__toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.75rem 1rem;
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .doodle-pad__group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: none;
          padding: 0;
          margin: 0;
        }

        .doodle-pad__divider {
          width: 1px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        /* ── Colour swatches ──────────── */
        .doodle-pad__swatch {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.15s ease;
          outline: none;
          padding: 0;
        }

        .doodle-pad__swatch:hover {
          transform: scale(1.15);
        }

        .doodle-pad__swatch:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        .doodle-pad__swatch--active {
          border-color: #7ED4E6;
          transform: scale(1.15);
          box-shadow: 0 0 0 3px rgba(126, 212, 230, 0.25);
        }

        /* ── Size buttons ─────────────── */
        .doodle-pad__size-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
          padding: 0;
        }

        .doodle-pad__size-btn:hover {
          border-color: rgba(0, 0, 0, 0.2);
        }

        .doodle-pad__size-btn:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        .doodle-pad__size-btn--active {
          border-color: #7ED4E6;
          background-color: rgba(126, 212, 230, 0.12);
        }

        .doodle-pad__size-dot {
          display: block;
          border-radius: 50%;
          background-color: #000000;
        }

        /* ── Action buttons ───────────── */
        .doodle-pad__action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.5);
          transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .doodle-pad__action-btn:hover {
          color: #000;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .doodle-pad__action-btn:focus-visible {
          outline: 2px solid #7ED4E6;
          outline-offset: 2px;
        }

        /* ── Canvas ───────────────────── */
        .doodle-pad__canvas-wrap {
          width: 100%;
          aspect-ratio: 3 / 2;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background-color: #FFFFFF;
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.04),
            0 1px 4px rgba(0, 0, 0, 0.02);
        }

        .doodle-pad__canvas {
          display: block;
          width: 100%;
          height: 100%;
          cursor: crosshair;
          touch-action: none;
        }

        /* ── Accessibility ────────────── */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* ── Mobile ───────────────────── */
        @media (max-width: 640px) {
          .doodle-pad__toolbar {
            gap: 0.5rem;
            padding: 0.6rem 0.75rem;
          }

          .doodle-pad__swatch {
            width: 24px;
            height: 24px;
          }

          .doodle-pad__size-btn {
            width: 28px;
            height: 28px;
          }

          .doodle-pad__canvas-wrap {
            aspect-ratio: 4 / 3;
          }
        }
      `})]})}export{s as default};