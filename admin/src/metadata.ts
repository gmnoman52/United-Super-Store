export function setPageMetadata(title: string, description: string) {
  document.title = `${title} | United Super Store Admin`;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) { meta=document.createElement('meta'); meta.name='description'; document.head.appendChild(meta); }
  meta.content=description;
}
