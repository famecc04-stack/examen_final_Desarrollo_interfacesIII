import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightRow]',
  standalone: true
})
export class HighlightRowDirective {
  @Input() appHighlightRowColor = 'rgba(59, 130, 246, 0.08)'; // Light blue accent
  @Input() appHighlightScale = '1.004';

  private originalBackground = '';
  private originalTransform = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.22s ease-in-out');
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.originalBackground = this.el.nativeElement.style.backgroundColor;
    this.originalTransform = this.el.nativeElement.style.transform;
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appHighlightRowColor);
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.appHighlightScale})`);
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', '0 4px 12px -2px rgba(30, 27, 75, 0.08)');
    this.renderer.setStyle(this.el.nativeElement, 'zIndex', '10');
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalBackground || 'transparent');
    this.renderer.setStyle(this.el.nativeElement, 'transform', this.originalTransform || 'none');
    this.renderer.removeStyle(this.el.nativeElement, 'boxShadow');
    this.renderer.removeStyle(this.el.nativeElement, 'zIndex');
  }
}
