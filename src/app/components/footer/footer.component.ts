import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PhonePipe } from '../../pipes/phone.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PhonePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
