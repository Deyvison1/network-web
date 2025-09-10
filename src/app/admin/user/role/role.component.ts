import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role.component.html',
})
export class RoleComponent {

  constructor() {
    alert('oi')
  }

}
