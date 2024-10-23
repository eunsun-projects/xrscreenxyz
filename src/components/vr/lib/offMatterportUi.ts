// 하단 메타포트 로고 screenxyz로 변경 함수
export function offMatterportUi(viewer: Element) {
  const innerIframe = viewer.shadowRoot?.querySelector('.matterport-webcomponent');
  const bottomUi = innerIframe?.querySelector('.footer-ui') as HTMLDivElement;
  const topUi = innerIframe?.querySelector('.top-ui') as HTMLDivElement;

  if (topUi) topUi.style.display = 'none';
  if (bottomUi) bottomUi.style.display = 'none';
  // const seleclink = innerIframe?.querySelectorAll('.mp-nova-btn-label');
  // const shareBttn = innerIframe?.querySelector('.icon-share');
  // const fullscreen = innerIframe?.querySelector('.fullscreen-mode');
  // const aTag =
  //   "<a class='termchange' style='display:flex; align-items:center; justify-content:center;' href='https://screenxyz.net' target='_blank'><img src='/assets/ui/footer_logo_screen.svg' alt='screenlogo' width=60px height=12px></a>";

  // seleclink?.forEach((e: Element) => {
  //   if (e instanceof HTMLElement && e.innerText === 'Terms') {
  //     e.insertAdjacentHTML('afterend', aTag);
  //     e.remove();
  //   }
  // });
  // /** ======== if kakaotalk > remove share & fullscreen button ========== */
  // if (navigator.userAgent.indexOf('KAKAO') >= 0) {
  //   if (shareBttn) shareBttn.remove();
  //   if (fullscreen) fullscreen.remove();
  // }
}
