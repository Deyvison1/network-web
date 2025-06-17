import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CompanyVisualizationComponent } from '../company-visualization/company-visualization.component';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    CompanyVisualizationComponent,
    ProductsComponent
  ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {}
