import{forwardRef}from'react';
/** Browser host only: supported viewport-segment environment values are measured,
 * not guessed from device model or total width. No content is placed in this probe.
 */
export const ViewportProbe=forwardRef<HTMLDivElement>(function ViewportProbe(_,ref){
 return <div ref={ref} aria-hidden="true" style={{position:'fixed',visibility:'hidden',pointerEvents:'none',left:'env(viewport-segment-left 0 0, 0px)',top:'env(viewport-segment-top 0 0, 0px)',width:'env(viewport-segment-width 0 0, 0px)',height:'env(viewport-segment-height 0 0, 0px)'}}/>;
});
