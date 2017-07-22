import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navBar = false;

  constructor(private firebase: FirebaseService, private router : Router) {
    firebase.checkAuthState().onAuthStateChanged(user => {
      if(user){
        console.log("User Logged In");
        this.navBar = true;
        router.navigate(['book']);
      }else{
        console.log("User Not Logged In");
        router.navigate(['login']);
      }
    });
  }

  public logout(){
    this.firebase.logout()
      .then(success => {
        console.log("Logout Success");
        this.navBar = false;
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.log("Logout Failed");
      });
  }
}
