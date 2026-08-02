import{o as e,t}from"./react.Od-laFSK.js";import{t as n}from"./jsx-runtime.5oAs05S-.js";var r=e(t(),1),i=n(),a=[{id:`pencil`,label:`Pencil Sketch`,description:`Graphite or charcoal on paper`,value:80},{id:`canvas`,label:`Canvas Painting`,description:`Oil or acrylic on stretched canvas`,value:200},{id:`digital`,label:`Digital Art`,description:`Procreate or Photoshop illustration`,value:150}],o=[{id:`portrait`,label:`Portrait / Bust`,description:`Head and shoulders`,value:1},{id:`half`,label:`Half Body`,description:`Waist-up composition`,value:1.5},{id:`full`,label:`Full Body`,description:`Complete figure`,value:2}],s=[{id:`small`,label:`Small`,description:`Up to A4 / 2000px`,value:1},{id:`medium`,label:`Medium`,description:`Up to A3 / 4000px`,value:1.5},{id:`large`,label:`Large`,description:`A2+ / 6000px+`,value:2}];function c(){let[e,t]=(0,r.useState)(a[0].id),[n,c]=(0,r.useState)(o[0].id),[u,d]=(0,r.useState)(s[0].id),f=(0,r.useMemo)(()=>{let t=a.find(t=>t.id===e)?.value??0,r=o.find(e=>e.id===n)?.value??1,i=s.find(e=>e.id===u)?.value??1;return Math.round(t*r*i)},[e,n,u]);return(0,i.jsxs)(`div`,{className:`calc`,children:[(0,i.jsxs)(`div`,{className:`calc__options`,children:[(0,i.jsx)(l,{legend:`Medium`,options:a,selected:e,onSelect:t}),(0,i.jsx)(l,{legend:`Format`,options:o,selected:n,onSelect:c}),(0,i.jsx)(l,{legend:`Size`,options:s,selected:u,onSelect:d})]}),(0,i.jsxs)(`div`,{className:`calc__result`,"aria-live":`polite`,children:[(0,i.jsx)(`p`,{className:`calc__result-label`,children:`Estimated Price`}),(0,i.jsxs)(`p`,{className:`calc__result-price`,children:[(0,i.jsx)(`span`,{className:`calc__result-currency`,children:`$`}),f]}),(0,i.jsx)(`p`,{className:`calc__result-note`,children:`Final pricing may vary based on complexity and revisions.`})]}),(0,i.jsx)(`style`,{children:`
        .calc {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2rem;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          align-items: start;
        }

        .calc__options {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Option group ─────────────── */
        .calc__group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: none;
          padding: 0;
          margin: 0;
        }

        .calc__group-legend {
          font-family: var(--font-hand);
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--color-ink);
          margin-bottom: 0.5rem;
        }

        .calc__group-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .calc__option {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.8rem 1rem;
          border: 1.5px solid var(--color-tape);
          border-radius: 4px;
          background: var(--color-paper);
          cursor: pointer;
          transition: all 0.2s var(--ease-spring);
          text-align: left;
          min-width: 0;
          flex: 1;
          box-shadow: 1px 2px 0px rgba(0,0,0,0.02);
        }

        .calc__option:hover {
          border-color: var(--color-coral);
          transform: translateY(-2px);
          box-shadow: 2px 4px 0px rgba(0,0,0,0.04);
        }

        .calc__option:focus-visible {
          outline: 2px dashed var(--color-coral);
          outline-offset: 2px;
        }

        .calc__option--active {
          border-color: var(--color-coral);
          background-color: var(--color-cream);
          box-shadow: 2px 4px 0px rgba(244, 123, 137, 0.15);
        }

        .calc__option-label {
          font-family: var(--font-hand);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-ink);
          letter-spacing: 0.02em;
        }

        .calc__option-desc {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-graphite);
        }

        /* ── Result panel ─────────────── */
        .calc__result {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2.5rem 1.5rem;
          border: 1.5px dashed var(--color-tape);
          border-radius: 4px;
          background-color: var(--color-paper);
          text-align: center;
          box-shadow: 4px 6px 0px rgba(0,0,0,0.03);
          position: sticky;
          top: 80px;
          transform: rotate(1deg);
        }

        .calc__result-label {
          font-family: var(--font-hand);
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--color-sky);
        }

        .calc__result-price {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.03em;
          line-height: 1;
          display: flex;
          align-items: flex-start;
        }

        .calc__result-currency {
          font-family: var(--font-hand);
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-coral);
          margin-right: 0.15rem;
          margin-top: 0.15rem;
        }

        .calc__result-note {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-graphite);
          line-height: 1.5;
          max-width: 200px;
        }

        /* ── Responsive ───────────────── */
        @media (max-width: 768px) {
          .calc {
            grid-template-columns: 1fr;
          }

          .calc__result {
            position: static;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem 1rem;
            padding: 1.25rem;
          }

          .calc__result-label {
            width: 100%;
          }

          .calc__result-note {
            max-width: none;
          }

          .calc__group-options {
            flex-direction: column;
          }
        }
      `})]})}function l({legend:e,options:t,selected:n,onSelect:r}){return(0,i.jsxs)(`fieldset`,{className:`calc__group`,role:`radiogroup`,"aria-label":e,children:[(0,i.jsx)(`legend`,{className:`calc__group-legend`,children:e}),(0,i.jsx)(`div`,{className:`calc__group-options`,children:t.map(e=>(0,i.jsxs)(`button`,{type:`button`,className:`calc__option${n===e.id?` calc__option--active`:``}`,onClick:()=>r(e.id),"aria-pressed":n===e.id,"aria-label":`${e.label} — ${e.description}`,children:[(0,i.jsx)(`span`,{className:`calc__option-label`,children:e.label}),(0,i.jsx)(`span`,{className:`calc__option-desc`,children:e.description})]},e.id))})]})}export{c as default};