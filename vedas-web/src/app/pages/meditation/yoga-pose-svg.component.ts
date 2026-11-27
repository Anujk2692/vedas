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
          <stop offset="0%" stop-color="#ffd59e" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#fff3e6" stop-opacity="0.08" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="68" r="56" [attr.fill]="'url(#halo-' + poseId + ')'" stroke="#e8922a" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 4" />
      <rect x="22" y="118" width="136" height="7" rx="3.5" fill="#c45c00" fill-opacity="0.26" />
      <line x1="26" y1="121.5" x2="154" y2="121.5" stroke="#7a3200" stroke-opacity="0.45" stroke-width="1.5" />

      @switch (poseId) {
        @case ('stand-namaste') {
          <circle cx="90" cy="30" r="8.5" fill="#7a3200" />
          <path d="M90 39 L90 78 M85 78 L85 118 M95 78 L95 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M90 46 L76 62 L88 58 M90 46 L104 62 L92 58" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('arms-overhead') {
          <circle cx="90" cy="34" r="8.5" fill="#7a3200" />
          <path d="M90 43 L90 80 M85 80 L85 118 M95 80 L95 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M88 46 L82 14 M92 46 L98 14" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
          <path d="M72 22 L72 10 M68 14 L72 10 L76 14" stroke="#e8922a" stroke-width="2" stroke-linecap="round" />
        }
        @case ('forward-fold') {
          <circle cx="114" cy="84" r="8" fill="#7a3200" />
          <path d="M76 118 L76 66 C88 64 102 68 110 80" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M104 76 L92 116" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('lunge-pose') {
          <circle cx="102" cy="40" r="8" fill="#7a3200" />
          <path d="M96 50 L84 82 L50 116 M84 82 L114 90 L114 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M94 56 L112 76" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('plank-lower') {
          <circle cx="128" cy="76" r="8" fill="#7a3200" />
          <path d="M44 116 L120 82" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M114 86 L114 118" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('sit-dandasana') {
          <circle cx="62" cy="48" r="8.5" fill="#7a3200" />
          <path d="M62 58 L62 110 L134 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M62 72 L70 110" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('sit-cross') {
          <circle cx="90" cy="46" r="9" fill="#7a3200" />
          <path d="M90 56 L90 94" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M60 112 Q90 98 120 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M90 66 L70 90 L76 102 M90 66 L110 90 L104 102" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('kneel-sit') {
          <circle cx="88" cy="42" r="8.5" fill="#7a3200" />
          <path d="M88 52 L88 94 L62 114 L108 114" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M88 64 L104 94" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('lie-prone') {
          <circle cx="136" cy="106" r="8" fill="#7a3200" />
          <path d="M40 112 L126 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M114 112 L134 100" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('lie-supine') {
          <circle cx="44" cy="104" r="8" fill="#7a3200" />
          <path d="M54 110 L106 110 L138 112" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M68 110 L96 115" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('legs-90') {
          <circle cx="52" cy="106" r="8" fill="#7a3200" />
          <path d="M62 112 L110 112 L110 38" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M72 112 L98 112" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('mudra-breath') {
          <circle cx="90" cy="44" r="9.5" fill="#7a3200" />
          <path d="M90 55 L90 92" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M62 112 Q90 98 118 112" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M90 64 L66 88 L62 102 M90 64 L114 88 L118 102" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
          <path d="M46 42 Q56 32 66 42 M114 42 Q124 32 134 42" stroke="#e8922a" stroke-width="2" stroke-linecap="round" />
        }
        @case ('surya-namaskar') {
          <circle cx="138" cy="26" r="10" fill="#e8922a" fill-opacity="0.35" stroke="#c45c00" stroke-width="1.5" />
          <circle cx="88" cy="36" r="8.5" fill="#7a3200" />
          <path d="M88 45 L88 78 L78 118 M88 78 L98 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M88 52 L72 30 L88 18 L104 30 L88 52" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('tadasana') {
          <circle cx="90" cy="32" r="8.5" fill="#7a3200" />
          <path d="M90 42 L90 78 M84 78 L84 118 M96 78 L96 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M86 48 L80 18 L90 12 L100 18 L94 48" stroke="#c45c00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('vrikshasana') {
          <circle cx="90" cy="32" r="8.5" fill="#7a3200" />
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
        @case ('virabhadrasana') {
          <circle cx="90" cy="36" r="8.5" fill="#7a3200" />
          <path d="M90 46 L90 80 L54 118 M90 80 L118 92 L120 118" stroke="#7a3200" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M52 54 L128 54" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('adho-mukha-svanasana') {
          <circle cx="112" cy="84" r="8" fill="#7a3200" />
          <path d="M48 116 L90 50 L132 116" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M108 78 L132 116" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
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
        @case ('vajrasana') {
          <circle cx="88" cy="42" r="9" fill="#7a3200" />
          <path d="M88 52 L88 94 L64 114 L106 114" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M88 64 L104 96" stroke="#c45c00" stroke-width="5" stroke-linecap="round" />
        }
        @case ('gomukhasana') {
          <circle cx="90" cy="42" r="9" fill="#7a3200" />
          <path d="M90 52 L90 94" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M62 112 Q90 96 118 112" stroke="#7a3200" stroke-width="7" stroke-linecap="round" />
          <path d="M90 60 L106 34 L94 64 M90 66 L74 84 L92 70" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('ardha-matsyendrasana') {
          <circle cx="90" cy="42" r="9" fill="#7a3200" />
          <path d="M90 52 L90 94 M62 112 L106 112 L94 82" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M90 62 L114 78 L96 86 M90 62 L68 92" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
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
        @case ('setu-bandhasana') {
          <circle cx="48" cy="106" r="8" fill="#7a3200" />
          <path d="M58 110 C78 76 104 76 122 86 L128 116" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M74 114 L112 114" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('ustrasana') {
          <circle cx="64" cy="46" r="8.5" fill="#7a3200" />
          <path d="M108 114 L78 114 L88 82 C84 64 76 56 68 52" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M78 60 L108 110" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('chakrasana') {
          <circle cx="72" cy="84" r="8" fill="#7a3200" />
          <path d="M56 116 L60 72 C76 42 108 42 122 72 L126 116" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
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
        @case ('sarvangasana') {
          <circle cx="110" cy="108" r="8.5" fill="#7a3200" />
          <path d="M102 108 L88 86 L88 22" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M108 112 L92 78" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('sirsasana') {
          <circle cx="90" cy="108" r="8.5" fill="#7a3200" />
          <path d="M90 98 L90 22" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M74 114 L82 96 L98 96 L106 114" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('balasana') {
          <circle cx="118" cy="104" r="8" fill="#7a3200" />
          <path d="M52 112 L72 92 C86 86 102 92 112 102" stroke="#7a3200" stroke-width="6.5" stroke-linecap="round" />
          <path d="M106 102 L140 114" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @case ('shavasana') {
          <circle cx="42" cy="104" r="8.5" fill="#7a3200" />
          <path d="M52 108 L104 108 L142 112 M104 108 L142 104" stroke="#7a3200" stroke-width="6" stroke-linecap="round" />
          <path d="M64 108 L84 116" stroke="#c45c00" stroke-width="4.5" stroke-linecap="round" />
        }
        @default {
          <!-- Anulom Vilom / Kapalbhati Pranayama -->
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
