import { style } from '@angular/animations';

export const hidden = (orientation: string) => style({
  opacity: 0,
  transform: `translate${orientation}(20px) scale${orientation}(1.2)`
});
export const shown = (orientation: string) => style({
  opacity: 1,
  transform: `translate${orientation}(0) scale${orientation}(1)`
});
export const easeOut = 'cubic-bezier(0.075, 0.82, 0.165, 1)';
export const easeIn = 'cubic-bezier(0.6, 0.04, 0.98, 0.335)';
