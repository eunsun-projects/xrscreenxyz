import { VrModel } from '@/components/types/vr.type';
import styles from '@/styles/dropdown.module.css';
import { Measurements } from '../../../../public/matterport-assets/sdk';
import { Viewer } from '../MpWebComp';
import { changeBottomLogo } from './changeBottomLogo';

/** ==== togle fullscreen function ==== */
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

export function shareControl(mpsdk: MpSdk, model: VrModel, viewer: Viewer) {
  const uniqueUrl = `https://xr.screenxyz.net/${model.unique}`;
  const innerIframe = viewer.contentWindow.document;
  const fullsc = innerIframe.querySelector('.fullscreen-mode');
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  const widthCheck = window.innerWidth;

  const shareBtn = innerIframe.querySelector('.icon-share')?.parentElement;

  if (window.self !== window.top && shareBtn) shareBtn.style.display = 'none'; // 만약 iframe 임베드 상태면 숨겨라

  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.setAttribute('class', 'material-symbols-outlined');
  fullscreenBtn.classList.add('customfull');
  fullscreenBtn.innerText = 'fullscreen';
  fullscreenBtn.style.zIndex = '9999';
  fullscreenBtn.style.pointerEvents = 'auto';

  // 800 이상에 모바일 아니면
  if (fullsc !== null && fullsc !== undefined && !isMobile && widthCheck > 800) {
    fullsc.insertAdjacentElement('afterend', fullscreenBtn);
    fullscreenBtn.addEventListener('click', toggleFullScreen);
  }

  mpsdk.Measurements.mode.subscribe(function (measurementModeState: Measurements.State) {
    if (measurementModeState.active === true) {
      if (fullscreenBtn) {
        fullscreenBtn.style.display = 'none';
      }
    } else if (measurementModeState.active === false) {
      if (fullscreenBtn) {
        fullscreenBtn.style.display = 'block';
        // let divider = innerIframe.querySelector('.divider');
        // divider.parentNode.appendChild(fullscreenBtn);
      }
    }
  });
  /** ====== share modal on > tag list off ======= */
  const shareModalCon = innerIframe.querySelector('.modal-background') as HTMLElement;
  const bottomControls = innerIframe.querySelector('.bottom-controls') as HTMLElement;

  const config = {
    attributes: true, // observe target's attribute change
  };
  // let customDropdown = document.querySelector('.dropdown_custom')
  const listToggle = function (mutationsList: MutationRecord[]) {
    for (const mutation of mutationsList) {
      if (mutation.target instanceof Element && mutation.target.childElementCount === 1) {
        /** ======== share modal change! =============== */
        const modalBody = innerIframe.querySelector('dialog');
        const input = innerIframe.querySelectorAll('input'); //mobile no input
        const mobiModi = innerIframe.querySelector('.share-controls');
        // console.log(input)
        // console.log(mobiModi)
        // console.log(window.navigator.canShare)

        /** ======= using mutation observer > share modal change ======== */
        if (modalBody && input.length >= 1) {
          input[0].remove();
          const inputGroup = innerIframe.querySelectorAll('.input-group');
          const newinput = document.createElement('input');
          newinput.setAttribute('class', 'input');
          newinput.setAttribute('type', 'text');
          newinput.setAttribute('value', uniqueUrl);

          inputGroup[0].insertAdjacentElement('afterbegin', newinput);

          function copyTo() {
            window.navigator.clipboard.writeText(uniqueUrl);
          }

          const copybttn = innerIframe.querySelectorAll('button');

          copybttn[6].onclick = copyTo;

          const social = innerIframe.querySelector('.social-icons');
          if (social) {
            social.remove();
          }
          const checkbox = innerIframe.querySelector('.checkbox-element');
          if (checkbox) {
            checkbox.remove();
          }
          const modalbody = innerIframe.querySelector('.modal-body');

          function modalstylechange() {
            if (!modalbody || !(modalbody instanceof HTMLElement)) return;
            modalbody.style.paddingBottom = '5px';
            modalbody.style.height = '75px';
            modalbody.style.overflow = 'hidden';
          }
          if (modalbody) {
            modalstylechange();
          }
        } else if (modalBody && mobiModi) {
          const modalbody = innerIframe.querySelector('.modal-body');
          function modalstylechange() {
            if (!modalbody || !(modalbody instanceof HTMLElement)) return;
            modalbody.style.paddingBottom = '5px';
            modalbody.style.height = '75px';
            modalbody.style.overflow = 'hidden';
            modalbody.style.textAlign = 'center';
          }
          if (modalbody) {
            modalstylechange();
          }

          const mobiBttn = innerIframe.querySelectorAll('.share-modal-button');
          if (mobiBttn.length > 1) {
            mobiBttn[0].remove();
            mobiBttn[1].remove();
          }

          const newtxxt = document.createElement('p');
          newtxxt.innerText = 'Link Copied!';
          mobiModi.insertAdjacentElement('beforeend', newtxxt);

          /** ==== when mobile auto open share api ==== */
          if (
            window.navigator.canShare() &&
            mutation.target instanceof Element &&
            mutation.target.className.includes('open')
          ) {
            window.navigator
              .share({
                title: model.title, //modelInfo.name,
                text: model.description, //modelInfo.summary,
                url: uniqueUrl,
              })
              .then(() => {
                console.log('Thanks for sharing!');
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (
            window.navigator.canShare === undefined ||
            window.navigator.canShare === null
          ) {
            /** ==== when desktop write Url to clipbaord ==== */
            window.navigator.clipboard.writeText(uniqueUrl);
          }
        }
        const customDropdown = document.querySelector(`.${styles.dropdown_custom}`) as HTMLElement;
        if (customDropdown) customDropdown.style.display = 'none';
      } else {
        const customDropdown = document.querySelector(`.${styles.dropdown_custom}`) as HTMLElement;
        if (customDropdown) customDropdown.style.display = 'block';

        if (fullsc !== null && fullsc !== undefined && !isMobile && widthCheck > 800) {
          const divider = innerIframe.querySelector('.divider');
          if (divider) divider.parentNode?.appendChild(fullscreenBtn);
          fullscreenBtn.addEventListener('click', toggleFullScreen);
        }
      }
    }
  };

  const bottomObserve = () => changeBottomLogo(viewer);

  const observer = new MutationObserver(listToggle); // mutationObserver 로 공유버튼이 있을시 기기별 동작 제어
  observer.observe(shareModalCon, config);

  const observer2 = new MutationObserver(bottomObserve); // mutationObserver 로 하단 ui 변경시 체인지 로고
  observer2.observe(bottomControls, config);
}
