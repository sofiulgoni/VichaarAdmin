import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: any;
 
  constructor(private firebase : FirebaseService, private router : Router) { }

  ngOnInit() {
    
  }

  public login(email, password){
    this.firebase.login(email, password)
      .then(user => {
        console.log(user);
        this.router.navigate(['']);
      })
      .catch(error => {
        console.log(error);
        this.error = error;
      });
  }

}
