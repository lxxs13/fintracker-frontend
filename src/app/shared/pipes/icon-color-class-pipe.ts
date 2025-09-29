import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconColorClass',
})
export class IconColorClassPipe implements PipeTransform {

  private readonly map: Record<string, { bg: string; text: string }> = {
    'cyan-600':    { bg: 'bg-cyan-600/10',    text: 'text-cyan-600/90' },
    'red-700':     { bg: 'bg-red-700/10',     text: 'text-red-700/90' },
    'green-600':   { bg: 'bg-green-600/10',   text: 'text-green-600/90' },
    'pink-600':    { bg: 'bg-pink-600/10',    text: 'text-pink-600/90' },
    'purple-600':  { bg: 'bg-purple-600/10',  text: 'text-purple-600/90' },
    'fuchsia-700': { bg: 'bg-fuchsia-700/10', text: 'text-fuchsia-700/90' },
    'green-500':   { bg: 'bg-green-500/10',   text: 'text-green-500/90' },
    'yellow-700':  { bg: 'bg-yellow-700/10',  text: 'text-yellow-700/90' },
    'green-700':   { bg: 'bg-green-700/10',   text: 'text-green-700/90' },
    'orange-700':  { bg: 'bg-orange-700/10',  text: 'text-orange-700/90' },
    'emerald-700': { bg: 'bg-emerald-700/10', text: 'text-emerald-700/90' },
    'indigo-700':  { bg: 'bg-indigo-700/10',  text: 'text-indigo-700/90' },
    'purple-700':  { bg: 'bg-purple-700/10',  text: 'text-purple-700/90' },
    'blue-800':    { bg: 'bg-blue-800/10',    text: 'text-blue-800/90' },
    'orange-800':  { bg: 'bg-orange-800/10',  text: 'text-orange-800/90' },
    'rose-600':    { bg: 'bg-rose-600/10',    text: 'text-rose-600/90' },
    'indigo-800':  { bg: 'bg-indigo-800/10',  text: 'text-indigo-800/90' },
  };

  transform(iconColor: string | null | undefined): string[] {
    const fallback = { bg: 'bg-slate-500/10', text: 'text-slate-600/90' };
    const cfg = (iconColor && this.map[iconColor]) || fallback;
    return [cfg.bg, cfg.text];
  }
}
