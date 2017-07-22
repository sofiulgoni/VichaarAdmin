import { Component, OnInit } from '@angular/core';

import { Language } from '../language.model/language.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  languageList : any;
  language = new Language();

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
    this.languageList = this.firebase.getLanguageList();
  }

  public openLanguageDetails(key){
    console.log(key);
  }

  public addLanguage(){
    if(this.language.name != ""){
      this.firebase.addLanguage(this.language);
    }
  }

}
