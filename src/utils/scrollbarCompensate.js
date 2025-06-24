export function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function compensateBodyScrollbar() {
  const scrollbarWidth = getScrollbarWidth();
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

export function resetBodyScrollbar() {
  document.body.style.paddingRight = '';
} 