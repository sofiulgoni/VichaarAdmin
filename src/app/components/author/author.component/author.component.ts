import { Component, ViewChild, OnInit } from '@angular/core';

import { Author } from '../author.model/author.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  @ViewChild('addModal') modal;
  @ViewChild('editModal') editModal;

  authorList : any;
  author = new Author();
  authorListData : any;
  
  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
    this.authorList = this.firebase.getAuthorList();
    this.authorList.subscribe(authorList => {
      this.authorListData = authorList;
    });
  }

  public openAuthorDetails(key){
    if(this.authorListData != undefined && this.authorListData.length > 0 && key != undefined){
      this.author = this.authorListData.find(author => author.$key == key);
      this.editModal.show();
    }
  }

  public showModal(){
    if(this.author.name != undefined && this.author.name != ""){
      this.modal.show();
    }
  }

  public hideModal(){
    this.modal.hide();
    this.author = new Author();
  }

  public hideEditModal(){
    this.editModal.hide();
    this.author = new Author();
  }

  public saveAuthor(){
    if(this.author.name != "" && this.author.about != ""){
      this.firebase.addAuthor(this.author);
      this.hideModal();
    }
  }

  public updateAuthor(){
    if(this.author.name != ""){
      this.firebase.updateAuthor(this.author);
      this.hideEditModal();
    }
  }

}
