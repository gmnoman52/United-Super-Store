import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();
  return <html lang="en" {...htmlAttributes}><head><meta charSet="utf-8"/><ScrollViewStyleReset/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>{headNodes}<style>{`:root{--focus:#075525}html,body,#root{max-width:100%;overflow-x:clip}*{box-sizing:border-box}a,button,input{touch-action:manipulation}a:focus-visible,button:focus-visible,[role=button]:focus-visible,input:focus-visible{outline:2px solid var(--focus);outline-offset:3px}body{margin:0}img{max-width:100%}`}</style></head><body {...bodyAttributes}>{children}{bodyNodes}</body></html>;
}
