export const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
export const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
export const phoneMiddle4 = /(^02.{0}|^01.{1}|[0-9]{4})([0-9]*)([0-9]{4})/g;
export const phoneMiddle3 = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]*)([0-9]{4})/g;
export const youtubeUrl =
  /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/g;
export const vimeoUrl =
  /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
export const linkUrl = /\[(.+?)\]\((https?:\/\/.+?)\)/g;
export const sortRegex = /\{([^\]\[\r\n]*)\}/; //do not set global flag
