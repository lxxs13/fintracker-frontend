import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iconColorClass' })
export class IconColorClassPipe implements PipeTransform {
  private readonly hues = new Set([
    'slate','gray','zinc','neutral','stone',
    'red','orange','amber','yellow','lime','green','emerald','teal',
    'cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'
  ]);
  private readonly shades = new Set(['400','500','600','700']);

  private chip(h: string, s: string) {
    return [
      `bg-${h}-${s}/10`,
      `text-${h}-${s}/90`,
      `border border-${h}-${s}/50`,
    ];
  }
  private text(h: string, s: string) { return `text-${h}-${s}/90`; }

  transform(iconColor: string | null | undefined, mode: 'chip'|'text' = 'chip'): string[] | string {
    const raw = (iconColor ?? '').trim();
    const [h, sRaw] = raw.split('-');
    const hue   = this.hues.has(h) ? h : 'slate';
    const shade = this.shades.has(sRaw) ? sRaw : '500';

    return mode === 'text' ? this.text(hue, shade) : this.chip(hue, shade);
  }
}
