import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-yoga-pose-svg',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size * 0.78"
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      [attr.aria-label]="poseId + ' yoga pose illustration'"
    >
      <defs>
        <radialGradient [attr.id]="'halo-' + poseId" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stop-color="#ffd59e" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#fff3e6" stop-opacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="68" r="56" [attr.fill]="'url(#halo-' + poseId + ')'" stroke="#e8922a" stroke-opacity="0.28" stroke-width="1.5" stroke-dasharray="4 4" />
      <!-- Yoga Mat -->
      <rect x="24" y="118" width="132" height="7" rx="3.5" fill="#c45c00" fill-opacity="0.28" />
      <line x1="28" y1="121.5" x2="152" y2="121.5" stroke="#7a3200" stroke-opacity="0.45" stroke-width="1.5" />

      @switch (poseId) {
        @case ('surya-namaskar') {
          <circle cx="138" cy="28" r="11" fill="#e8922a" fill-opacity="0.35" stroke="#c45c00" stroke-width="1.5" />
          <circle cx="88" cy="36" r="9" fill="#7a3200" />
          <path d="M88 45 L88 78 L78 118 M88 78 L98 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M88 52 L72 30 L88 18 L104 30 L88 52" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('tadasana') {
          <circle cx="90" cy="32" r="9" fill="#7a3200" />
          <path d="M90 42 L90 78 M84 78 L84 118 M96 78 L96 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M86 48 L80 18 L90 12 L100 18 L94 48" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('vrikshasana') {
          <circle cx="90" cy="32" r="9" fill="#7a3200" />
          <path d="M90 42 L90 78 L90 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M90 78 L112 88 L93 96" stroke="#7a3200" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M90 50 L74 34 L90 16 L106 34 L90 50" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('trikonasana') {
          <circle cx="114" cy="52" r="8.5" fill="#7a3200" />
          <path d="M86 78 L60 118 M86 78 L120 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M86 78 L108 58" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M108 58 L120 114 M108 58 L108 24" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('padmasana') {
          <circle cx="90" cy="44" r="9.5" fill="#7a3200" />
          <path d="M90 55 L90 92" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M90 92 C66 94 52 108 62 114 C74 118 88 108 98 106 C108 108 120 118 118 110 C114 100 102 94 90 92 Z" fill="#7a3200" />
          <path d="M90 62 L66 86 L62 100 M90 62 L114 86 L118 100" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('sukhasana') {
          <circle cx="90" cy="46" r="9.5" fill="#7a3200" />
          <path d="M90 57 L90 92" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M62 112 Q90 98 118 112" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M90 64 L70 86 L76 98 M90 64 L110 86 L104 98" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('bhujangasana') {
          <circle cx="128" cy="54" r="9" fill="#7a3200" />
          <path d="M40 114 L84 112 C104 110 114 92 122 66" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M116 74 L114 114" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('dhanurasana') {
          <circle cx="130" cy="54" r="8.5" fill="#7a3200" />
          <path d="M52 72 C68 116 112 116 124 64" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M116 74 L76 68 L52 72" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('paschimottanasana') {
          <circle cx="114" cy="78" r="8.5" fill="#7a3200" />
          <path d="M56 112 L134 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M58 110 C74 88 94 84 112 88" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M98 86 L132 108" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('halasana') {
          <circle cx="118" cy="108" r="8.5" fill="#7a3200" />
          <path d="M110 108 L86 72 L46 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M108 112 L140 112" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('shavasana') {
          <circle cx="42" cy="104" r="8.5" fill="#7a3200" />
          <path d="M52 108 L104 108 L142 112 M104 108 L142 104" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M64 108 L84 116" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @default {
          <!-- Anulom Vilom Pranayama -->
          <circle cx="90" cy="44" r="9.5" fill="#7a3200" />
          <path d="M90 55 L90 92" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M62 112 Q90 98 118 112" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M90 64 L68 88 L64 102 M90 64 L112 68 L98 46" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M48 44 Q58 36 68 44 M112 44 Q122 36 132 44" stroke="#e8922a" stroke-width="2" stroke-linecap="round" />
        }
      }
    </svg>
  `,
})
export class YogaPoseSvgComponent {
  @Input({ required: true }) poseId!: string;
  @Input() size = 140;
}
