import{o as e,t}from"./react.Od-laFSK.js";import{t as n}from"./jsx-runtime.5oAs05S-.js";import{t as r}from"./proxy.DcgyapcX.js";var i=e(t(),1),a=n(),o=[`All`,`Sketches`,`Paintings`,`Digital Art`];function s({initial:e=`All`,counts:t}){let[n,s]=(0,i.useState)(e);function c(e){s(e),document.dispatchEvent(new CustomEvent(`category-change`,{detail:{category:e}}))}return(0,a.jsxs)(`div`,{className:`category-filter`,role:`tablist`,"aria-label":`Filter artworks by category`,children:[o.map(e=>{let i=e===n,o=t?.[e];return(0,a.jsxs)(`button`,{role:`tab`,"aria-selected":i,className:`category-filter__tab${i?` category-filter__tab--active`:``}`,onClick:()=>c(e),type:`button`,children:[i&&(0,a.jsx)(r.span,{layoutId:`category-pill`,className:`category-filter__pill`,transition:{type:`spring`,stiffness:380,damping:30}}),(0,a.jsxs)(`span`,{className:`category-filter__icon`,"aria-hidden":`true`,children:[e===`All`&&(0,a.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,a.jsx)(`path`,{d:`M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z`}),(0,a.jsx)(`path`,{d:`M2 12h20`})]}),e===`Sketches`&&(0,a.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`path`,{d:`M12 19l7-7 3 3-7 7-3-3z`}),(0,a.jsx)(`path`,{d:`M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z`}),(0,a.jsx)(`path`,{d:`M2 2l7.586 7.586`}),(0,a.jsx)(`circle`,{cx:`11`,cy:`11`,r:`2`})]}),e===`Paintings`&&(0,a.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`circle`,{cx:`13.5`,cy:`6.5`,r:`.5`}),(0,a.jsx)(`circle`,{cx:`17.5`,cy:`10.5`,r:`.5`}),(0,a.jsx)(`circle`,{cx:`8.5`,cy:`7.5`,r:`.5`}),(0,a.jsx)(`circle`,{cx:`6.5`,cy:`12.5`,r:`.5`}),(0,a.jsx)(`path`,{d:`M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z`})]}),e===`Digital Art`&&(0,a.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,a.jsx)(`path`,{d:`M12 19l7-7 3 3-7 7-3-3z`}),(0,a.jsx)(`path`,{d:`M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z`}),(0,a.jsx)(`path`,{d:`M2 2l7.586 7.586`}),(0,a.jsx)(`circle`,{cx:`11`,cy:`11`,r:`2`})]})]}),(0,a.jsx)(`span`,{className:`category-filter__label`,children:e}),o!==void 0&&(0,a.jsx)(`span`,{className:`category-filter__count`,children:o})]},e)}),(0,a.jsx)(`style`,{children:`
        .category-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-filter__tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.25rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 100px;
          background: transparent;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.45);
          transition: color 0.25s ease, border-color 0.25s ease;
          white-space: nowrap;
        }

        .category-filter__tab:hover {
          color: #000;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .category-filter__tab--active {
          color: #000;
          border-color: transparent;
        }

        .category-filter__pill {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background-color: #7ED4E633;
          border: 1px solid #7ED4E6;
          z-index: -1;
        }

        .category-filter__label {
          position: relative;
          z-index: 1;
        }

        .category-filter__count {
          position: relative;
          z-index: 1;
          font-size: 0.68rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.3);
        }

        .category-filter__tab--active .category-filter__count {
          color: rgba(0, 0, 0, 0.55);
        }
      `})]})}export{s as default};