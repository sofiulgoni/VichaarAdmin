import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent{

  public visible = false;

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

}
